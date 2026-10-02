import type { Metadata } from 'next';
import DownloaderForm from '@/components/DownloaderForm';
import FocusCta from '@/components/FocusCta';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://instasave-nb5s.onrender.com';

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "InstaSave Facebook Video Downloader",
    "url": "https://instasave-nb5s.onrender.com/facebook-video-downloader",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Download public Facebook videos, reels and watch clips as MP4 files for free. No login required.",
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
        "name": "Facebook Video Downloader",
        "item": "https://instasave-nb5s.onrender.com/facebook-video-downloader"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I download a Facebook video?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Copy the video's link from Facebook (Share → Copy Link), paste it into the box above and tap Download. The MP4 saves to your device in seconds — no login needed."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download Facebook Reels?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Paste a Facebook Reel link the same way — our extractor handles reels, Watch videos and regular video posts from public sources."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download videos from private Facebook groups?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No — and neither can any legitimate tool. Private groups, friends-only posts and DMs require a login. Only public videos can be downloaded."
        }
      },
      {
        "@type": "Question",
        "name": "What quality are Facebook video downloads?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We grab the best-quality MP4 Facebook serves for the video — typically HD — with the original audio intact."
        }
      },
      {
        "@type": "Question",
        "name": "Is it legal to download Facebook videos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Keep downloads for personal, offline viewing and only save videos you own or have permission to keep. Don't re-upload someone else's content as your own."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download Facebook Live streams?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Finished live streams that remain published as public videos can usually be downloaded. Streams in progress can't — wait until the stream ends and the replay is published."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need a Facebook account to use this?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. InstaSave only fetches public videos and never asks for your Facebook login — your account is never at risk."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download Facebook videos on iPhone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Copy the video link from the Facebook app (Share, then Copy Link), paste it here in Safari, and tap Download. The MP4 saves to your Files app or Photos."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download videos from Facebook pages I don't follow?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If the video is public, yes — following doesn't matter, only the post's privacy setting. Videos in private groups or friends-only posts can't be fetched."
        }
      },
      {
        "@type": "Question",
        "name": "What video format do Facebook downloads use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MP4 — the same format Facebook serves. We pick the best quality available, with the original audio included."
        }
      },
      {
        "@type": "Question",
        "name": "Do downloaded Facebook videos include sound?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The MP4 includes the video's original audio track, exactly as Facebook serves it."
        }
      }
    ]
  }
];

