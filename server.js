/**
 * InstaSave — Instagram & Facebook media downloader
 * Paste a public link, preview the media, download it.
 *
 * Instagram extraction engine (3 strategies, best-first):
 *  1. Direct page fetch (browser UA) — full media JSON + og: tags.
 *     Works when Instagram serves the fetching IP (clean IP / proxy).
 *  2. Crawler-UA fetch — og:image thumbnail fallback.
 *  3. oEmbed API — title, author, thumbnail. Works from any server IP.
 *
 * Extra tools:
 *  - /api/audio        MP3 conversion of a reel/video (ffmpeg)
 *  - /api/profile-pic  HD profile picture fetch
 *  - /api/fb-extract   public Facebook video via yt-dlp (og:video fallback)
 *  - /api/story        honest stub (stories need a logged-in session)
 *  - /api/contact      contact form inbox (logged server-side)
 *
 * Stack: Node.js + Express. No client framework (fast = better SEO).
 */
const express = require('express');
const path = require('path');
const { spawn, execFile } = require('child_process');
const fs = require('fs');
const os = require('os');

let ffmpegPath = null;
try {
  ffmpegPath = require('ffmpeg-static');
  // Ensure the binary is executable (some build environments strip the bit).
  try { fs.chmodSync(ffmpegPath, 0o755); } catch { /* ignore */ }
  try { fs.accessSync(ffmpegPath, fs.constants.X_OK); }
  catch { console.warn('[instasave] ffmpeg binary not executable:', ffmpegPath); ffmpegPath = null; }
} catch {
  console.warn('[instasave] ffmpeg-static not available — /api/audio will be disabled');
}

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_URL = (process.env.SITE_URL || 'https://instasave-nb5s.onrender.com').replace(/\/$/, '');

app.use(express.json({ limit: '64kb' }));
app.set('trust proxy', 1);

/* ---------------- Rate limit (in-memory, per IP, /api only) ---------------- */
const hits = new Map();
app.use('/api/', (req, res, next) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const WINDOW = 60 * 1000;
  const MAX = 30;
  let rec = hits.get(ip);
  if (!rec || now - rec.start > WINDOW) rec = { start: now, count: 0 };
  rec.count += 1;
  hits.set(ip, rec);
  if (rec.count > MAX) {
    return res.status(429).json({ ok: false, code: 'RATE_LIMIT', message: 'Too many requests. Please wait a minute and try again.' });
  }
  next();
});

/* ---------------- Helpers ---------------- */
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const CRAWLER_UA = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';

function normalizeInstagramUrl(input) {
  if (!input || typeof input !== 'string') return null;
  let raw = input.trim();
  if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
  let u;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  const host = u.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '');
  if (host !== 'instagram.com' && host !== 'instagr.am') return null;
  // Supports /p/CODE, /reel/CODE, /tv/CODE and username-prefixed /user/p/CODE variants.
  const m = u.pathname.match(/^\/(?:[^/]+\/)?(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
  if (!m) return null;
  const kind = m[1] === 'reels' ? 'reel' : m[1];
  return `https://www.instagram.com/${kind}/${m[2]}/`;
}

function decodeEntities(s) {
  return String(s)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => {
      try { return String.fromCodePoint(parseInt(h, 16)); } catch { return _; }
    })
    .replace(/&#(\d+);/g, (_, d) => {
      try { return String.fromCodePoint(parseInt(d, 10)); } catch { return _; }
    })
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function metaValues(html, property) {
  const out = [];
  const re = new RegExp(
    `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']|` +
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
    'gi'
  );
  let m;
  while ((m = re.exec(html)) !== null) out.push(decodeEntities(m[1] || m[2]));
  return out;
}

