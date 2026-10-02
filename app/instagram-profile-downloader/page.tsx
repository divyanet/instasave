import type { Metadata } from 'next';
import DownloaderForm from '@/components/DownloaderForm';
import FocusCta from '@/components/FocusCta';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://instasave-nb5s.onrender.com';

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "InstaSave Profile Picture Downloader",
    "url": "https://instasave-nb5s.onrender.com/instagram-profile-downloader",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Download public Instagram profile pictures for free. Just enter a username — no login required.",
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
        "name": "Instagram Profile Picture Downloader",
        "item": "https://instasave-nb5s.onrender.com/instagram-profile-downloader"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I download an Instagram profile picture?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Enter the username or paste the profile link into the box above and hit Download. We fetch the same profile photo file Instagram serves — exactly as displayed on Instagram."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download the profile picture of a private account?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The profile picture itself, yes — Instagram keeps avatars public even on private accounts. The account's posts, stories and followers stay protected and inaccessible."
        }
      },
      {
        "@type": "Question",
        "name": "What size are Instagram profile pictures?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Instagram displays profile pictures as a small circle (around 150×150 pixels). We give you the same profile photo file Instagram serves — but larger \"HD\" upscales aren't reliably available, so we don't promise them."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need the full profile link or just the username?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Either works. Type the username (e.g. instagram) or paste the full profile URL (instagram.com/username)."
        }
      },
      {
        "@type": "Question",
        "name": "Is it legal to download someone's profile picture?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Profile pictures are public by design. Keep downloads for personal use, and never use someone else's photo to impersonate them — that's against Instagram's rules and often the law."
        }
      },
      {
        "@type": "Question",
        "name": "Will the person know I downloaded their profile picture?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Downloading a public profile picture leaves no trace — Instagram doesn't notify the account owner, and InstaSave never logs what you download."
        }
      },
      {
        "@type": "Question",
        "name": "Can I zoom into a profile picture without downloading it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Downloading gives you the same profile photo file Instagram displays, so you can view it freely outside the app's tiny circular crop."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download a profile picture on my phone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Enter the username on this page in your mobile browser and the full-size profile photo appears with a download button — it saves straight to your phone."
        }
      },
      {
        "@type": "Question",
        "name": "What if the username doesn't exist?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We'll tell you the profile wasn't found. Double-check the spelling — usernames are exact, and the profile may have been renamed or deleted."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this without an Instagram account?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. No login is needed at any step — just the username. Profile pictures are public by design, so this works even if you don't have Instagram."
        }
      },
      {
        "@type": "Question",
        "name": "Does this work for business and creator accounts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every Instagram profile type — personal, business, creator, verified — has a public profile picture, so any username works."
        }
      }
    ]
  }
];

