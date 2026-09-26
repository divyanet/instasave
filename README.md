# InstaSave — Instagram Reels & Photo Downloader

Free, SEO-optimized web tool: paste a public Instagram link, preview the media, download it. No login, no watermark.

## What it does
- **Reels** (`/reel/`, `/tv/`) → MP4 download when Instagram serves the video; otherwise an honest preview (cover, title, author) + cover-photo download.
- **Photos & carousels** (`/p/`) → JPG download, every carousel image individually.
- Graceful, transparent handling when Instagram rate-limits server IPs (see "Known limitation").

## Stack
- Node.js + Express, server-rendered pages (SEO friendly, zero client framework)
- Vanilla HTML/CSS/JS frontend — premium dark UI, mobile-first

## Pages (all interlinked, clean URLs)
| Route | File | Purpose |
|---|---|---|
| `/` | `index.html` | Main tool + features + FAQ teaser |
| `/instagram-reels-downloader` | `instagram-reels-downloader.html` | Reels keyword page |
| `/instagram-photo-downloader` | `instagram-photo-downloader.html` | Photo/carousel keyword page |
| `/how-to-download` | `how-to-download.html` | iPhone / Android / PC guide (HowTo schema) |
| `/faq` | `faq.html` | 12 FAQs (FAQPage schema), legal + privacy |

SEO: unique titles/descriptions, canonicals, OG/Twitter cards, `og-image.png`,
WebApplication + FAQPage + BreadcrumbList + HowTo JSON-LD, `robots.txt`, `sitemap.xml`.

## Extraction engine (`server.js`)
Three strategies run in parallel, best result wins (10-min in-memory cache):
1. **Direct page fetch** (browser UA) — full `og:video` / embedded JSON media URLs. Works when Instagram doesn't block the server IP (clean IP, proxy, self-host).
2. **Crawler-UA fetch** — `og:image` thumbnail fallback.
3. **oEmbed API** — title, author, thumbnail. Works from any server IP.

Response shape:
```json
{ "ok": true, "type": "video|image|carousel", "limited": false,
  "url": "…mp4", "images": ["…jpg"], "thumbnail": "…",
  "title": "…", "author": "…", "authorUrl": "…" }
```
`limited: true` means the reel's video file was blocked — the UI shows the cover/title/author honestly instead of a dead error.

## API
- `GET /api/health`
- `POST /api/extract` — `{ "url": "https://www.instagram.com/reel/…" }`
- `GET /api/download?u=<cdn-url>&t=video|image` — proxied download, SSRF-guarded to `*.fbcdn.net` / `*.cdninstagram.com`
- Rate limit: 30 req/min per IP on `/api/*`

## Run
```bash
npm install
npm start   # PORT env, default 3000
```

## Deploy (Render free tier)
1. Push to GitHub, create Web Service: Node, branch `main`, build `npm install`, start `npm start`.
2. Set env var `SITE_URL=https://<your-domain>` (used for absolute URLs if needed).
3. Replace the placeholder `https://instasave.example.com` with the live domain in:
   `public/index.html`, `public/instagram-reels-downloader.html`,
   `public/instagram-photo-downloader.html`, `public/how-to-download.html`,
   `public/faq.html`, `public/robots.txt`, `public/sitemap.xml`.
   Then redeploy.

## Known limitation — reel video files
Instagram aggressively blocks video-file requests from data-center/server IPs
(HTTP 200 login-shell instead of media). No free server-side method bypasses this —
sites that reliably download reels pay for residential proxies or private APIs.
InstaSave's engine is complete and correct: on a non-blocked IP/proxy it returns
the MP4 automatically; on a blocked IP it degrades honestly (preview + cover).
To unlock full reel downloads in production, put the server behind a residential
proxy or plug a paid Instagram API (e.g. via RapidAPI) into `extractMedia()`.

## Legal
Not affiliated with Instagram/Meta. Only public content; personal-use guidance
in-app and in FAQ. No logins, no stored links, files stream through (not kept).
