import type { Metadata } from 'next';
import DownloaderForm from '@/components/DownloaderForm';
import FocusCta from '@/components/FocusCta';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://instasave-nb5s.onrender.com';

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "InstaSave Video Downloader",
    "url": "https://instasave-nb5s.onrender.com/instagram-video-downloader",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Download public Instagram video posts and long-form videos as high-quality MP4 files for free. No login required.",
    "browserRequirements": "Requires JavaScript"
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://instasave-nb5s.onrender.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Instagram Video Downloader",
        "item": "https://instasave-nb5s.onrender.com/instagram-video-downloader"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I download an Instagram video to my phone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Copy the video post's link (Share, then Copy Link), paste it into the box above and tap Download. The MP4 saves to your phone in full quality — no app or login needed."
        }
      },
      {
        "@type": "Question",
        "name": "What's the difference between this and the reels downloader?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Both produce MP4 downloads, but this page is optimized for standard Instagram video posts (/p/ links) while our reels downloader is tuned for /reel/ links. The same extraction engine powers both, so either page works for any video link."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download Instagram videos in high quality?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We automatically select the best-quality progressive MP4 stream Instagram provides for the post — typically up to 1080p with original audio."
        }
      },
      {
        "@type": "Question",
        "name": "Do downloaded videos include sound?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Videos download with their original audio track intact — AAC audio inside the MP4 container."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download videos from private Instagram accounts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Instagram never exposes private-account content to third-party tools. Any site claiming it can download private videos is not legitimate — protect your account and stay away."
        }
      },
      {
        "@type": "Question",
        "name": "Is it legal to download Instagram videos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Keep downloads for personal, offline viewing, and only save content you own or have permission to keep. Don't repost someone else's video as your own — always credit the creator."
        }
      },
      {
        "@type": "Question",
        "name": "Why is only the cover photo available sometimes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Instagram occasionally rate-limits automated video fetches from servers. We still show the cover photo, title and author, and the video unlocks automatically once the block lifts."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a limit on how many videos I can download?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. InstaSave is free and unlimited — download as many public videos as you like, one link at a time."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download Instagram videos on iPhone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Copy the video link from the Instagram app (Share, then Copy Link), open this page in Safari, paste the link, and tap Download. The MP4 saves to your Files app or Photos."
        }
      },
      {
        "@type": "Question",
        "name": "What video format do Instagram downloads use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MP4 with H.264 video and AAC audio — Instagram's native format. The file plays everywhere without conversion."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download long-form Instagram videos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. This tool handles standard video posts and longer uploads, not just short clips — paste any public video post link and the engine detects it automatically."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need an Instagram account to use this?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No account or login is needed. Paste any public video link and download. Videos from private accounts can't be fetched by any legitimate tool."
        }
      }
    ]
  }
];

export const metadata: Metadata = {
  title: "Instagram Video Downloader — Save Videos as MP4",
  description: "Download Instagram videos in high quality with our free online tool. Save any public video as MP4 in seconds — no login, no app required. Try it now!",
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: { canonical: `${SITE_URL}/instagram-video-downloader` },
  openGraph: {
    type: 'website',
    siteName: 'InstaSave',
    title: "Instagram Video Downloader — Save Videos as MP4",
    description: "Download Instagram videos in high quality with our free online tool. Save any public video as MP4 in seconds — no login, no app required. Try it now!",
    url: `${SITE_URL}/instagram-video-downloader`,
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Video Downloader — Save Videos as MP4",
    description: "Download Instagram videos as MP4 free. No login, no app required.",
    images: ['/og-image.png'],
  },
};