async function fetchText(url, { ua, timeoutMs = 20000, accept = 'text/html', fullHeaders = false } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const headers = {
      'User-Agent': ua || UA,
      Accept: `${accept},application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
      'Accept-Language': 'en-US,en;q=0.9',
    };
    if (fullHeaders) {
      // Full browser navigation headers: Instagram serves the complete
      // media JSON (video_versions / dash manifest) only to requests
      // that look like a real browser navigation. Without these we only
      // get the empty app shell.
      headers['Sec-Fetch-Dest'] = 'document';
      headers['Sec-Fetch-Mode'] = 'navigate';
      headers['Sec-Fetch-Site'] = 'none';
      headers['Sec-Fetch-User'] = '?1';
      headers['Upgrade-Insecure-Requests'] = '1';
    }
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers,
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

function cleanTitle(t) {
  return decodeEntities(t || '')
    .replace(/\s*on Instagram.*$/i, '')
    .replace(/\s*\|\s*Instagram.*$/i, '')
    .replace(/^"|"$/g, '')
    .trim()
    .slice(0, 160);
}

/* Extract a balanced [...] or {...} substring starting at startIdx (startIdx
   must point at the opening bracket). String-aware so brackets inside
   quoted strings don't break the depth count. */
function extractBalanced(html, startIdx, open, close) {
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = startIdx; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
    } else {
      if (c === '"') inStr = true;
      else if (c === open) depth++;
      else if (c === close) {
        depth--;
        if (depth === 0) return html.slice(startIdx, i + 1);
      }
    }
  }
  return null;
}

/* Progressive MP4s (with audio) from Instagram's video_versions JSON.
   Returns URLs sorted best-quality-first. */
function extractVideoVersions(html) {
  const out = [];
  let idx = 0;
  while ((idx = html.indexOf('"video_versions":', idx)) !== -1) {
    const arrStart = html.indexOf('[', idx + 17);
    if (arrStart === -1 || arrStart - idx > 40) {
      idx += 17;
      continue;
    }
    const raw = extractBalanced(html, arrStart, '[', ']');
    idx = arrStart + 1;
    if (!raw) continue;
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        for (const v of arr) {
          if (v && typeof v.url === 'string' && /^https:\/\//.test(v.url)) {
            out.push({ url: v.url, width: v.width || 0, height: v.height || 0 });
          }
        }
      }
    } catch {
      /* ignore malformed blob */
    }
  }
  out.sort((a, b) => b.width - a.width || b.height - a.height);
  return [...new Set(out.map((o) => o.url))];
}

/* Fallback: best-quality MP4 from the DASH manifest (video-only track). */
function extractDashVideo(html) {
  const m = html.match(/"video_dash_manifest":"((?:[^"\\]|\\.)*)"/);
  if (!m) return null;
  let mpd;
  try {
    mpd = JSON.parse('"' + m[1] + '"');
  } catch {
    return null;
  }
  mpd = decodeEntities(mpd);
  const reps = [];
  const reRep = /<Representation\b[^>]*>/g;
  let rm;
  while ((rm = reRep.exec(mpd)) !== null) {
    const tag = rm[0];
    if (!/mimeType="video\/mp4"/.test(tag)) continue;
    const bw = parseInt((tag.match(/bandwidth="(\d+)"/) || [])[1] || '0', 10);
    const baseStart = mpd.indexOf('<BaseURL>', rm.index);
    if (baseStart === -1) continue;
    const baseEnd = mpd.indexOf('</BaseURL>', baseStart);
    if (baseEnd === -1 || baseEnd - baseStart > 2000) continue;
    const url = decodeEntities(mpd.slice(baseStart + 9, baseEnd).trim());
    if (/^https:\/\//.test(url)) reps.push({ url, bw });
  }
  reps.sort((a, b) => b.bw - a.bw);
  return reps.length ? reps[0].url : null;
}


/* All candidate progressive video URLs (best quality first) for audio conversion.
   Some renditions can be video-only, so /api/audio tries them in order,
   then falls back to the DASH audio-only stream. */
async function extractAllVideoUrls(canonical) {
  const html = await fetchMediaHtml(canonical);
  if (!html) return { videos: [], dashAudio: null };
  const urls = extractVideoVersions(html);
  const extra = [...metaValues(html, 'og:video:secure_url'), ...metaValues(html, 'og:video')];
  for (const u of extra) if (!urls.includes(u)) urls.push(u);
  return { videos: urls, dashAudio: extractDashAudio(html) };
}


/* Best audio-only stream from the DASH manifest (for reels whose
   progressive variants carry no audio track). Returns URL or null. */
function extractDashAudio(html) {
  const m = html.match(/"video_dash_manifest":"((?:[^"\\]|\\.)*)"/);
  if (!m) return null;
  let mpd;
  try { mpd = JSON.parse('"' + m[1] + '"'); } catch { return null; }
  mpd = decodeEntities(mpd);
  const reps = [];
  const reRep = /<Representation\b[^>]*>/g;
  let rm;
  while ((rm = reRep.exec(mpd)) !== null) {
    const tag = rm[0];
    if (!/^mimeType="audio\//m.test(tag) && !/mimeType="audio\//.test(tag)) continue;
    const bw = parseInt((tag.match(/bandwidth="(\d+)"/) || [])[1] || '0', 10);
    const baseStart = mpd.indexOf('<BaseURL>', rm.index);
    if (baseStart === -1) continue;
    const baseEnd = mpd.indexOf('</BaseURL>', baseStart);
    if (baseEnd === -1 || baseEnd - baseStart > 2000) continue;
    const url = decodeEntities(mpd.slice(baseStart + 9, baseEnd).trim());
    if (/^https:\/\//.test(url)) reps.push({ url, bw });
  }
  reps.sort((a, b) => b.bw - a.bw);
  return reps.length ? reps[0].url : null;
}

/* Fetch page HTML (desktop UA, mobile retry) — shared by audio candidate gathering. */
async function fetchMediaHtml(canonical) {
  let res;
  try {
    res = await fetchText(canonical, { ua: UA, fullHeaders: true, timeoutMs: 25000 });
  } catch { return null; }
  if (!res.ok || res.url.includes('/accounts/login')) return null;
  let html = await res.text();
  if (!html.includes('video_versions')) {
    try {
      const r2 = await fetchText(canonical, {
        ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        fullHeaders: true, timeoutMs: 25000,
      });
      if (r2 && r2.ok) {
        const h2 = await r2.text();
        if (h2.includes('video_versions')) html = h2;
      }
    } catch { /* keep first response */ }
  }
  return html;
}

/* ---------------- Strategy 1: direct page (full media) ---------------- */
async function strategyDirectHTML(canonical) {
  let res;
  try {
    res = await fetchText(canonical, { ua: UA, fullHeaders: true, timeoutMs: 25000 });
  } catch (e) {
    return null;
  }
  if (!res.ok) return null;
  if (res.url.includes('/accounts/login')) return null;
  let html = await res.text();
  if (html.length < 20000) return null; // login shell

  // If the shell has no media data, retry once with a mobile UA.
  if (!html.includes('video_versions') && !html.includes('video_dash_manifest')) {
    try {
      const r2 = await fetchText(canonical, {
        ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        fullHeaders: true,
        timeoutMs: 25000,
      });
      if (r2 && r2.ok) {
        const h2 = await r2.text();
        if (h2.includes('video_versions') || h2.includes('video_dash_manifest')) html = h2;
      }
    } catch {
      /* keep first response */
    }
  }

  const progressive = extractVideoVersions(html);
  const dashBest = progressive.length ? null : extractDashVideo(html);

  const videos = [
    ...metaValues(html, 'og:video:secure_url'),
    ...metaValues(html, 'og:video'),
  ];
  // Backup: embedded JSON blobs sometimes carry direct file URLs.
  const jsonHits = [];
  const reJson = /"(?:video_url|videoUrl)"\s*:\s*"(https:[^"]+)"/g;
  let jm;
  while ((jm = reJson.exec(html)) !== null) {
    jsonHits.push(jm[1].replace(/\\u0026/g, '&').replace(/\\/g, ''));
  }
  const images = [...new Set(metaValues(html, 'og:image'))].filter((u) =>
    /cdninstagram|fbcdn/i.test(u)
  );
  const title = cleanTitle(metaValues(html, 'og:title')[0] || '');
  const desc = cleanTitle(metaValues(html, 'og:description')[0] || '');

  const videoUrl = progressive[0] || dashBest || videos[0] || jsonHits[0] || null;
  if (!videoUrl && !images.length) return null;
  return {
    videoUrl,
    images,
    title: title || desc,
    description: desc,
  };
}

/* ---------------- Strategy 2: crawler UA (thumbnail) ---------------- */
async function strategyCrawler(canonical) {
  let res;
  try {
    res = await fetchText(canonical, { ua: CRAWLER_UA, timeoutMs: 15000 });
  } catch {
    return null;
  }
  if (!res.ok) return null;
  const html = await res.text();
  const images = [...new Set(metaValues(html, 'og:image'))].filter((u) =>
    /cdninstagram|fbcdn/i.test(u)
  );
  const title = cleanTitle(metaValues(html, 'og:title')[0] || '');
  if (!images.length) return null;
  return { images, title };
}

/* ---------------- Strategy 3: oEmbed (metadata + thumbnail, always works) ---------------- */
async function strategyOEmbed(canonical) {
  let res;
  try {
    res = await fetchText(
      `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(canonical)}`,
      { ua: UA, timeoutMs: 15000, accept: 'application/json' }
    );
  } catch {
    return null;
  }
  if (!res.ok) return null;
  let data;
  try {
    data = await res.json();
  } catch {
    return null;
  }
  if (!data || !data.thumbnail_url) return null;
  return {
    title: cleanTitle(data.title || ''),
    author: data.author_name || '',
    authorUrl: data.author_url || '',
    thumbnail: data.thumbnail_url,
    mediaId: data.media_id || '',
  };
}

/* ---------------- Combine strategies ---------------- */
const cache = new Map(); // canonical -> { at, payload }
const CACHE_TTL = 10 * 60 * 1000;

async function extractMedia(canonical) {
  const hit = cache.get(canonical);
  if (hit && Date.now() - hit.at < CACHE_TTL) return hit.payload;

  const [direct, crawler, oembed] = await Promise.all([
    strategyDirectHTML(canonical),
    strategyCrawler(canonical),
    strategyOEmbed(canonical),
  ]);

  const shortcode = canonical.match(/\/(p|reel|tv)\/([A-Za-z0-9_-]+)/)?.[2] || 'media';
  const kind = canonical.match(/\/(p|reel|tv)\//)?.[1] || 'p';

  const images = [
    ...new Set([
      ...(direct?.images || []),
      ...(crawler?.images || []),
      ...(oembed?.thumbnail ? [oembed.thumbnail] : []),
    ]),
  ];
  const title =
    direct?.title || crawler?.title || oembed?.title || `Instagram ${kind === 'reel' ? 'reel' : 'post'} ${shortcode}`;

  let type;
  let limited = false;
  let url = null;

  if (direct?.videoUrl) {
    type = 'video';
    url = direct.videoUrl;
  } else if (images.length > 1 && kind !== 'reel') {
    type = 'carousel';
  } else if (images.length && kind !== 'reel') {
    type = 'image';
  } else if (kind === 'reel' || kind === 'tv') {
    // Reel without a fetchable video file: Instagram is blocking the
    // server IP. We still return the cover + metadata (honest preview).
    type = 'video';
    limited = true;
  } else if (images.length) {
    type = 'image';
  } else {
    const err = new Error('NOT_FOUND');
    err.code = 'NOT_FOUND';
    throw err;
  }

  const payload = {
    type,
    limited,
    shortcode,
    kind,
    url,
    images: type === 'video' && !limited ? [] : images,
    thumbnail: images[0] || null,
    title,
    author: oembed?.author || '',
    authorUrl: oembed?.authorUrl || '',
  };
  cache.set(canonical, { at: Date.now(), payload });
  if (cache.size > 500) cache.clear();
  return payload;
}

/* ---------------- API ---------------- */
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'instasave' }));

app.post('/api/extract', async (req, res) => {
  const canonical = normalizeInstagramUrl(req.body && req.body.url);
  if (!canonical) {
    return res.status(400).json({
      ok: false,
      code: 'INVALID_URL',
      message: 'Please paste a valid public Instagram link (instagram.com/reel/…, /p/… or /tv/…).',
    });
  }
  try {
    const info = await extractMedia(canonical);
    return res.json({ ok: true, source: canonical, ...info });
  } catch (e) {
    const map = {
      NOT_FOUND: [404, 'Could not find media at this link. It may be private, deleted, or the link is wrong.'],
      FETCH_FAILED: [502, 'Could not reach Instagram. Please check the link and try again.'],
    };
    const [status, message] = map[e.code] || map.FETCH_FAILED;
    return res.status(status).json({ ok: false, code: e.code || 'FETCH_FAILED', message });
  }
});

/* ---------------- Audio: reel/video -> MP3 (GET, returns file) ---------------- */
app.get('/api/audio', async (req, res) => {
  const canonical = normalizeInstagramUrl(req.query && req.query.url);
  if (!canonical) {
    return res.status(400).json({
      ok: false, code: 'INVALID_URL',
      message: 'Please paste a valid public Instagram link (instagram.com/reel/… or /p/…).',
    });
  }
  if (!ffmpegPath) {
    return res.status(503).json({
      ok: false, code: 'NO_FFMPEG',
      message: 'Audio conversion is temporarily unavailable. Please try again later.',
    });
  }
  const { videos, dashAudio } = await extractAllVideoUrls(canonical);
  const candidates = [...videos, ...(dashAudio ? [dashAudio] : [])];
  if (!candidates.length) {
    return res.status(404).json({
      ok: false, code: 'NOT_FOUND',
      message: 'Could not find media at this link. It may be private, deleted, or the link is wrong.',
    });
  }
  let converted = null;
  for (const vurl of candidates.slice(0, 6)) {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const inFile = path.join(os.tmpdir(), `is-in-${id}.mp4`);
    const outFile = path.join(os.tmpdir(), `is-out-${id}.mp3`);
    try {
      const up = await fetch(vurl, {
        headers: { 'User-Agent': UA, Referer: 'https://www.instagram.com/' },
        signal: AbortSignal.timeout(45000),
      });
      if (!up.ok || !up.body) throw new Error('upstream');
      const buf = Buffer.from(await up.arrayBuffer());
      if (buf.length < 1024 || buf.length > 60 * 1024 * 1024) throw new Error('size');
      fs.writeFileSync(inFile, buf);
      const ok = await new Promise((resolve) => {
        const p = spawn(ffmpegPath, [
          '-y', '-i', inFile, '-vn',
          '-acodec', 'libmp3lame', '-q:a', '4',
          '-loglevel', 'error', outFile,
        ]);
        const t = setTimeout(() => {
          p.kill('SIGKILL');
          resolve(false);
        }, 90000);
        p.on('error', () => {
          clearTimeout(t);
          resolve(false);
        });
        p.on('close', (code) => {
          clearTimeout(t);
          resolve(code === 0 && fs.existsSync(outFile) && fs.statSync(outFile).size > 1024);
        });
      });
      fs.unlink(inFile, () => {});
      if (ok) {
        converted = { file: outFile, id };
        break;
      }
      fs.unlink(outFile, () => {});
    } catch (e) {
      fs.unlink(inFile, () => {});
      fs.unlink(outFile, () => {});
      console.error('[instasave] /api/audio variant failed:', e.message);
    }
  }
  if (!converted) {
    return res.status(422).json({
      ok: false, code: 'NO_AUDIO',
      message: 'This video has no audio track to convert. Try another reel or video.',
    });
  }
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Disposition', `attachment; filename="instasave-audio-${converted.id}.mp3"`);
  res.setHeader('Cache-Control', 'no-store');
  const stream = fs.createReadStream(converted.file);
  stream.on('close', () => fs.unlink(converted.file, () => {}));
  stream.on('error', () => fs.unlink(converted.file, () => {}));
  stream.pipe(res);
});


/* ---------------- Profile picture (HD) ---------------- */
function normalizeProfileInput(input) {
  if (!input || typeof input !== 'string') return null;
  const raw = input.trim().replace(/^@/, '');
  const m = raw.match(/(?:https?:\/\/)?(?:www\.|m\.)?instagram\.com\/([A-Za-z0-9._]+)/i);
  const username = m ? m[1] : raw;
  if (!/^[A-Za-z0-9._]{1,30}$/.test(username)) return null;
  return username;
}

app.post('/api/profile-pic', async (req, res) => {
  const username = normalizeProfileInput(req.body && (req.body.username || req.body.url));
  if (!username) {
    return res.status(400).json({
      ok: false, code: 'INVALID_INPUT',
      message: 'Please enter a valid Instagram username (letters, numbers, . and _).',
    });
  }
  try {
    const r = await fetchText(`https://www.instagram.com/${username}/`, {
      ua: UA, fullHeaders: true, timeoutMs: 20000,
    });
    if (!r.ok) throw new Error('fetch');
    const html = await r.text();
    let pic = null;
    const hd = html.match(/"profile_pic_url_hd"\s*:\s*"(https:[^"]+)"/);
    const sd = html.match(/"profile_pic_url"\s*:\s*"(https:[^"]+)"/);
    const raw = hd ? hd[1] : sd ? sd[1] : null;
    if (raw) pic = decodeEntities(raw).replace(/\\u0026/g, '&').replace(/\\/g, '');
    if (!pic) {
      const og = metaValues(html, 'og:image')[0];
      if (og && /cdninstagram|fbcdn/i.test(og)) pic = og;
    }
    if (!pic) {
      return res.status(404).json({
        ok: false, code: 'NOT_FOUND',
        message: 'Could not fetch this profile picture. The account may be private or the username may be wrong.',
      });
    }
    return res.json({
      ok: true, type: 'image',
      source: `https://www.instagram.com/${username}/`,
      url: pic, images: [pic], thumbnail: pic,
      title: `@${username} — profile picture`,
      author: username,
    });
  } catch {
    return res.status(502).json({
      ok: false, code: 'FETCH_FAILED',
      message: 'Could not reach Instagram. Please try again in a moment.',
    });
  }
});

