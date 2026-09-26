/**
 * InstaSave — Instagram Reels & Photo Downloader
 * Paste a public Instagram link, preview the media, download it.
 *
 * Extraction engine (3 strategies, best-first):
 *  1. Direct page fetch (browser UA) — full media JSON + og: tags.
 *     Works when Instagram serves the fetching IP (clean IP / proxy).
 *  2. Crawler-UA fetch — og:image thumbnail fallback.
 *  3. oEmbed API — title, author, thumbnail. Works from any server IP.
 *
 * Stack: Node.js + Express. No client framework (fast = better SEO).
 */
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_URL = (process.env.SITE_URL || 'https://instasave.example.com').replace(/\/$/, '');

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

async function fetchText(url, { ua, timeoutMs = 20000, accept = 'text/html' } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': ua || UA,
        Accept: `${accept},application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
        'Accept-Language': 'en-US,en;q=0.9',
      },
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

/* ---------------- Strategy 1: direct page (full media) ---------------- */
async function strategyDirectHTML(canonical) {
  let res;
  try {
    res = await fetchText(canonical, { ua: UA });
  } catch (e) {
    return null;
  }
  if (!res.ok) return null;
  if (res.url.includes('/accounts/login')) return null;
  const html = await res.text();
  if (html.length < 20000) return null; // login shell

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

  if (!videos.length && !jsonHits.length && !images.length) return null;
  return {
    videoUrl: videos[0] || jsonHits[0] || null,
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
  '/instagram-photo-downloader': 'instagram-photo-downloader.html',
  '/how-to-download': 'how-to-download.html',
  '/faq': 'faq.html',
};
for (const [route, file] of Object.entries(PAGES)) {
  app.get(route, (req, res) => res.sendFile(path.join(__dirname, 'public', file)));
}

app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h', index: false }));
app.get('/robots.txt', (req, res) => res.sendFile(path.join(__dirname, 'public', 'robots.txt')));
app.get('/sitemap.xml', (req, res) => res.sendFile(path.join(__dirname, 'public', 'sitemap.xml')));

app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', '404.html')));

app.listen(PORT, () => console.log(`InstaSave listening on ${PORT}`));
module.exports = app;