export const metadata: Metadata = {
  title: "Facebook Video Downloader — Save FB Videos as MP4",
  description: "Download Facebook videos & reels in high quality with our free online tool. Save public FB videos as MP4 in seconds — no login required. Try it now!",
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: { canonical: `${SITE_URL}/facebook-video-downloader` },
  openGraph: {
    type: 'website',
    siteName: 'InstaSave',
    title: "Facebook Video Downloader — Save FB Videos as MP4",
    description: "Download Facebook videos & reels in high quality with our free online tool. Save public FB videos as MP4 in seconds — no login required. Try it now!",
    url: `${SITE_URL}/facebook-video-downloader`,
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Facebook Video Downloader — Save FB Videos as MP4",
    description: "Download public Facebook videos as MP4 free. No login required.",
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
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › Facebook Video Downloader</nav>
      <span className="kicker">Free · No login · No watermark</span>
      <h1>Facebook <span className="grad-text">Video</span> Downloader</h1>
            
      <p className="sub">Download any <strong>public</strong> Facebook video, reel or watch clip as MP4 — free, no login, no watermark.</p>
          
      <DownloaderForm api="/api/fb-extract" inputType="url" placeholder="Paste Facebook video link…" ariaLabel="Facebook video link" buttonLabel="Download" />
      </div></section>
      <section className="section alt"><div className="wrap"><div className="prose">
              <h2>Save Facebook videos in original quality</h2>
              <p>Found a great video on Facebook — a recipe, a news clip, a funny reel — and want to keep it? Facebook's app lets you save posts to a bookmark list, but it won't hand you the actual video file. <strong>InstaSave's Facebook video downloader</strong> extracts the original MP4 from the public video page so you can watch it offline, archive it, or reference it later.</p>
              <p>It handles Facebook <strong>watch videos</strong>, <strong>Facebook Reels</strong> and regular video posts from public pages and profiles. Paste the link, preview the video's title and thumbnail, then download the MP4 with its original audio.</p>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="prose">
              <h2>Why download Facebook videos for offline viewing?</h2>
              <p>Facebook's “Save” button only bookmarks videos inside the app — you can't watch them on a plane, and they vanish if the post is deleted. A <strong>Facebook video downloader</strong> hands you the actual MP4: archive tutorials, keep funny clips, or rewatch without streaming.</p>
              <p>It handles public watch videos, Facebook Reels, and posts from public pages. For Instagram content, our <a href="/instagram-reels-downloader">reels downloader</a> and <a href="/instagram-video-downloader">video downloader</a> do the same job.</p>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2>How to download a Facebook video — <span className="grad-text">3 steps</span></h2>
            <p>Device-specific tips included.</p></div><div className="steps"><div className="step"><div className="step-num">1</div><h3>Copy the video link</h3><p><strong>iPhone/Android:</strong> in the Facebook app, tap <strong>Share → Copy link</strong> on the video. <strong>PC:</strong> open the video and copy the URL from the address bar.</p></div><div className="step"><div className="step-num">2</div><h3>Paste it here</h3><p>Drop the link into the box above and press <strong>Download</strong>. We'll fetch the video file, thumbnail and title in seconds.</p></div><div className="step"><div className="step-num">3</div><h3>Save the MP4</h3><p>Tap <strong>Download video (MP4)</strong>. The file plays on any phone, tablet, computer or smart TV — no conversion needed.</p></div></div></div></section>
      <section className="section alt"><div className="wrap"><div className="section-head"><h2>Features that make it <span className="grad-text">effortless</span></h2>
            </div><div className="cards"><div className="card"><div className="icon-tile"><img src="/img/icons/video.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>HD MP4 downloads</h3><p>Best-quality video Facebook serves, with original audio.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/clapperboard.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Reels & Watch</h3><p>Facebook Reels, Watch videos and regular posts all work.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/check.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>No watermark</h3><p>Original file, untouched — zero added branding.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/padlock.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>No login needed</h3><p>Public videos only — your Facebook account is never involved.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/tag.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Free & unlimited</h3><p>Save as many public videos as you like.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/devices.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Works everywhere</h3><p>Safari, Chrome, Firefox and Edge on phone and desktop.</p></div></div></div></section>
      <section className="section"><div className="wrap"><div className="prose">
              <h2>Formats &amp; quality</h2>
              <p>Videos download as <strong>MP4</strong> with the original audio track — the universal format that plays on every device without conversion. We pick the <strong>best-quality stream</strong> Facebook provides for the video (typically HD for Watch and Reels). Each result also includes the video's <strong>thumbnail</strong> and title.</p>
              <h2>Honest limitations</h2>
              <p><strong>Private content is off-limits:</strong> videos in private groups, friends-only posts, DMs and in-progress live streams require a Facebook login, so no third-party tool can fetch them. Only <strong>public</strong> videos — public pages, public profiles and public reels — can be downloaded. If a video's privacy is set to anything less than public, it stays private.</p>
            </div>
          </div></section>
      <section className="section alt" id="faq"><div className="wrap"><div className="section-head"><h2>Facebook downloader <span className="grad-text">FAQs</span></h2>
            </div><div className="faq-list">
              <details className="faq-item" open><summary>How do I download a Facebook video?</summary><div className="faq-a">Copy the video's link from Facebook (Share → Copy Link), paste it into the box above and tap Download. The MP4 saves to your device in seconds — no login needed.</div></details>
              <details className="faq-item"><summary>Can I download Facebook Reels?</summary><div className="faq-a">Yes. Paste a Facebook Reel link the same way — our extractor handles reels, Watch videos and regular video posts from public sources.</div></details>
              <details className="faq-item"><summary>Can I download videos from private Facebook groups?</summary><div className="faq-a">No — and neither can any legitimate tool. Private groups, friends-only posts and DMs require a login. Only public videos can be downloaded.</div></details>
              <details className="faq-item"><summary>What quality are Facebook video downloads?</summary><div className="faq-a">We grab the best-quality MP4 Facebook serves for the video — typically HD — with the original audio intact.</div></details>
              <details className="faq-item"><summary>Is it legal to download Facebook videos?</summary><div className="faq-a">Keep downloads for personal, offline viewing and only save videos you own or have permission to keep. Don't re-upload someone else's content as your own.</div></details>
              <details className="faq-item"><summary>Can I download Facebook Live streams?</summary><div className="faq-a">Finished live streams that remain published as public videos can usually be downloaded. Streams in progress can't — wait until the stream ends and the replay is published.</div></details>
              <details className="faq-item"><summary>Do I need a Facebook account to use this?</summary><div className="faq-a">No. InstaSave only fetches public videos and never asks for your Facebook login — your account is never at risk.</div></details>
              <details className="faq-item"><summary>Can I download Facebook videos on iPhone?</summary><div className="faq-a">Yes. Copy the video link from the Facebook app (Share, then Copy Link), paste it here in Safari, and tap Download. The MP4 saves to your Files app or Photos.</div></details>
              <details className="faq-item"><summary>Can I download videos from Facebook pages I don't follow?</summary><div className="faq-a">If the video is public, yes — following doesn't matter, only the post's privacy setting. Videos in private groups or friends-only posts can't be fetched.</div></details>
              <details className="faq-item"><summary>What video format do Facebook downloads use?</summary><div className="faq-a">MP4 — the same format Facebook serves. We pick the best quality available, with the original audio included.</div></details>
              <details className="faq-item"><summary>Do downloaded Facebook videos include sound?</summary><div className="faq-a">Yes. The MP4 includes the video's original audio track, exactly as Facebook serves it.</div></details>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2>More <span className="grad-text">download tools</span></h2>
            </div><div className="tools-grid"><a className="tool-card" href="/instagram-reels-downloader"><div className="icon-tile"><img src="/img/icons/clapperboard.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Reels Downloader</h3><p>Save public Instagram reels as HD MP4.</p><span className="go">Open tool →</span></a><a className="tool-card" href="/instagram-video-downloader"><div className="icon-tile"><img src="/img/icons/video.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Video Downloader</h3><p>Download Instagram video posts as MP4.</p><span className="go">Open tool →</span></a><a className="tool-card" href="/instagram-audio-downloader"><div className="icon-tile"><img src="/img/icons/music.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Audio Downloader</h3><p>Extract reel audio as MP3 for offline listening.</p><span className="go">Open tool →</span></a></div></div></section>
      <section className="section"><div className="wrap"><div className="cta-band"><h2>Found an FB video worth keeping?</h2><p>Paste the link — no login, no watermark, no waiting.</p><FocusCta className="btn btn-ghost" href="#dl-form">Download it free</FocusCta></div></div></section>
    </>
  );
}
