import type { Metadata } from 'next';
import DownloaderForm from '@/components/DownloaderForm';
import FocusCta from '@/components/FocusCta';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://instasave-nb5s.onrender.com';

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "InstaSave Reels Downloader",
    "url": "https://instasave-nb5s.onrender.com/instagram-reels-downloader",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Download public Instagram reels as high-quality MP4 files for free. No login or watermark required.",
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
        "name": "Instagram Reels Downloader",
        "item": "https://instasave-nb5s.onrender.com/instagram-reels-downloader"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I download Instagram reels without a watermark?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Copy the reel's link from Instagram, paste it into the box above and hit Download. Because we fetch the original file from Instagram's servers, the MP4 has no added watermark — unlike screen recordings or re-upload apps."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download Instagram reels in high quality?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. InstaSave automatically selects the highest-quality progressive MP4 stream Instagram serves for the reel — typically 1080p with the original soundtrack."
        }
      },
      {
        "@type": "Question",
        "name": "How do I download reels on iPhone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In the Instagram app, tap the share icon (✈) on the reel and choose Copy Link. Open this page in Safari, paste the link, tap Download — the MP4 saves to your Files app or Photos."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download reels from a private account?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No — and neither can any legitimate tool. Instagram never exposes private-account content to third-party services. Respect the account owner's privacy."
        }
      },
      {
        "@type": "Question",
        "name": "Is it legal to download Instagram reels?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Keep downloads for personal, offline viewing, and only save content you own or have permission to keep. Never re-upload someone else's reel as your own — credit the creator."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download just the audio from a reel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Paste the same reel link into our Instagram audio downloader and it converts the reel's soundtrack to an MP3 you can listen to offline or use in edits."
        }
      },
      {
        "@type": "Question",
        "name": "Why did the video download button not appear?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Instagram temporarily rate-limits automated video fetches from data-center servers. We still show the reel's cover photo, title and author, and the video unlocks automatically once the block lifts. Photo downloads are unaffected."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download many reels at once?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "InstaSave processes one link at a time to keep each fetch fast and reliable. Paste links one by one — each one takes only seconds."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download Instagram reels on Android?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Open the reel in the Instagram app, tap Share, then Copy Link. Paste it into the box above in Chrome and tap Download — the MP4 saves to your Downloads folder in full quality."
        }
      },
      {
        "@type": "Question",
        "name": "What video format do reels download in?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MP4 with H.264 video and AAC audio — the same format Instagram uses. It plays on every phone, tablet, computer, and smart TV without conversion."
        }
      },
      {
        "@type": "Question",
        "name": "Can I save just the cover photo of a reel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every reel result also includes a cover-photo download button that saves the reel's thumbnail as a JPG — handy for previews or references."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need an Instagram account to download reels?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. InstaSave works entirely in your browser and never asks for your Instagram login. Only public reels can be fetched — private-account content is never accessible."
        }
      }
    ]
  }
];

