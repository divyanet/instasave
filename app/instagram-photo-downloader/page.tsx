import type { Metadata } from 'next';
import DownloaderForm from '@/components/DownloaderForm';
import FocusCta from '@/components/FocusCta';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://instasave-nb5s.onrender.com';

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "InstaSave Photo Downloader",
    "url": "https://instasave-nb5s.onrender.com/instagram-photo-downloader",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Download public Instagram photos and carousels as high-resolution JPG files for free. No login required.",
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
        "name": "Instagram Photo Downloader",
        "item": "https://instasave-nb5s.onrender.com/instagram-photo-downloader"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I download an Instagram photo in high resolution?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Copy the photo post's link (⋯ menu → Copy link), paste it into the box above and hit Download. You get the full-resolution JPG from Instagram's servers — far sharper than a screenshot."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download all photos from an Instagram carousel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Paste the carousel post's link and InstaSave lists every photo in it, each with its own high-resolution download button. Pick one or save them all."
        }
      },
      {
        "@type": "Question",
        "name": "Why do Instagram photos look blurry when I screenshot them?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A screenshot captures your screen's display, not the original image file. InstaSave fetches the actual uploaded file, so downloads are the full quality the photographer posted."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download photos from a private account?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No — and neither can any legitimate tool. Instagram never exposes private-account content to third-party services. Respect the account owner's privacy."
        }
      },
      {
        "@type": "Question",
        "name": "Is it legal to download Instagram photos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Keep downloads for personal use and only save photos you own or have permission to keep. Don't repost someone else's photo as your own — always credit the photographer."
        }
      },
      {
        "@type": "Question",
        "name": "How do I save Instagram photos on iPhone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Copy the photo's link in the Instagram app, paste it into this page in Safari and tap Download. The JPG saves to your Files app — move it to Photos in one tap."
        }
      },
      {
        "@type": "Question",
        "name": "What format do photos download in?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "JPG, in the highest resolution Instagram serves for the post — usually 1080px wide or more for recent uploads."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download Instagram photos on Android?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Copy the post link from the Instagram app, paste it here in Chrome, and tap Download. Each photo saves as a JPG to your Downloads folder."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download someone's profile picture with this tool?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Profile pictures need our dedicated profile picture downloader — enter a username there and you'll get the full-size avatar. This photo tool is for post and carousel images."
        }
      },
      {
        "@type": "Question",
        "name": "Why did I get several download buttons for one link?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "That's a carousel post — Instagram lets creators attach multiple photos to a single post. We list every photo separately so you can save all of them or just the ones you want."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need an Instagram account to download photos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Only the public post link is needed — no login, no app. Photos from private accounts can't be downloaded by any legitimate tool."
        }
      }
    ]
  }
];

