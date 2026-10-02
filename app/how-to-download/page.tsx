import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://instasave-nb5s.onrender.com';

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to download Instagram reels and photos",
    "description": "Download public Instagram reels and photos on iPhone, Android or PC without an app or login.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Copy the Instagram link",
        "text": "In the Instagram app, tap Share then Copy Link under the reel or post. On desktop, copy the URL from the address bar."
      },
      {
        "@type": "HowToStep",
        "name": "Paste the link into InstaSave",
        "text": "Open instasave-nb5s.onrender.com and paste the link into the download box."
      },
      {
        "@type": "HowToStep",
        "name": "Download the file",
        "text": "Preview the media and tap the download button. The file saves to your device."
      }
    ]
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
        "name": "How to Download",
        "item": "https://instasave-nb5s.onrender.com/how-to-download"
      }
    ]
  }
];

export const metadata: Metadata = {
  title: "How to Download Instagram Reels & Photos — iPhone, Android, PC",
  description: "Step-by-step guide to download Instagram reels & photos on iPhone, Android and PC. Copy the link, paste it in our free tool and save in seconds.",
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: { canonical: `${SITE_URL}/how-to-download` },
  openGraph: {
    type: 'website',
    siteName: 'InstaSave',
    title: "How to Download Instagram Reels & Photos — iPhone, Android, PC",
    description: "Step-by-step guide to download Instagram reels & photos on iPhone, Android and PC. Copy the link, paste it in our free tool and save in seconds.",
    url: `${SITE_URL}/how-to-download`,
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Download Instagram Reels & Photos — iPhone, Android, PC",
    description: "Copy link, paste, save. Device-by-device steps, no app installs.",
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
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › How to Download</nav>
      <h1>How to download Instagram <span className="grad-text">reels &amp; photos</span></h1>
            
      <p className="sub">Three steps on any device. No app install, no login, no watermark.</p>
          
      </div></section>
      
      <section className="section"><div className="wrap"><div className="section-head"><h2>The 3 steps (every device)</h2>
              </div><div className="prose"><ol>
                <li><strong>Copy the link.</strong> In the Instagram app, tap <strong>Share → Copy link</strong> on the reel or post. On a computer, just copy the page URL from the address bar.</li>
                <li><strong>Paste it into InstaSave.</strong> Open <a href="/">instasave-nb5s.onrender.com</a>, drop the link in the box, hit <strong>Download</strong>.</li>
                <li><strong>Save the file.</strong> Preview the media, then tap the download button for the MP4 or JPG.</li>
              </ol></div></div></section>
      <section className="section alt"><div className="wrap"><div className="section-head"><h2> On iPhone (Safari)</h2>
              </div><div className="prose"><ol>
                <li>Copy the reel/post link from the Instagram app.</li>
                <li>Open Safari and go to <a href="/">InstaSave</a>. (Tip: tap the box and your copied link is offered automatically.)</li>
                <li>Paste, hit <strong>Download</strong>, then tap the file's download button.</li>
                <li>Safari shows a download icon in the address bar — tap it, then the file, then <strong>Share → Save Video / Save Image</strong> to move it into Photos. Or find it anytime in the <strong>Files</strong> app under Downloads.</li>
              </ol></div></div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2> On Android (Chrome)</h2>
              </div><div className="prose"><ol>
                <li>Copy the link from Instagram (<strong>Share → Copy link</strong>).</li>
                <li>Open Chrome, visit <a href="/">InstaSave</a>, paste and hit <strong>Download</strong>.</li>
                <li>Tap the download button — Chrome saves it straight to your <strong>Downloads</strong> folder and shows a notification. Open it from there or your Gallery.</li>
              </ol></div></div></section>
      <section className="section alt"><div className="wrap"><div className="section-head"><h2> On PC / Mac</h2>
              </div><div className="prose"><ol>
                <li>Copy the post URL from your browser's address bar while viewing the reel or photo.</li>
                <li>Paste it into <a href="/">InstaSave</a> and hit <strong>Download</strong>.</li>
                <li>Click the download button — the MP4/JPG lands in your browser's download folder. Rename it whatever you like.</li>
              </ol></div></div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2>Troubleshooting</h2>
              </div><div className="prose"><ul>
                <li><strong>"Could not find media":</strong> the post is private, deleted, or the link has a typo. Only public posts work.</li>
                <li><strong>Video button missing on a reel:</strong> Instagram is temporarily blocking server fetches. You'll still get the cover photo — try again in a few minutes and the MP4 usually unlocks.</li>
                <li><strong>Download won't start on iPhone:</strong> make sure you're using Safari (not the in-app Instagram browser). Long-press the download button and choose <strong>Download Linked File</strong>.</li>
                <li><strong>Where did my file go?</strong> iPhone: Files app → Downloads (or Photos after saving). Android: Downloads folder / notification shade. PC: browser's download bar.</li>
              </ul></div></div></section>
      <section className="section alt"><div className="wrap"><div className="section-head"><h2>Quick tips</h2>
              </div><div className="prose"><ul>
                <li>For <strong>carousels</strong>, each photo gets its own download button — grab only the ones you want.</li>
                <li>Downloads are <strong>watermark-free</strong> originals — much sharper than screen recordings.</li>
                <li>Keep downloads for <strong>personal offline use</strong> and credit creators if you ever share their work.</li>
              </ul></div></div></section>
      <section className="section"><div className="wrap"><div className="cta-band"><h2>Got a link? Try it now.</h2><p>Paste it below — takes about five seconds.</p><a className="btn btn-ghost" href="/">Open the downloader</a></div></div></section>
    </>
  );
}