/* ---------------- Facebook public video ----------------
   Primary strategy: yt-dlp's facebook extractor resolves public
   reels/videos to a direct xx.fbcdn.net progressive MP4 (no login).
   Fallbacks: legacy og:video scraping (m.facebook.com + mobile UA,
   then the URL as-is, then the crawler UA) — kept in case Facebook
   restores those tags. */
const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

/* Resolve a yt-dlp executable once at startup:
   1) ./yt-dlp-bin  (standalone binary downloaded by the build command)
   2) yt-dlp        (on PATH, e.g. pip install yt-dlp)
   3) python3 -m yt_dlp (module form, no PATH dependency) */
let YTDLP = null;
(function resolveYtDlp() {
  const local = path.join(__dirname, 'yt-dlp-bin');
  try {
    fs.accessSync(local, fs.constants.X_OK);
    YTDLP = { cmd: local, args: [] };
    console.log('[instasave] yt-dlp: using ./yt-dlp-bin');
    return;
  } catch { /* not present */ }
  try {
    require('child_process').execFileSync('yt-dlp', ['--version'], { timeout: 15000, stdio: 'pipe' });
    YTDLP = { cmd: 'yt-dlp', args: [] };
    console.log('[instasave] yt-dlp: using PATH binary');
    return;
  } catch { /* not on PATH */ }
  try {
    require('child_process').execFileSync('python3', ['-m', 'yt_dlp', '--version'], { timeout: 15000, stdio: 'pipe' });
    YTDLP = { cmd: 'python3', args: ['-m', 'yt_dlp'] };
    console.log('[instasave] yt-dlp: using python3 -m yt_dlp');
    return;
  } catch { /* unavailable */ }
  console.warn('[instasave] yt-dlp not found — /api/fb-extract falls back to og:video scraping');
})();