export const metadata: Metadata = {
  title: "Instagram Photo Downloader — Save Photos in HD",
  description: "Download Instagram photos & carousels in high quality with our free tool. Save public pictures in seconds — no login, no app required. Try it now!",
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: { canonical: `${SITE_URL}/instagram-photo-downloader` },
  openGraph: {
    type: 'website',
    siteName: 'InstaSave',
    title: "Instagram Photo Downloader — Save Photos in HD",
    description: "Download Instagram photos & carousels in high quality with our free tool. Save public pictures in seconds — no login, no app required. Try it now!",
    url: `${SITE_URL}/instagram-photo-downloader`,
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Photo Downloader — Save Photos in HD",
    description: "Download Instagram photos in high quality free. No login required.",
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
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › Instagram Photo Downloader</nav>
      <span className="kicker">Free · No login · No watermark</span>
      <h1>Instagram <span className="grad-text">Photo</span> Downloader</h1>
            
      <p className="sub">Download any <strong>public</strong> Instagram photo or carousel in high resolution as JPG — free, no login, no watermark.</p>
          
      <DownloaderForm api="/api/extract" inputType="url" placeholder="Paste photo link… e.g. instagram.com/p/…" ariaLabel="Instagram photo link" buttonLabel="Download" />
      </div></section>
      <section className="section alt"><div className="wrap"><div className="prose">
              <h2>Save Instagram photos in high resolution</h2>
              <p>Screenshots are the worst way to save an Instagram photo: they capture your screen, not the image, so you lose sharpness, get interface clutter and end up with a low-quality file. <strong>InstaSave's Instagram photo downloader</strong> grabs the actual image file from Instagram's servers — the same full-resolution upload the photographer posted.</p>
              <p>It works with single photo posts and <strong>carousels</strong>: paste one link and every photo in the carousel gets its own download button. Perfect for saving inspiration boards, recipes, travel shots and reference images.</p>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="prose">
              <h2>What can you do with downloaded Instagram photos?</h2>
              <p>Once you have the full-resolution JPG, the photo is yours to keep: build mood boards, save recipes and workout plans, print travel shots, or file away design references. Unlike screenshots, files from an <strong>Instagram photo downloader</strong> are clean and sharp — no interface clutter, no quality loss.</p>
              <p>Need the moving version too? Our <a href="/instagram-video-downloader">video downloader</a> and <a href="/instagram-reels-downloader">reels downloader</a> handle video posts and reels the same honest way.</p>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2>How to download an Instagram photo — <span className="grad-text">3 steps</span></h2>
            <p>Device-specific tips included.</p></div><div className="steps"><div className="step"><div className="step-num">1</div><h3>Copy the photo link</h3><p><strong>iPhone/Android:</strong> tap the <strong>⋯</strong> menu on the photo post and choose <strong>Copy link</strong>. <strong>PC:</strong> open the post and copy the URL from the address bar.</p></div><div className="step"><div className="step-num">2</div><h3>Paste it here</h3><p>Drop the link into the box above and press <strong>Download</strong>. We'll fetch the high-resolution image (or every carousel photo) in seconds.</p></div><div className="step"><div className="step-num">3</div><h3>Save the JPG</h3><p>Tap <strong>Download photo (JPG)</strong>. On iPhone it saves to Files (move to Photos in one tap), on Android to Downloads/gallery, on PC to Downloads.</p></div></div></div></section>
      <section className="section alt"><div className="wrap"><div className="section-head"><h2>Features that make it <span className="grad-text">effortless</span></h2>
            </div><div className="cards"><div className="card"><div className="icon-tile"><img src="/img/icons/photo.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>High-resolution JPG</h3><p>The highest resolution Instagram serves — no screenshot blur.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/photo.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Whole carousels</h3><p>Every photo in a multi-image post gets its own download button.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/check.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>No watermark</h3><p>Original file, untouched — zero added branding.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/padlock.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>No login needed</h3><p>Public posts only — your account is never involved.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/tag.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Free to use</h3><p>No paywall, no sign-up — just paste and download.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/devices.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Works everywhere</h3><p>Safari, Chrome, Firefox and Edge on phone and desktop.</p></div></div></div></section>
      <section className="section"><div className="wrap"><div className="prose">
              <h2>Formats &amp; quality</h2>
              <p>Photos download as <strong>JPG</strong> files in the highest resolution Instagram stores for the post — typically 1080px wide or higher for modern uploads. Carousels deliver one JPG per image, so you can pick the exact shots you want. Video posts also expose their <strong>cover photo</strong> as a downloadable JPG.</p>
              <h2>Honest limitations</h2>
              <p><strong>Private-account photos are never accessible</strong> — Instagram doesn't expose them to any third-party tool, no matter what other sites claim. Photos from public posts always work, because Instagram serves them without the aggressive rate-limiting that sometimes affects video fetches.</p>
            </div>
          </div></section>
      <section className="section alt" id="faq"><div className="wrap"><div className="section-head"><h2>Photo downloader <span className="grad-text">FAQs</span></h2>
            </div><div className="faq-list">
              <details className="faq-item" open><summary>How do I download an Instagram photo in high resolution?</summary><div className="faq-a">Copy the photo post's link (⋯ menu → Copy link), paste it into the box above and hit Download. You get the full-resolution JPG from Instagram's servers — far sharper than a screenshot.</div></details>
              <details className="faq-item"><summary>Can I download all photos from an Instagram carousel?</summary><div className="faq-a">Yes. Paste the carousel post's link and InstaSave lists every photo in it, each with its own high-resolution download button. Pick one or save them all.</div></details>
              <details className="faq-item"><summary>Why do Instagram photos look blurry when I screenshot them?</summary><div className="faq-a">A screenshot captures your screen's display, not the original image file. InstaSave fetches the actual uploaded file, so downloads are the full quality the photographer posted.</div></details>
              <details className="faq-item"><summary>Can I download photos from a private account?</summary><div className="faq-a">No — and neither can any legitimate tool. Instagram never exposes private-account content to third-party services. Respect the account owner's privacy.</div></details>
              <details className="faq-item"><summary>Is it legal to download Instagram photos?</summary><div className="faq-a">Keep downloads for personal use and only save photos you own or have permission to keep. Don't repost someone else's photo as your own — always credit the photographer.</div></details>
              <details className="faq-item"><summary>How do I save Instagram photos on iPhone?</summary><div className="faq-a">Copy the photo's link in the Instagram app, paste it into this page in Safari and tap Download. The JPG saves to your Files app — move it to Photos in one tap.</div></details>
              <details className="faq-item"><summary>What format do photos download in?</summary><div className="faq-a">JPG, in the highest resolution Instagram serves for the post — usually 1080px wide or more for recent uploads.</div></details>
              <details className="faq-item"><summary>Can I download Instagram photos on Android?</summary><div className="faq-a">Yes. Copy the post link from the Instagram app, paste it here in Chrome, and tap Download. Each photo saves as a JPG to your Downloads folder.</div></details>
              <details className="faq-item"><summary>Can I download someone's profile picture with this tool?</summary><div className="faq-a">Profile pictures need our dedicated <a href="/instagram-profile-downloader">profile picture downloader</a> — enter a username there and you'll get the full-size avatar. This photo tool is for post and carousel images.</div></details>
              <details className="faq-item"><summary>Why did I get several download buttons for one link?</summary><div className="faq-a">That's a carousel post — Instagram lets creators attach multiple photos to a single post. We list every photo separately so you can save all of them or just the ones you want.</div></details>
              <details className="faq-item"><summary>Do I need an Instagram account to download photos?</summary><div className="faq-a">No. Only the public post link is needed — no login, no app. Photos from private accounts can't be downloaded by any legitimate tool.</div></details>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2>More <span className="grad-text">download tools</span></h2>
            </div><div className="tools-grid"><a className="tool-card" href="/instagram-reels-downloader"><div className="icon-tile"><img src="/img/icons/clapperboard.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Reels Downloader</h3><p>Save public Instagram reels as HD MP4.</p><span className="go">Open tool →</span></a><a className="tool-card" href="/instagram-video-downloader"><div className="icon-tile"><img src="/img/icons/video.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Video Downloader</h3><p>Download Instagram video posts as MP4.</p><span className="go">Open tool →</span></a><a className="tool-card" href="/instagram-profile-downloader"><div className="icon-tile"><img src="/img/icons/user.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Profile Picture</h3><p>Download public profile pictures in HD.</p><span className="go">Open tool →</span></a></div></div></section>
      <section className="section"><div className="wrap"><div className="cta-band"><h2>Found a photo worth keeping?</h2><p>Paste the link — high resolution, no login, no watermark.</p><FocusCta className="btn btn-ghost" href="#dl-form">Download it free</FocusCta></div></div></section>
    </>
  );
}
