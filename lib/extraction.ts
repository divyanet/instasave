/**
 * InstaSave extraction engine — TypeScript port of the Express server.js engine.
 * Instagram (3 strategies, best-first) + Facebook (yt-dlp primary) + shared helpers.
 * Used by the /api/* route handlers. Node.js runtime only.
 */

import { execFile, execFileSync, spawn } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import os from 'os';
import path from 'path';
import type { NextRequest } from 'next/server';

/* ---------------- constants ---------------- */

export const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
export const CRAWLER_UA = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';
export const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  'https://instasave-nb5s.onrender.com'
).replace(/\/$/, '');

export const CDN_HOSTS = ['fbcdn.net', 'cdninstagram.com'];

export class ExtractError extends Error {
  code: string;
  constructor(code: string) {
    super(code);
    this.code = code;
  }
}

export type MediaInfo = {
  type: 'video' | 'image' | 'carousel';
  limited: boolean;
  shortcode: string;
  kind: string;
  url: string | null;
  images: string[];
  thumbnail: string | null;
  title: string;
  author: string;
  authorUrl: string;
};

/* ---------------- rate limit (in-memory, per IP, /api only) ---------------- */

const hits = new Map<string, { start: number; count: number }>();

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) {
    const first = fwd.split(',')[0].trim();
    if (first) return first;
  }
  return 'unknown';
}

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const WINDOW = 60 * 1000;
  const MAX = 30;
  let rec = hits.get(ip);
  if (!rec || now - rec.start > WINDOW) rec = { start: now, count: 0 };
  rec.count += 1;
  hits.set(ip, rec);
  return rec.count > MAX;
}

/* ---------------- URL normalizers ---------------- */

export function normalizeInstagramUrl(input: unknown): string | null {
  if (!input || typeof input !== 'string') return null;
  let raw = input.trim();
  if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
  let u: URL;
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

export function normalizeFacebookUrl(input: unknown): string | null {
  if (!input || typeof input !== 'string') return null;
  let raw = input.trim();
  if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  const host = u.hostname.toLowerCase().replace(/^(www|m|web)\./, '');
  if (host !== 'facebook.com' && host !== 'fb.watch' && host !== 'fb.com') return null;
  return u.toString();
}

export function normalizeProfileInput(input: unknown): string | null {
  if (!input || typeof input !== 'string') return null;
  const raw = input.trim().replace(/^@/, '');
  const m = raw.match(/(?:https?:\/\/)?(?:www\.|m\.)?instagram\.com\/([A-Za-z0-9._]+)/i);
  const username = m ? m[1] : raw;
  if (!/^[A-Za-z0-9._]{1,30}$/.test(username)) return null;
  return username;
}

/* ---------------- HTML helpers ---------------- */

export function decodeEntities(s: string): string {
  return String(s)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h: string) => {
      try {
        return String.fromCodePoint(parseInt(h, 16));
      } catch {
        return _;
      }
    })
    .replace(/&#(\d+);/g, (_, d: string) => {
      try {
        return String.fromCodePoint(parseInt(d, 10));
      } catch {
        return _;
      }
    })
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export function metaValues(html: string, property: string): string[] {
  const out: string[] = [];
  const re = new RegExp(
    `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']|` +
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
    'gi'
  );
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) out.push(decodeEntities(m[1] || m[2]));
  return out;
}

export async function fetchText(
  url: string,
  { ua, timeoutMs = 20000, accept = 'text/html', fullHeaders = false }: {
    ua?: string;
    timeoutMs?: number;
    accept?: string;
    fullHeaders?: boolean;
  } = {}
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const headers: Record<string, string> = {
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
    return await fetch(url, { signal: ctrl.signal, redirect: 'follow', headers });
  } finally {
    clearTimeout(timer);
  }
}