/* Facebook via yt-dlp.
   Facebook no longer serves og:video tags to scrapers (mobile pages only
   carry og:title/og:image now; the full page is a JS shell), so the
   yt-dlp facebook extractor is the primary strategy — it resolves public
   videos to direct progressive MP4s (hd/sd, video+audio) with no login.
   No shell is used (execFile + args array), so a pasted URL can never
   become shell injection; the URL is also pre-validated as facebook/fb.watch. */
function strategyFacebookYtDlp(url) {
  return new Promise((resolve) => {
    if (!YTDLP) return resolve(null);
    const args = [
      ...YTDLP.args,
      '--no-playlist', '--skip-download', '--no-warnings',
      '--socket-timeout', '15', '--retries', '2',
      '-f', 'hd/sd/best[ext=mp4]/best',
      '--print', '%(url)s\n%(title)s\n%(thumbnail)s',
      '--', url,
    ];
    execFile(YTDLP.cmd, args, { timeout: 60000, maxBuffer: 4 * 1024 * 1024 }, (err, stdout) => {
      if (err) {
        console.warn('[fb-extract] yt-dlp failed:', String((err && err.message) || err).slice(0, 140));
        return resolve(null);
      }
      const lines = String(stdout).split('\n');
      const videoUrl = (lines[0] || '').trim();
      if (!/^https:\/\//.test(videoUrl)) return resolve(null);
      resolve({
        videoUrl,
        title: cleanTitle(lines[1] || ''),
        thumbnail: (lines[2] || '').trim() || null,
      });
    });
  });
}

async function strategyFacebook(url) {
  // Primary: yt-dlp resolves public FB videos to direct MP4s.
  try {
    const viaYtDlp = await strategyFacebookYtDlp(url);
    if (viaYtDlp) return viaYtDlp;
  } catch { /* fall through to legacy scraping */ }
  const tries = [];
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase().replace(/^(www|m|web)\./, '');
    if (host === 'facebook.com' || host.endsWith('.facebook.com') || host === 'fb.com') {
      u.hostname = 'm.facebook.com';
      tries.push([u.toString(), MOBILE_UA]);
    }
  } catch {
    /* fall through to generic tries */
  }
  tries.push([url, MOBILE_UA]);
  tries.push([url, CRAWLER_UA]);
  for (const [turl, ua] of tries) {
    let r;
    try {
      r = await fetchText(turl, { ua, timeoutMs: 20000 });
    } catch {
      continue;
    }
    if (!r.ok) continue;
    const html = await r.text();
    const vids = [...metaValues(html, 'og:video:secure_url'), ...metaValues(html, 'og:video')]
      .filter((x) => /^https:\/\//.test(x));
    if (!vids.length) continue;
    const title = cleanTitle(metaValues(html, 'og:title')[0] || '');
    const imgs = [...new Set(metaValues(html, 'og:image'))];
    return { videoUrl: vids[0], title, thumbnail: imgs[0] || null };
  }
  return null;
}
function normalizeFacebookUrl(input) {
  if (!input || typeof input !== 'string') return null;
  let raw = input.trim();
  if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
  let u;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  const host = u.hostname.toLowerCase().replace(/^(www|m|web)\./, '');
  if (host !== 'facebook.com' && host !== 'fb.watch' && host !== 'fb.com') return null;
  return u.toString();
}

app.post('/api/fb-extract', async (req, res) => {
  const url = normalizeFacebookUrl(req.body && req.body.url);
  if (!url) {
    return res.status(400).json({
      ok: false, code: 'INVALID_URL',
      message: 'Please paste a valid Facebook video link (facebook.com or fb.watch).',
    });
  }
  try {
    const found = await strategyFacebook(url);
    if (!found) {
      return res.status(404).json({
        ok: false, code: 'NOT_FOUND',
        message: 'Could not fetch this Facebook video. It may be private, age-restricted, or login-required — we only support public videos.',
      });
    }
    return res.json({
      ok: true, type: 'video', source: url,
      url: found.videoUrl, images: [], thumbnail: found.thumbnail,
      title: found.title || 'Facebook video',
    });
  } catch {
    return res.status(502).json({
      ok: false, code: 'FETCH_FAILED',
      message: 'Could not reach Facebook. Please check the link and try again.',
    });
  }
});

/* ---------------- Stories: honest stub ----------------
   Instagram serves stories only to logged-in sessions. We never ask for
   credentials, so story downloads are not offered. This endpoint exists so
   the UI can show a clear, honest explanation instead of failing silently. */
app.post('/api/story', (req, res) =>
  res.status(400).json({
    ok: false, code: 'LOGIN_REQUIRED',
    message:
      'Instagram only shows stories to logged-in accounts, so no legitimate no-login tool can download them. ' +
      'We will never ask for your Instagram password — any site that does is not safe.',
  })
);

/* ---------------- Contact form ---------------- */
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message || typeof message !== 'string') {
    return res.status(400).json({ ok: false, message: 'Please fill in your name, email and message.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return res.status(400).json({ ok: false, message: 'Please enter a valid email address.' });
  }
  if (message.length > 5000) {
    return res.status(400).json({ ok: false, message: 'Your message is too long (max 5000 characters).' });
  }
  console.log(
    `[contact] ${String(name).slice(0, 80)} <${String(email).slice(0, 120)}>: ${message.slice(0, 300)}`
  );
  return res.json({ ok: true });
});

