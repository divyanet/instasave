import type { Metadata } from 'next';
import DownloaderForm from '@/components/DownloaderForm';
import FocusCta from '@/components/FocusCta';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://instasave-nb5s.onrender.com';

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "InstaSave",
    "url": "https://instasave-nb5s.onrender.com/",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free online tool to download public Instagram reels, videos, photos, audio and carousels. No login or app install required.",
    "browserRequirements": "Requires JavaScript"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is InstaSave really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes — 100% free with unlimited downloads, no account and no hidden charges."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need an Instagram account?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. InstaSave only downloads public posts and never asks for your Instagram login, so your account is never at risk."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download reels without a watermark?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Files are fetched from Instagram's own servers in their original form — no added watermark."
        }
      },
      {
        "@type": "Question",
        "name": "What can I download?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Public reels, video posts, photos, carousels, reel audio as MP3, profile pictures as displayed on Instagram, and public Facebook videos."
        }
      },
      {
        "@type": "Question",
        "name": "Does it work on iPhone and Android?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes — any mobile or desktop browser works: Safari, Chrome, Firefox, Edge. No app to install."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download from private accounts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Private content is never accessible to any downloader — any site claiming otherwise is lying."
        }
      },
      {
        "@type": "Question",
        "name": "Is downloading Instagram content legal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Download only content you own or have permission to save, and keep downloads for personal, offline use. Respect the creator's copyright."
        }
      },
      {
        "@type": "Question",
        "name": "Where do downloaded files go?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "On iPhone they save to the Files app or Photos; on Android to your Downloads folder or gallery; on PC to Downloads."
        }
      },
      {
        "@type": "Question",
        "name": "Do you store my links or downloads?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Links are processed in memory and not stored or shared with third parties."
        }
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "InstaSave",
    "url": "https://instasave-nb5s.onrender.com/",
    "publisher": {
      "@type": "Organization",
      "name": "InstaSave",
      "url": "https://instasave-nb5s.onrender.com/"
    }
  }
];

export const metadata: Metadata = {
  title: "Instagram Reels Downloader — Save Reels, Videos & Photos",
  description: "Download Instagram reels in high quality with our free, user-friendly tool. Save your favorite videos, photos & audio in seconds — no app required. Try it now!",
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: 'website',
    siteName: 'InstaSave',
    title: "Instagram Reels Downloader — Save Reels, Videos & Photos",
    description: "Download Instagram reels in high quality with our free, user-friendly tool. Save your favorite videos, photos & audio in seconds — no app required. Try it now!",
    url: `${SITE_URL}/`,
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Reels Downloader — Save Reels, Videos & Photos",
    description: "Download Instagram reels, videos & photos free. No login, no app required.",
    images: ['/og-image.png'],
  },
};