export function cleanTitle(t: string): string {
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
export function extractBalanced(html: string, startIdx: number, open: string, close: string): string | null {
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
export function extractVideoVersions(html: string): string[] {
  const out: { url: string; width: number; height: number }[] = [];
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
export function extractDashVideo(html: string): string | null {
  const m = html.match(/"video_dash_manifest":"((?:[^"\\]|\\.)*)"/);
  if (!m) return null;
  let mpd: string;
  try {
    mpd = JSON.parse('"' + m[1] + '"');
  } catch {
    return null;
  }
  mpd = decodeEntities(mpd);
  const reps: { url: string; bw: number }[] = [];
  const reRep = /<Representation\b[^>]*>/g;
  let rm: RegExpExecArray | null;
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

/* Best audio-only stream from the DASH manifest (for reels whose
   progressive variants carry no audio track). Returns URL or null. */
export function extractDashAudio(html: string): string | null {
  const m = html.match(/"video_dash_manifest":"((?:[^"\\]|\\.)*)"/);
  if (!m) return null;
  let mpd: string;
  try {
    mpd = JSON.parse('"' + m[1] + '"');
  } catch {
    return null;
  }
  mpd = decodeEntities(mpd);
  const reps: { url: string; bw: number }[] = [];
  const reRep = /<Representation\b[^>]*>/g;
  let rm: RegExpExecArray | null;
  while ((rm = reRep.exec(mpd)) !== null) {
    const tag = rm[0];
    if (!/mimeType="audio\//.test(tag)) continue;
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

/* ---------------- shared media-HTML fetch ---------------- */

/* Fetch page HTML (desktop UA, mobile retry) — shared by audio candidate gathering. */
export async function fetchMediaHtml(canonical: string): Promise<string | null> {
  let res: Response;
  try {
    res = await fetchText(canonical, { ua: UA, fullHeaders: true, timeoutMs: 25000 });
  } catch {
    return null;
  }
  if (!res.ok || res.url.includes('/accounts/login')) return null;
  let html = await res.text();
  if (!html.includes('video_versions')) {
    try {
      const r2 = await fetchText(canonical, { ua: MOBILE_UA, fullHeaders: true, timeoutMs: 25000 });
      if (r2 && r2.ok) {
        const h2 = await r2.text();
        if (h2.includes('video_versions')) html = h2;
      }
    } catch {
      /* keep first response */
    }
  }
  return html;
}

/* All candidate progressive video URLs (best quality first) for audio conversion.
   Some renditions can be video-only, so /api/audio tries them in order,
   then falls back to the DASH audio-only stream. */
export async function extractAllVideoUrls(
  canonical: string
): Promise<{ videos: string[]; dashAudio: string | null }> {
  const html = await fetchMediaHtml(canonical);
  if (!html) return { videos: [], dashAudio: null };
  const urls = extractVideoVersions(html);
  const extra = [...metaValues(html, 'og:video:secure_url'), ...metaValues(html, 'og:video')];
  for (const u of extra) if (!urls.includes(u)) urls.push(u);
  return { videos: urls, dashAudio: extractDashAudio(html) };
}

/* ---------------- Strategy 1: direct page (full media) ---------------- */

async function strategyDirectHTML(canonical: string) {
  let res: Response;
  try {
    res = await fetchText(canonical, { ua: UA, fullHeaders: true, timeoutMs: 25000 });
  } catch {
    return null;
  }
  if (!res.ok) return null;
  if (res.url.includes('/accounts/login')) return null;
  let html = await res.text();
  if (html.length < 20000) return null; // login shell

  // If the shell has no media data, retry once with a mobile UA.
  if (!html.includes('video_versions') && !html.includes('video_dash_manifest')) {
    try {
      const r2 = await fetchText(canonical, { ua: MOBILE_UA, fullHeaders: true, timeoutMs: 25000 });
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

  const videos = [...metaValues(html, 'og:video:secure_url'), ...metaValues(html, 'og:video')];
  // Backup: embedded JSON blobs sometimes carry direct file URLs.
  const jsonHits: string[] = [];
  const reJson = /"(?:video_url|videoUrl)"\s*:\s*"(https:[^"]+)"/g;
  let jm: RegExpExecArray | null;
  while ((jm = reJson.exec(html)) !== null) {
    jsonHits.push(jm[1].replace(/\\u0026/g, '&').replace(/\\/g, ''));
  }
  const images = [...new Set(metaValues(html, 'og:image'))].filter((u) => /cdninstagram|fbcdn/i.test(u));
  const title = cleanTitle(metaValues(html, 'og:title')[0] || '');
  const desc = cleanTitle(metaValues(html, 'og:description')[0] || '');

  const videoUrl = progressive[0] || dashBest || videos[0] || jsonHits[0] || null;
  if (!videoUrl && !images.length) return null;
  return { videoUrl, images, title: title || desc, description: desc };
}

/* ---------------- Strategy 2: crawler UA (thumbnail) ---------------- */

async function strategyCrawler(canonical: string) {
  let res: Response;
  try {
    res = await fetchText(canonical, { ua: CRAWLER_UA, timeoutMs: 15000 });
  } catch {
    return null;
  }
  if (!res.ok) return null;
  const html = await res.text();
  const images = [...new Set(metaValues(html, 'og:image'))].filter((u) => /cdninstagram|fbcdn/i.test(u));
  const title = cleanTitle(metaValues(html, 'og:title')[0] || '');
  if (!images.length) return null;
  return { images, title };
}

/* ---------------- Strategy 3: oEmbed (metadata + thumbnail, always works) ---------------- */

async function strategyOEmbed(canonical: string) {
  let res: Response;
  try {
    res = await fetchText(`https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(canonical)}`, {
      ua: UA,
      timeoutMs: 15000,
      accept: 'application/json',
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;
  let data: Record<string, string>;
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

const cache = new Map<string, { at: number; payload: MediaInfo }>();
const CACHE_TTL = 10 * 60 * 1000;

export async function extractMedia(canonical: string): Promise<MediaInfo> {
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

  let type: MediaInfo['type'];
  let limited = false;
  let url: string | null = null;

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
    throw new ExtractError('NOT_FOUND');
  }

  const payload: MediaInfo = {
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

/* ---------------- ffmpeg (audio conversion) ---------------- */

let ffmpegPath: string | null = null;
let ffmpegResolved = false;

export function getFfmpegPath(): string | null {
  if (!ffmpegResolved) {
    ffmpegResolved = true;
    try {
      const p = ffmpegStatic as unknown as string;
      try {
        fs.chmodSync(p, 0o755);
      } catch {
        /* ignore */
      }
      fs.accessSync(p, fs.constants.X_OK);
      ffmpegPath = p;
    } catch {
      console.warn('[instasave] ffmpeg binary not available — /api/audio will be disabled');
      ffmpegPath = null;
    }
  }
  return ffmpegPath;
}

/** Download each candidate video in order, convert the first that works to MP3. */
export async function convertFirstWorkingToMp3(
  candidates: string[]
): Promise<{ file: string; id: string } | null> {
  const bin = getFfmpegPath();
  if (!bin) return null;
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
      const ok = await new Promise<boolean>((resolve) => {
        const p = spawn(/*turbopackIgnore: true*/ bin, ['-y', '-i', inFile, '-vn', '-acodec', 'libmp3lame', '-q:a', '4', '-loglevel', 'error', outFile]);
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
      if (ok) return { file: outFile, id };
      fs.unlink(outFile, () => {});
    } catch (e) {
      fs.unlink(inFile, () => {});
      fs.unlink(outFile, () => {});
      console.error('[instasave] /api/audio variant failed:', e instanceof Error ? e.message : e);
    }
  }
  return null;
}

/* ---------------- yt-dlp (Facebook videos) ---------------- */

type YtDlp = { cmd: string; args: string[] } | null;
let YTDLP: YtDlp = null;
let ytdlpResolved = false;

/* Resolve a yt-dlp executable (lazy, once):
   1) ./yt-dlp-bin  (standalone binary downloaded by the build command)
   2) yt-dlp        (on PATH)
   3) python3 -m yt_dlp (module form, no PATH dependency) */
export function getYtDlp(): YtDlp {
  if (ytdlpResolved) return YTDLP;
  ytdlpResolved = true;
  const local = path.join(process.cwd(), 'yt-dlp-bin');
  try {
    fs.accessSync(local, fs.constants.X_OK);
    console.log('[instasave] yt-dlp: using ./yt-dlp-bin');
    YTDLP = { cmd: local, args: [] };
    return YTDLP;
  } catch {
    /* not present */
  }
  try {
    execFileSync('yt-dlp', ['--version'], { timeout: 15000, stdio: 'pipe' });
    console.log('[instasave] yt-dlp: using PATH binary');
    YTDLP = { cmd: 'yt-dlp', args: [] };
    return YTDLP;
  } catch {
    /* not on PATH */
  }
  try {
    execFileSync('python3', ['-m', 'yt_dlp', '--version'], { timeout: 15000, stdio: 'pipe' });
    console.log('[instasave] yt-dlp: using python3 -m yt_dlp');
    YTDLP = { cmd: 'python3', args: ['-m', 'yt_dlp'] };
    return YTDLP;
  } catch {
    /* unavailable */
  }
  console.warn('[instasave] yt-dlp not found — /api/fb-extract falls back to og:video scraping');
  return null;
}

/* Facebook via yt-dlp.
   Facebook no longer serves og:video tags to scrapers (mobile pages only
   carry og:title/og:image now; the full page is a JS shell), so the
   yt-dlp facebook extractor is the primary strategy — it resolves public
   videos to direct progressive MP4s (hd/sd, video+audio) with no login.
   No shell is used (execFile + args array), so a pasted URL can never
   become shell injection; the URL is also pre-validated as facebook/fb.watch. */
function strategyFacebookYtDlp(url: string): Promise<{ videoUrl: string; title: string; thumbnail: string | null } | null> {
  return new Promise((resolve) => {
    const ytdlp = getYtDlp();
    if (!ytdlp) return resolve(null);
    const args = [
      ...ytdlp.args,
      '--no-playlist',
      '--skip-download',
      '--no-warnings',
      '--socket-timeout',
      '15',
      '--retries',
      '2',
      '-f',
      'hd/sd/best[ext=mp4]/best',
      '--print',
      '%(url)s\n%(title)s\n%(thumbnail)s',
      '--',
      url,
    ];
    execFile(/*turbopackIgnore: true*/ ytdlp.cmd, args, { timeout: 60000, maxBuffer: 4 * 1024 * 1024 }, (err, stdout) => {
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

async function strategyFacebookLegacy(url: string) {
  const tries: [string, string][] = [];
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
    let r: Response;
    try {
      r = await fetchText(turl, { ua, timeoutMs: 20000 });
    } catch {
      continue;
    }
    if (!r.ok) continue;
    const html = await r.text();
    const vids = [...metaValues(html, 'og:video:secure_url'), ...metaValues(html, 'og:video')].filter((x) =>
      /^https:\/\//.test(x)
    );
    if (!vids.length) continue;
    const title = cleanTitle(metaValues(html, 'og:title')[0] || '');
    const imgs = [...new Set(metaValues(html, 'og:image'))];
    return { videoUrl: vids[0], title, thumbnail: imgs[0] || null };
  }
  return null;
}

export async function extractFacebookVideo(url: string) {
  try {
    const viaYtDlp = await strategyFacebookYtDlp(url);
    if (viaYtDlp) return viaYtDlp;
  } catch {
    /* fall through to legacy scraping */
  }
  return strategyFacebookLegacy(url);
}

/* ---------------- profile picture ---------------- */

export async function fetchProfilePic(username: string): Promise<string | null> {
  const r = await fetchText(`https://www.instagram.com/${username}/`, {
    ua: UA,
    fullHeaders: true,
    timeoutMs: 20000,
  });
  if (!r.ok) throw new ExtractError('FETCH_FAILED');
  const html = await r.text();
  let pic: string | null = null;
  const hd = html.match(/"profile_pic_url_hd"\s*:\s*"(https:[^"]+)"/);
  const sd = html.match(/"profile_pic_url"\s*:\s*"(https:[^"]+)"/);
  const raw = hd ? hd[1] : sd ? sd[1] : null;
  if (raw) pic = decodeEntities(raw).replace(/\\u0026/g, '&').replace(/\\/g, '');
  if (!pic) {
    const og = metaValues(html, 'og:image')[0];
    if (og && /cdninstagram|fbcdn/i.test(og)) pic = og;
  }
  return pic;
}

/* ---------------- download proxy guard ---------------- */

export function isAllowedDownloadHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return CDN_HOSTS.some((d) => h === d || h.endsWith('.' + d));
}