/**
 * Proxy download so the file saves directly (avoids new-tab / hotlink issues).
 * SSRF guard: only Instagram CDN hosts are allowed.
 */
const CDN_HOSTS = ['fbcdn.net', 'cdninstagram.com'];
app.get('/api/download', async (req, res) => {
  const target = req.query.u;
  const kind = req.query.t === 'image' ? 'image' : 'video';
  if (!target || typeof target !== 'string') return res.status(400).send('Missing url');
  let u;
  try {
    u = new URL(target);
  } catch {
    return res.status(400).send('Bad url');
  }
  if (u.protocol !== 'https:' || !CDN_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith('.' + h))) {
    return res.status(403).send('Forbidden host');
  }
  try {
    const upstream = await fetch(u.toString(), {
      headers: { 'User-Agent': UA, Referer: 'https://www.instagram.com/' },
    });
    if (!upstream.ok || !upstream.body) return res.status(502).send('Upstream failed');
    const ext = kind === 'image' ? 'jpg' : 'mp4';
    const ct = upstream.headers.get('content-type') || (kind === 'image' ? 'image/jpeg' : 'video/mp4');
    res.setHeader('Content-Type', ct);
    res.setHeader('Content-Disposition', `attachment; filename="instasave-${Date.now()}.${ext}"`);
    const len = upstream.headers.get('content-length');
    if (len) res.setHeader('Content-Length', len);
    res.setHeader('Cache-Control', 'no-store');
    const { Readable } = require('stream');
    Readable.fromWeb(upstream.body).pipe(res);
  } catch {
    res.status(502).send('Download failed');
  }
});