export default function Page() {
  return (
    <>
      {JSON_LD.map((o, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />
      ))}
      {/* HERO */}
        <section className="hero">
          <div className="wrap">
            <h1>Download Instagram <span className="hl">videos</span>,<br />reels &amp; photos <span className="grad-text">in one click.</span></h1>
      
            <DownloaderForm api="/api/extract" inputType="url" placeholder="Paste Instagram link… e.g. instagram.com/reel/…" ariaLabel="Instagram link" buttonLabel="Download" sampleUrl="https://www.instagram.com/reel/DWzITTYCS4N/" />
      
            <div className="trust">
              <div>⚡ <span><b>Fast</b> fetch</span></div>
              <div>🔒 <span><b>Private</b> — links aren't stored</span></div>
              <div>📱 <span><b>All devices</b> — no app needed</span></div>
              <div>🆓 <span><b>Free</b> — no paywall</span></div>
            </div>
          </div>
        </section>
      
        {/* TOOLS */}
        <section className="section" id="tools" hidden>
          <div className="wrap">
            <div className="section-head">
              <span className="kicker">Tools</span>
              <h2>Everything you can download.</h2>
              <p>One tool for every kind of Instagram content — plus public Facebook videos. Pick one and start saving.</p>
            </div>
            <div className="tools-grid">
              <a className="tool-card" href="/instagram-reels-downloader"><div className="icon-tile"><img src="/img/icons/clapperboard.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Reels Downloader</h3><p>Save Instagram reels as MP4 in original quality.</p><span className="go">Open tool →</span></a>
              <a className="tool-card" href="/instagram-video-downloader"><div className="icon-tile"><img src="/img/icons/video.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Video Downloader</h3><p>Download video posts and IGTV-style clips.</p><span className="go">Open tool →</span></a>
              <a className="tool-card" href="/instagram-photo-downloader"><div className="icon-tile"><img src="/img/icons/photo.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Photo Downloader</h3><p>Grab photos &amp; full carousels as JPG.</p><span className="go">Open tool →</span></a>
              <a className="tool-card" href="/instagram-audio-downloader"><div className="icon-tile"><img src="/img/icons/music.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Audio Downloader</h3><p>Convert any reel to MP3 audio.</p><span className="go">Open tool →</span></a>
              <a className="tool-card" href="/instagram-profile-downloader"><div className="icon-tile"><img src="/img/icons/user.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Profile Downloader</h3><p>View &amp; save profile pictures as displayed.</p><span className="go">Open tool →</span></a>
              <a className="tool-card" href="/instagram-story-downloader"><div className="icon-tile"><img src="/img/icons/book.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Story Guide</h3><p>Why no-login story downloads can't work — honestly.</p><span className="go">Read guide →</span></a>
              <a className="tool-card" href="/facebook-video-downloader"><div className="icon-tile"><img src="/img/icons/facebook.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Facebook Videos</h3><p>Save public Facebook videos &amp; reels as MP4.</p><span className="go">Open tool →</span></a>
              <a className="tool-card" href="/how-to-download"><div className="icon-tile"><img src="/img/icons/question.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>How It Works</h3><p>Step-by-step guides for every device.</p><span className="go">Learn →</span></a>
            </div>
          </div>
        </section>
      
        <div className="badge-row"><span className="badge"><span className="stars">★★★★★</span> Free to use · No login · No watermark</span></div>
      
        {/* ABOUT */}
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <span className="kicker">About InstaSave</span>
              <h2>What is InstaSave?</h2>
              <p>InstaSave is a free, fast online tool that helps you download Instagram reels, videos, photos, and audio to your device. Save any reels video to your phone or computer and view it offline anytime.</p>
              <p>It works right in your browser on any phone, tablet, or computer &mdash; no login, no app install. Just copy a public Instagram link, paste it in the box above, and download.</p>
            </div>
          </div>
        </section>
      
        {/* HOW IT WORKS */}
        <section className="section alt">
          <div className="wrap">
            <div className="section-head">
              <span className="kicker">How it works</span>
              <h2>Three steps. Five seconds.</h2>
              <p>No software to install, no account to create. If you can copy a link, you can download.</p>
            </div>
            <div className="steps">
              <div className="step"><div className="step-num">1</div><h3>Copy the link</h3><p>Open Instagram, tap <b>Share → Copy link</b> on any public reel, video or photo post.</p></div>
              <div className="step"><div className="step-num">2</div><h3>Paste it above</h3><p>Drop the link into the box at the top of this page and hit <b>Download</b>.</p></div>
              <div className="step"><div className="step-num">3</div><h3>Save the file</h3><p>Preview the media, then tap download. It saves straight to your <code>Downloads</code> or gallery.</p></div>
            </div>
          </div>
        </section>
      
        {/* FEATURES */}
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <span className="kicker">Why InstaSave</span>
              <h2>Built to be the simplest downloader.</h2>
              <p>Everything you'd expect — and a few things other tools won't tell you.</p>
            </div>
            <div className="cards">
              <div className="card"><div className="icon-tile"><img src="/img/icons/check.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>No added watermark</h3><p>Files come straight from Instagram's own servers in their original form. We don't stamp anything on your downloads.</p></div>
              <div className="card"><div className="icon-tile"><img src="/img/icons/padlock.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>No login required</h3><p>We only touch public posts, so there's nothing to log into. Your Instagram account is never at risk.</p></div>
              <div className="card"><div className="icon-tile"><img src="/img/icons/bolt.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Fast by design</h3><p>Paste a link, preview the media, download — no waiting rooms, no queues.</p></div>
              <div className="card"><div className="icon-tile"><img src="/img/icons/devices.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Every device</h3><p>iPhone, Android, tablet, PC — if it runs a browser, it runs InstaSave. Nothing to install.</p></div>
              <div className="card"><div className="icon-tile"><img src="/img/icons/music.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>MP3 audio extraction</h3><p>Love a reel's sound? Convert any reel to a clean MP3 in one tap — great for ringtones and edits.</p></div>
              <div className="card"><div className="icon-tile"><img src="/img/icons/handshake.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Honest when it fails</h3><p>If Instagram temporarily blocks a fetch, we say so plainly instead of showing a fake error page.</p></div>
            </div>
          </div>
        </section>
      
        {/* FORMATS */}
        <section className="section alt">
          <div className="wrap">
            <div className="section-head">
              <span className="kicker">Formats</span>
              <h2>Original quality, useful formats.</h2>
              <p>Instagram doesn't let you download directly from the app. We give you the file in the format that makes sense.</p>
            </div>
            <div className="formats">
              <div className="format"><b>MP4</b><span>Reels &amp; videos</span></div>
              <div className="format"><b>JPG</b><span>Photos &amp; carousels</span></div>
              <div className="format"><b>MP3</b><span>Reel audio</span></div>
            </div>
          </div>
        </section>
      
        {/* COMPARE */}
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <span className="kicker">Comparison</span>
              <h2>InstaSave vs. typical downloaders.</h2>
              <p>A quick, honest look at how we stack up.</p>
            </div>
            <div className="compare-wrap">
              <table className="compare">
                <thead><tr><th>Feature</th><th>InstaSave</th><th>Typical sites</th></tr></thead>
                <tbody>
                  <tr><th>No login needed</th><td><span className="tick">✓</span></td><td><span className="tick">✓</span></td></tr>
                  <tr><th>No watermark</th><td><span className="tick">✓</span></td><td><span className="cross">✗</span></td></tr>
                  <tr><th>Reel → MP3 audio</th><td><span className="tick">✓</span></td><td><span className="cross">✗</span></td></tr>
                  <tr><th>Facebook videos</th><td><span className="tick">✓</span></td><td><span className="cross">✗</span></td></tr>
                  <tr><th>Honest error messages</th><td><span className="tick">✓</span></td><td><span className="cross">✗</span></td></tr>
                  <tr><th>Private-account downloads</th><td><span className="cross">✗</span></td><td><span className="cross">✗</span> <small>(anyone claiming this is lying)</small></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      
        {/* FAQ */}
        <section className="section alt" id="faq">
          <div className="wrap">
            <div className="section-head">
              <span className="kicker">FAQ</span>
              <h2>Questions, answered.</h2>
              <p>Everything you need to know before you hit download.</p>
            </div>
            <div className="faq-list">
              <details className="faq-item" open><summary>Is InstaSave really free?</summary><div className="faq-a"><p>Yes — 100% free with unlimited downloads, no account and no hidden charges.</p></div></details>
              <details className="faq-item"><summary>Do I need an Instagram account?</summary><div className="faq-a"><p>No. InstaSave only downloads public posts and never asks for your Instagram login, so your account is never at risk.</p></div></details>
              <details className="faq-item"><summary>Can I download reels without a watermark?</summary><div className="faq-a"><p>Yes. Files are fetched from Instagram's own servers in their original form — no added watermark.</p></div></details>
              <details className="faq-item"><summary>What can I download?</summary><div className="faq-a"><p>Public reels, video posts, photos, carousels, reel audio as MP3, profile pictures as displayed on Instagram, and public Facebook videos.</p></div></details>
              <details className="faq-item"><summary>Does it work on iPhone and Android?</summary><div className="faq-a"><p>Yes — any mobile or desktop browser works: Safari, Chrome, Firefox, Edge. No app to install.</p></div></details>
              <details className="faq-item"><summary>Can I download from private accounts?</summary><div className="faq-a"><p>No. Private content is never accessible to any downloader — any site claiming otherwise is lying.</p></div></details>
              <details className="faq-item"><summary>Is downloading Instagram content legal?</summary><div className="faq-a"><p>Download only content you own or have permission to save, and keep downloads for personal, offline use. Respect the creator's copyright.</p></div></details>
              <details className="faq-item"><summary>Where do downloaded files go?</summary><div className="faq-a"><p>On iPhone they save to the Files app or Photos; on Android to your Downloads folder or gallery; on PC to Downloads.</p></div></details>
              <details className="faq-item"><summary>Do you store my links or downloads?</summary><div className="faq-a"><p>No. Links are processed in memory and not stored or shared with third parties.</p></div></details>
            </div>
            <p style={{ textAlign: "center", marginTop: "26px" }}><a href="/faq" style={{ fontWeight: "700" }}>View all FAQs →</a></p>
          </div>
        </section>
      
        {/* CTA */}
        <section className="section">
          <div className="wrap">
            <div className="cta-band">
              <h2>Ready to save your first reel?</h2>
              <p>Free to use. No login. No watermark added. Paste a link and you're done.</p>
              <FocusCta className="btn btn-ghost" href="#tools">Start downloading →</FocusCta>
            </div>
          </div>
        </section>
    </>
  );
}