export const metadata: Metadata = {
  title: "Instagram Reels Downloader — Save Reels as MP4",
  description: "Download Instagram reels in high quality with our user-friendly tool. Save your favorite reels as MP4 in seconds — no app required. Try it now!",
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: { canonical: `${SITE_URL}/instagram-reels-downloader` },
  openGraph: {
    type: 'website',
    siteName: 'InstaSave',
    title: "Instagram Reels Downloader — Save Reels as MP4",
    description: "Download Instagram reels in high quality with our user-friendly tool. Save your favorite reels as MP4 in seconds — no app required. Try it now!",
    url: `${SITE_URL}/instagram-reels-downloader`,
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Reels Downloader — Save Reels as MP4",
    description: "Download Instagram reels as MP4 free. No login, no app required.",
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
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › Instagram Reels Downloader</nav>
      <span className="kicker">Free · No login · No watermark</span>
      <h1>Instagram <span className="grad-text">Reels</span> Downloader</h1>
            
      <p className="sub">Save any <strong>public</strong> Instagram reel as an MP4 video — free, no login, no watermark, straight to your phone or computer.</p>
          
      <DownloaderForm api="/api/extract" inputType="url" placeholder="Paste reel link… e.g. instagram.com/reel/…" ariaLabel="Instagram reel link" buttonLabel="Download" sampleUrl="https://www.instagram.com/reel/DWzITTYCS4N/" />
      </div></section>
      <section className="section alt"><div className="wrap"><div className="prose">
              <h2>Download Instagram reels without watermark — in seconds</h2>
              <p>Instagram doesn't give you a "download" button for reels posted by other people, and screen recording leaves you with shaky, low-resolution video. <strong>InstaSave's Instagram reels downloader</strong> fetches the original video file straight from Instagram's content servers, so you get the full-quality MP4 with its soundtrack intact — no watermark, no screen-record blur, no app install.</p>
              <p>It works with every public reel: trending audio clips, comedy sketches, tutorials, travel montages and product demos. Paste the link, preview the reel's cover, title and author, then save the HD video to your device.</p>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="prose">
              <h2>Why download Instagram reels for offline viewing?</h2>
              <p>Reels vanish from your feed within hours, and Instagram's bookmark feature only saves them inside the app — useless on a flight or with patchy signal. Downloading a reel as an MP4 means you actually own a copy: rewatch tutorials step by step, keep comedy clips to share with friends, or study what makes a reel go viral.</p>
              <p>Pair this with our <a href="/instagram-audio-downloader">audio downloader</a> when you only want the soundtrack, or grab still frames with the <a href="/instagram-photo-downloader">photo downloader</a>. Every public reel works — no login, no app, no added watermark.</p>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2>How to download a reel in <span className="grad-text">3 steps</span></h2>
            <p>The same quick flow on every device.</p></div><div className="steps"><div className="step"><div className="step-num">1</div><h3>Copy the reel link</h3><p><strong>iPhone/Android:</strong> in the Instagram app, tap the share icon (✈) on the reel and choose <strong>Copy link</strong>. <strong>PC:</strong> open the reel in your browser and copy the URL from the address bar.</p></div><div className="step"><div className="step-num">2</div><h3>Paste it here</h3><p>Drop the link into the box above and hit <strong>Download</strong>. We'll fetch the reel's video, cover photo, title and author in a few seconds.</p></div><div className="step"><div className="step-num">3</div><h3>Save the MP4</h3><p>Tap <strong>Download video (MP4)</strong>. On iPhone it lands in Files/Photos, on Android in Downloads, on PC in your Downloads folder — in full HD quality.</p></div></div></div></section>
      <section className="section alt"><div className="wrap"><div className="section-head"><h2>Why save reels with <span className="grad-text">InstaSave</span></h2>
            </div><div className="cards"><div className="card"><div className="icon-tile"><img src="/img/icons/check.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>No added watermark</h3><p>Original Instagram file — we don't add logos or branding.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/clapperboard.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>High-quality MP4</h3><p>Highest-quality progressive video Instagram serves, with original audio.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/padlock.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>No login required</h3><p>Your Instagram account is never involved.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/photo.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Cover photo included</h3><p>Get the reel's thumbnail as a bonus JPG for previews or references.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/tag.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Free to use</h3><p>No paywall, no sign-up — just paste and download.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/devices.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Works everywhere</h3><p>Safari, Chrome, Firefox and Edge on iPhone, Android and desktop.</p></div></div></div></section>
      <section className="section"><div className="wrap"><div className="prose">
              <h2>Formats &amp; quality</h2>
              <p>Reels download as <strong>MP4</strong> files with H.264 video and AAC audio — the same codec Instagram uses, playable on every phone, tablet, computer and smart TV without conversion. We automatically pick the best-quality progressive stream Instagram provides (typically up to 1080p). The reel's <strong>cover photo</strong> is also available as a JPG. If you only want the soundtrack, paste the same link into our <a href="/instagram-audio-downloader">audio downloader</a> to get an MP3.</p>
              <h2>Honest limitations</h2>
              <p>Two things no honest tool can do: <strong>private-account reels are never accessible</strong> — they require the owner's login, and any site claiming otherwise is lying. And Instagram sometimes <strong>rate-limits server-side video fetches</strong>; when that happens we show you the reel's cover, title and author instead of a fake loading spinner, and the MP4 unlocks automatically the moment Instagram allows it again.</p>
            </div>
          </div></section>
      <section className="section alt" id="faq"><div className="wrap"><div className="section-head"><h2>Reels downloader <span className="grad-text">FAQs</span></h2>
            </div><div className="faq-list">
              <details className="faq-item" open><summary>How do I download Instagram reels without a watermark?</summary><div className="faq-a">Copy the reel's link from Instagram, paste it into the box above and hit Download. Because we fetch the original file from Instagram's servers, the MP4 has no added watermark — unlike screen recordings or re-upload apps.</div></details>
              <details className="faq-item"><summary>Can I download Instagram reels in high quality?</summary><div className="faq-a">Yes. InstaSave automatically selects the highest-quality progressive MP4 stream Instagram serves for the reel — typically 1080p with the original soundtrack.</div></details>
              <details className="faq-item"><summary>How do I download reels on iPhone?</summary><div className="faq-a">In the Instagram app, tap the share icon (✈) on the reel and choose Copy Link. Open this page in Safari, paste the link, tap Download — the MP4 saves to your Files app or Photos.</div></details>
              <details className="faq-item"><summary>Can I download reels from a private account?</summary><div className="faq-a">No — and neither can any legitimate tool. Instagram never exposes private-account content to third-party services. Respect the account owner's privacy.</div></details>
              <details className="faq-item"><summary>Is it legal to download Instagram reels?</summary><div className="faq-a">Keep downloads for personal, offline viewing, and only save content you own or have permission to keep. Never re-upload someone else's reel as your own — credit the creator.</div></details>
              <details className="faq-item"><summary>Can I download just the audio from a reel?</summary><div className="faq-a">Yes. Paste the same reel link into our <a href="/instagram-audio-downloader">Instagram audio downloader</a> and it converts the reel's soundtrack to an MP3 you can listen to offline or use in edits.</div></details>
              <details className="faq-item"><summary>Why did the video download button not appear?</summary><div className="faq-a">Instagram temporarily rate-limits automated video fetches from data-center servers. We still show the reel's cover photo, title and author, and the video unlocks automatically once the block lifts. Photo downloads are unaffected.</div></details>
              <details className="faq-item"><summary>Can I download many reels at once?</summary><div className="faq-a">InstaSave processes one link at a time to keep each fetch fast and reliable. Paste links one by one — each one takes only seconds.</div></details>
              <details className="faq-item"><summary>Can I download Instagram reels on Android?</summary><div className="faq-a">Yes. Open the reel in the Instagram app, tap Share, then Copy Link. Paste it into the box above in Chrome and tap Download — the MP4 saves to your Downloads folder in full quality.</div></details>
              <details className="faq-item"><summary>What video format do reels download in?</summary><div className="faq-a">MP4 with H.264 video and AAC audio — the same format Instagram uses. It plays on every phone, tablet, computer, and smart TV without conversion.</div></details>
              <details className="faq-item"><summary>Can I save just the cover photo of a reel?</summary><div className="faq-a">Yes. Every reel result also includes a cover-photo download button that saves the reel's thumbnail as a JPG — handy for previews or references.</div></details>
              <details className="faq-item"><summary>Do I need an Instagram account to download reels?</summary><div className="faq-a">No. InstaSave works entirely in your browser and never asks for your Instagram login. Only public reels can be fetched — private-account content is never accessible.</div></details>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2>More <span className="grad-text">download tools</span></h2>
            </div><div className="tools-grid"><a className="tool-card" href="/instagram-video-downloader"><div className="icon-tile"><img src="/img/icons/video.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Video Downloader</h3><p>Save Instagram video posts & long videos as MP4.</p><span className="go">Open tool →</span></a><a className="tool-card" href="/instagram-audio-downloader"><div className="icon-tile"><img src="/img/icons/music.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Audio Downloader</h3><p>Convert reel audio to MP3 for offline listening.</p><span className="go">Open tool →</span></a><a className="tool-card" href="/instagram-photo-downloader"><div className="icon-tile"><img src="/img/icons/photo.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Photo Downloader</h3><p>Download Instagram photos & carousels in high resolution.</p><span className="go">Open tool →</span></a></div></div></section>
      <section className="section"><div className="wrap"><div className="cta-band"><h2>Got a reel worth keeping?</h2><p>Paste the link — no login, no watermark, no waiting.</p><FocusCta className="btn btn-ghost" href="#dl-form">Download it free</FocusCta></div></div></section>
    </>
  );
}