/* ---------------- SEO pages (clean URLs) ---------------- */
const PAGES = {
  '/': 'index.html',
  '/instagram-reels-downloader': 'instagram-reels-downloader.html',
  '/instagram-video-downloader': 'instagram-video-downloader.html',
  '/instagram-photo-downloader': 'instagram-photo-downloader.html',
  '/instagram-audio-downloader': 'instagram-audio-downloader.html',
  '/instagram-story-downloader': 'instagram-story-downloader.html',
  '/instagram-profile-downloader': 'instagram-profile-downloader.html',
  '/facebook-video-downloader': 'facebook-video-downloader.html',
  '/how-to-download': 'how-to-download.html',
  '/faq': 'faq.html',
  '/privacy-policy': 'privacy-policy.html',
  '/terms-of-service': 'terms-of-service.html',
  '/dmca': 'dmca.html',
  '/contact': 'contact.html',
};
for (const [route, file] of Object.entries(PAGES)) {
  app.get(route, (req, res) => res.sendFile(path.join(__dirname, 'public', file)));
}

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  index: false,
  // HTML is never cached: content edits must appear immediately.
  // Versioned assets (?v=N) keep the 1h cache safely.
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
  },
}));
app.get('/robots.txt', (req, res) => res.sendFile(path.join(__dirname, 'public', 'robots.txt')));
app.get('/sitemap.xml', (req, res) => res.sendFile(path.join(__dirname, 'public', 'sitemap.xml')));

app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', '404.html')));

app.listen(PORT, () => console.log(`InstaSave listening on ${PORT}`));
module.exports = app;