export default function Page() {
  return (
    <>
      {JSON_LD.map((o, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />
      ))}
      <section className="page-hero"><div className="wrap">
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › Instagram Video Downloader</nav>
      <span className="kicker">Free · No login · No watermark</span>
      <h1>Instagram <span className="grad-text">Video</span> Downloader</h1>
            
      <p className="sub">Download any <strong>public</strong> Instagram video as high-quality MP4 — free, no login, no watermark, no app install.</p>
          
      <DownloaderForm api="/api/extract" inputType="url" placeholder="Paste Instagram video link… e.g. instagram.com/p/…" ariaLabel="Instagram video link" buttonLabel="Download" />
      </div></section>
      <section className="section alt"><div className="wrap"><div className="prose">
              <h2>Save Instagram videos in original quality</h2>
              <p>Found a tutorial, product demo or long-form video on Instagram you want to keep? Instagram's app only lets you <em>bookmark</em> posts — it won't give you the actual file. <strong>InstaSave's Instagram video downloader</strong> extracts the original MP4 from the post page so you can watch offline, archive it, or reference it in your own projects (with the creator's permission).</p>
              <p>This tool handles standard <strong>video posts</strong> (<code>/p/</code> links), long-form videos and reels — whatever video link you paste, the engine detects it automatically. You get the video with its original soundtrack, in the best resolution Instagram serves.</p>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="prose">
              <h2>Why save Instagram videos instead of just bookmarking?</h2>
              <p>Bookmarks live inside Instagram — if the creator deletes the post, they're gone for good. Saving the actual MP4 with an <strong>Instagram video downloader</strong> gives you a permanent offline copy: rewatch without burning mobile data, reference it in presentations, or archive content that matters to you.</p>
              <p>This tool handles standard video posts and longer uploads alike. For short vertical clips, the <a href="/instagram-reels-downloader">reels downloader</a> is the more direct route; for stills, use the <a href="/instagram-photo-downloader">photo downloader</a>.</p>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2>How to download an Instagram video — <span className="grad-text">3 steps</span></h2>
            <p>Device-specific tips included.</p></div><div className="steps"><div className="step"><div className="step-num">1</div><h3>Copy the video link</h3><p><strong>iPhone/Android:</strong> tap the <strong>⋯</strong> menu (or share icon) on the video post and choose <strong>Copy link</strong>. <strong>PC:</strong> open the post and copy the URL from the address bar.</p></div><div className="step"><div className="step-num">2</div><h3>Paste it here</h3><p>Drop the link into the box above and press <strong>Download</strong>. We'll fetch the video file, cover photo, title and author within seconds.</p></div><div className="step"><div className="step-num">3</div><h3>Save the MP4</h3><p>Tap <strong>Download video (MP4)</strong>. The file plays on any phone, tablet, computer or smart TV — no conversion needed.</p></div></div></div></section>
      <section className="section alt"><div className="wrap"><div className="section-head"><h2>Features that make it <span className="grad-text">effortless</span></h2>
            </div><div className="cards"><div className="card"><div className="icon-tile"><img src="/img/icons/clapperboard.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Original quality</h3><p>Best progressive MP4 stream Instagram serves for that post.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/music.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Audio included</h3><p>Original soundtrack preserved (AAC) — no silent videos.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/check.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Zero watermark</h3><p>Clean original file, no added branding or logos.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/video.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Any video link</h3><p>Video posts, reels and long-form videos all work in one box.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/check.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>No account needed</h3><p>Never enter Instagram credentials — your account stays safe.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/padlock.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Private by design</h3><p>Links processed in memory and not stored.</p></div></div></div></section>
      <section className="section"><div className="wrap"><div className="prose">
              <h2>Formats &amp; quality</h2>
              <p>Videos download as <strong>MP4</strong> (H.264 video + AAC audio), the universal format that plays on every device without conversion. We pick the <strong>best-quality progressive stream</strong> available — Instagram serves adaptive DASH streams to apps, but we grab the highest progressive MP4 so the file works everywhere. Each video post also includes its <strong>cover photo</strong> as a JPG. Need only the soundtrack? Send the link to our <a href="/instagram-audio-downloader">audio downloader</a> for an MP3.</p>
              <h2>Honest limitations</h2>
              <p><strong>Private accounts are off-limits</strong> — Instagram never exposes them to third-party tools, full stop. Occasionally Instagram <strong>rate-limits server-side video fetches</strong>; instead of a fake error page, we show the video's cover, title and author, and the MP4 unlocks automatically when the block lifts. That's the honest truth — any site that never hits limits is probably showing you stale or fake files.</p>
            </div>
          </div></section>
      <section className="section alt" id="faq"><div className="wrap"><div className="section-head"><h2>Video downloader <span className="grad-text">FAQs</span></h2>
            </div><div className="faq-list">
              <details className="faq-item" open><summary>How do I download an Instagram video to my phone?</summary><div className="faq-a">Copy the video post's link (Share, then Copy Link), paste it into the box above and tap Download. The MP4 saves to your phone in full quality — no app or login needed.</div></details>
              <details className="faq-item"><summary>What's the difference between this and the reels downloader?</summary><div className="faq-a">Both produce MP4 downloads, but this page is optimized for standard Instagram video posts (/p/ links) while our <a href="/instagram-reels-downloader">reels downloader</a> is tuned for /reel/ links. The same extraction engine powers both, so either page works for any video link.</div></details>
              <details className="faq-item"><summary>Can I download Instagram videos in high quality?</summary><div className="faq-a">Yes. We automatically select the best-quality progressive MP4 stream Instagram provides for the post — typically up to 1080p with original audio.</div></details>
              <details className="faq-item"><summary>Do downloaded videos include sound?</summary><div className="faq-a">Yes. Videos download with their original audio track intact — AAC audio inside the MP4 container.</div></details>
              <details className="faq-item"><summary>Can I download videos from private Instagram accounts?</summary><div className="faq-a">No. Instagram never exposes private-account content to third-party tools. Any site claiming it can download private videos is not legitimate — protect your account and stay away.</div></details>
              <details className="faq-item"><summary>Is it legal to download Instagram videos?</summary><div className="faq-a">Keep downloads for personal, offline viewing, and only save content you own or have permission to keep. Don't repost someone else's video as your own — always credit the creator.</div></details>
              <details className="faq-item"><summary>Why is only the cover photo available sometimes?</summary><div className="faq-a">Instagram occasionally rate-limits automated video fetches from servers. We still show the cover photo, title and author, and the video unlocks automatically once the block lifts.</div></details>
              <details className="faq-item"><summary>Is there a limit on how many videos I can download?</summary><div className="faq-a">No. InstaSave is free and unlimited — download as many public videos as you like, one link at a time.</div></details>
              <details className="faq-item"><summary>Can I download Instagram videos on iPhone?</summary><div className="faq-a">Yes. Copy the video link from the Instagram app (Share, then Copy Link), open this page in Safari, paste the link, and tap Download. The MP4 saves to your Files app or Photos.</div></details>
              <details className="faq-item"><summary>What video format do Instagram downloads use?</summary><div className="faq-a">MP4 with H.264 video and AAC audio — Instagram's native format. The file plays everywhere without conversion.</div></details>
              <details className="faq-item"><summary>Can I download long-form Instagram videos?</summary><div className="faq-a">Yes. This tool handles standard video posts and longer uploads, not just short clips — paste any public video post link and the engine detects it automatically.</div></details>
              <details className="faq-item"><summary>Do I need an Instagram account to use this?</summary><div className="faq-a">No account or login is needed. Paste any public video link and download. Videos from private accounts can't be fetched by any legitimate tool.</div></details>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2>More <span className="grad-text">download tools</span></h2>
            </div><div className="tools-grid"><a className="tool-card" href="/instagram-reels-downloader"><div className="icon-tile"><img src="/img/icons/clapperboard.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Reels Downloader</h3><p>Save public Instagram reels as high-quality MP4.</p><span className="go">Open tool →</span></a><a className="tool-card" href="/instagram-photo-downloader"><div className="icon-tile"><img src="/img/icons/photo.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Photo Downloader</h3><p>Download Instagram photos & carousels in high resolution.</p><span className="go">Open tool →</span></a><a className="tool-card" href="/instagram-audio-downloader"><div className="icon-tile"><img src="/img/icons/music.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Audio Downloader</h3><p>Extract reel audio as MP3 for offline listening.</p><span className="go">Open tool →</span></a></div></div></section>
      <section className="section"><div className="wrap"><div className="cta-band"><h2>Found a video worth saving?</h2><p>Paste the link — no login, no watermark, no waiting.</p><FocusCta className="btn btn-ghost" href="#dl-form">Download it free</FocusCta></div></div></section>
    </>
  );
}