export const metadata: Metadata = {
  title: "Instagram Profile Picture Downloader — Save DP in HD",
  description: "Download any public Instagram profile picture in high quality with our free tool. Just enter a username — no login required. Try it now!",
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: { canonical: `${SITE_URL}/instagram-profile-downloader` },
  openGraph: {
    type: 'website',
    siteName: 'InstaSave',
    title: "Instagram Profile Picture Downloader — Save DP in HD",
    description: "Download any public Instagram profile picture in high quality with our free tool. Just enter a username — no login required. Try it now!",
    url: `${SITE_URL}/instagram-profile-downloader`,
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Profile Picture Downloader — Save DP in HD",
    description: "Download public Instagram profile pictures in HD. No login.",
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
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › Instagram Profile Picture Downloader</nav>
      <span className="kicker">Free · No login · No app</span>
      <h1>Instagram <span className="grad-text">Profile Picture</span> Downloader</h1>
            
      <p className="sub">Download any <strong>public</strong> Instagram profile picture — just enter a username. No login, no app.</p>
          
      <DownloaderForm api="/api/profile-pic" inputType="text" placeholder="Username or profile link… e.g. instagram.com/username" ariaLabel="Instagram username or profile link" buttonLabel="Download" />
      </div></section>
      <section className="section alt"><div className="wrap"><div className="prose">
              <h2>See profile pictures up close</h2>
              <p>Instagram shows profile pictures as a tiny cropped circle — tap it and nothing happens. <strong>InstaSave's profile picture downloader</strong> fetches the profile photo file as displayed on Instagram: enter any username or paste a profile link and get the same picture the profile shows.</p>
              <p>Handy for checking a logo in detail, saving a reference, or viewing a picture that's too small to see in the app. Profile pictures are public by design — even private accounts have public avatars — so this works for any Instagram profile.</p>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="prose">
              <h2>Why view Instagram profile pictures in full size?</h2>
              <p>Profile photos are tiny by design, but sometimes you need a closer look — checking a brand logo, recognizing an old friend, or saving a reference image. A <strong>profile picture downloader</strong> shows you the full image Instagram stores, with no screenshots or guesswork.</p>
              <p>It works for every profile type — personal, business, creator, verified — because avatars are public by design. For full posts from public accounts, try our <a href="/instagram-photo-downloader">photo downloader</a> or <a href="/instagram-video-downloader">video downloader</a>.</p>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2>How to download a profile picture — <span className="grad-text">3 steps</span></h2>
            <p>Device-specific tips included.</p></div><div className="steps"><div className="step"><div className="step-num">1</div><h3>Enter the username</h3><p>Type the <strong>username</strong> (e.g. <code>instagram</code>) or paste the full profile link (<code>instagram.com/username</code>). <strong>iPhone/Android:</strong> copy it from the profile's share menu. <strong>PC:</strong> copy it from the address bar.</p></div><div className="step"><div className="step-num">2</div><h3>Hit Download</h3><p>Press the button above. We fetch the profile's photo from Instagram's servers in seconds.</p></div><div className="step"><div className="step-num">3</div><h3>Save the image</h3><p>Preview the profile photo, then download it — the same file Instagram displays, free of the app's tiny circular crop.</p></div></div></div></section>
      <section className="section alt"><div className="wrap"><div className="section-head"><h2>Features that make it <span className="grad-text">effortless</span></h2>
            </div><div className="cards"><div className="card"><div className="icon-tile"><img src="/img/icons/check.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>As displayed on Instagram</h3><p>The profile photo exactly as Instagram shows it — no added compression.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/link.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Username or link</h3><p>Type a username or paste a profile URL — both work.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/user.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Works for any profile</h3><p>Profile pictures are public by design, even on private accounts.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/check.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Private lookup</h3><p>Instagram doesn't notify the account owner.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/padlock.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>No login needed</h3><p>Your account is never involved.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/tag.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Free to use</h3><p>No paywall, no sign-up.</p></div></div></div></section>
      <section className="section"><div className="wrap"><div className="prose">
              <h2>Formats &amp; quality</h2>
              <p>Profile pictures download as <strong>JPG</strong> — the same profile photo file Instagram displays, fetched untouched from Instagram's servers. Note: larger "HD" upscales of profile pictures aren't reliably available, so unlike some sites, we don't promise them.</p>
              <h2>Honest limitations &amp; fair use</h2>
              <p>This tool downloads the <strong>profile picture only</strong> — posts, stories and followers of private accounts remain protected and inaccessible. And a reminder: never use someone else's photo to impersonate them. Impersonation violates Instagram's policies and is illegal in many places. Keep downloads for personal, legitimate use.</p>
            </div>
          </div></section>
      <section className="section alt" id="faq"><div className="wrap"><div className="section-head"><h2>Profile picture <span className="grad-text">FAQs</span></h2>
            </div><div className="faq-list">
              <details className="faq-item" open><summary>How do I download an Instagram profile picture?</summary><div className="faq-a">Enter the username or paste the profile link into the box above and hit Download. We fetch the same profile photo file Instagram serves — exactly as displayed on Instagram.</div></details>
              <details className="faq-item"><summary>Can I download the profile picture of a private account?</summary><div className="faq-a">The profile picture itself, yes — Instagram keeps avatars public even on private accounts. The account's posts, stories and followers stay protected and inaccessible.</div></details>
              <details className="faq-item"><summary>What size are Instagram profile pictures?</summary><div className="faq-a">Instagram displays profile pictures as a small circle (around 150×150 pixels). We give you the same profile photo file Instagram serves — but larger "HD" upscales aren't reliably available, so we don't promise them.</div></details>
              <details className="faq-item"><summary>Do I need the full profile link or just the username?</summary><div className="faq-a">Either works. Type the username (e.g. <code>instagram</code>) or paste the full profile URL (<code>instagram.com/username</code>).</div></details>
              <details className="faq-item"><summary>Is it legal to download someone's profile picture?</summary><div className="faq-a">Profile pictures are public by design. Keep downloads for personal use, and never use someone else's photo to impersonate them — that's against Instagram's rules and often the law.</div></details>
              <details className="faq-item"><summary>Will the person know I downloaded their profile picture?</summary><div className="faq-a">No. Downloading a public profile picture leaves no trace — Instagram doesn't notify the account owner, and InstaSave never logs what you download.</div></details>
              <details className="faq-item"><summary>Can I zoom into a profile picture without downloading it?</summary><div className="faq-a">Downloading gives you the same profile photo file Instagram displays, so you can view it freely outside the app's tiny circular crop.</div></details>
              <details className="faq-item"><summary>Can I download a profile picture on my phone?</summary><div className="faq-a">Yes. Enter the username on this page in your mobile browser and the full-size profile photo appears with a download button — it saves straight to your phone.</div></details>
              <details className="faq-item"><summary>What if the username doesn't exist?</summary><div className="faq-a">We'll tell you the profile wasn't found. Double-check the spelling — usernames are exact, and the profile may have been renamed or deleted.</div></details>
              <details className="faq-item"><summary>Can I use this without an Instagram account?</summary><div className="faq-a">Yes. No login is needed at any step — just the username. Profile pictures are public by design, so this works even if you don't have Instagram.</div></details>
              <details className="faq-item"><summary>Does this work for business and creator accounts?</summary><div className="faq-a">Yes. Every Instagram profile type — personal, business, creator, verified — has a public profile picture, so any username works.</div></details>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2>More <span className="grad-text">download tools</span></h2>
            </div><div className="tools-grid"><a className="tool-card" href="/instagram-photo-downloader"><div className="icon-tile"><img src="/img/icons/photo.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Photo Downloader</h3><p>Download Instagram photos & carousels in high resolution.</p><span className="go">Open tool →</span></a><a className="tool-card" href="/instagram-reels-downloader"><div className="icon-tile"><img src="/img/icons/clapperboard.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Reels Downloader</h3><p>Save public Instagram reels as high-quality MP4.</p><span className="go">Open tool →</span></a><a className="tool-card" href="/instagram-video-downloader"><div className="icon-tile"><img src="/img/icons/video.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Video Downloader</h3><p>Download Instagram video posts as MP4.</p><span className="go">Open tool →</span></a></div></div></section>
      <section className="section"><div className="wrap"><div className="cta-band"><h2>Curious about that avatar?</h2><p>Type the username — see the profile photo in seconds.</p><FocusCta className="btn btn-ghost" href="#dl-form">View it free</FocusCta></div></div></section>
    </>
  );
}
