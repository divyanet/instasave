# InstaSave — Next.js

Free Instagram reels / videos / photos / audio downloader, rebuilt on **Next.js 16 (App Router)**.
Converted from the original Express + vanilla-JS version (`~/workspace/your_files/insta-downloader/`) — same
design (v4 "Clarity"), same copy, same SEO pages, same extraction engine.

## What's inside

- **14 pages** (`app/`): home + 7 tool pages (reels, video, photo, audio, story guide, profile, Facebook video) +
  how-to, FAQ, privacy, terms, DMCA, contact. Per-page titles, descriptions, canonicals, OG/Twitter tags and
  JSON-LD via the Next.js Metadata API. Shared header/footer in `app/layout.tsx`.
- **Client widgets** (`components/`): `DownloaderForm` (paste link → preview → download, incl. MP3 audio flow,
  sample-link chip, clipboard paste helper), `ContactForm`, `ThemeToggle` (persisted dark mode), `FocusCta`.
- **API routes** (`app/api/`): `extract`, `audio` (ffmpeg → MP3), `profile-pic`, `fb-extract` (yt-dlp primary),
  `story` (honest stub), `contact`, `download` (CDN-only proxy), `health`.
- **Engine** (`lib/extraction.ts`): Instagram 3-strategy extraction (direct HTML → crawler UA → oEmbed),
  DASH manifest parsing, in-memory cache + per-IP rate limiting (30 req/min on `/api/*`).

## Local dev

```bash
npm install
npm run dev      # http://localhost:3000
```

## Production build

```bash
npm run build
npm start
```

## Deploying on Render (replaces the old Express service)

The live service `instasave-nb5s` currently builds the old Express app. To switch it to this Next.js version:

1. Push this folder's contents to the `divyanet/instasave` repo (replace old files).
2. In the Render dashboard for the service, change:
   - **Build command:**
     `curl -sSL https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp-bin && chmod +x yt-dlp-bin && npm install && npm run build`
   - **Start command:** `npm start`
   - Node version stays 22 (engines: `>=20`).
3. Env vars (optional): `NEXT_PUBLIC_SITE_URL` (defaults to `https://instasave-nb5s.onrender.com`;
   also honours the old `SITE_URL`). Used for canonicals / OG URLs / sitemap base.
4. Manual deploy → verify homepage renders, submit the sample reel, check `/api/health`.

Notes:
- `ffmpeg-static` ships its binary via npm (audio conversion needs it — same as before).
- `yt-dlp-bin` is downloaded by the build command and resolved from `process.cwd()` at runtime
  (falls back to `yt-dlp` on PATH, then `python3 -m yt_dlp`).
- Pages are statically generated at build time; `/api/*` routes are dynamic (Node.js runtime).
- `public/sitemap.xml` and `public/robots.txt` are served as-is (update the domain inside them if it changes).
