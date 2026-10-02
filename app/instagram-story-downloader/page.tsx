import type { Metadata } from 'next';
import DownloaderForm from '@/components/DownloaderForm';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://instasave-nb5s.onrender.com';

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "InstaSave Story Tool",
    "url": "https://instasave-nb5s.onrender.com/instagram-story-downloader",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Honest Instagram story tool and guide. Explains which story downloads are actually possible and how to save stories legitimately.",
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
        "name": "Instagram Story Downloader",
        "item": "https://instasave-nb5s.onrender.com/instagram-story-downloader"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can I download Instagram stories without logging in?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Instagram only serves stories to logged-in users, so no legitimate no-login tool can fetch them. Sites claiming otherwise use fake spinners, demand shady \"verifications,\" or harvest your login."
        }
      },
      {
        "@type": "Question",
        "name": "Why can't story tools work like reel downloaders?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Reels and posts have public preview pages that don't require login. Stories are session-gated by design — Instagram's servers refuse to hand story media to anonymous requests."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download stories from a private account?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No — and any tool claiming to fetch private stories is lying or phishing. Private content requires the account owner's login."
        }
      },
      {
        "@type": "Question",
        "name": "What is the legitimate way to save someone's story?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ask them to send it to you, or use Instagram's built-in share/save features (public stories can be shared to your story or sent via DM). For your own stories, save them from your archive or highlights."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download my own story highlights?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, easily. Open your profile, tap a highlight, tap the story, then More (⋯) → Save. No third-party tool needed, and the quality is the original."
        }
      },
      {
        "@type": "Question",
        "name": "Is it legal to download someone else's story?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Stories are the creator's copyrighted content. Save them only with permission and for personal use — never repost someone else's story as your own."
        }
      },
      {
        "@type": "Question",
        "name": "Can I view someone's story without them knowing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not through any legitimate tool. Story views are tracked by Instagram itself, and any site claiming anonymous story viewing without a login is misleading you — treat it as a red flag."
        }
      },
      {
        "@type": "Question",
        "name": "Do story downloader apps actually work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most don't. They typically show fake progress bars, then push you to install other apps or hand over your Instagram login. A real story fetch requires an Instagram session, which no honest no-login site has."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download my own archived stories?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes — from inside Instagram. Open your profile, tap the menu, go to Archive, and your past stories are there to save or re-share. No third-party tool needed."
        }
      },
      {
        "@type": "Question",
        "name": "Why do some sites ask for my Instagram login?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Because stories are session-gated, those sites need your login to fetch them — and that's exactly why you should never give it. Handing your credentials to a random site is how accounts get stolen."
        }
      }
    ]
  }
];

export const metadata: Metadata = {
  title: "Instagram Story Downloader — What Really Works",
  description: "Can you download Instagram stories without login? Read our honest guide on what actually works and which methods to avoid.",
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: { canonical: `${SITE_URL}/instagram-story-downloader` },
  openGraph: {
    type: 'website',
    siteName: 'InstaSave',
    title: "Instagram Story Downloader — What Really Works",
    description: "Can you download Instagram stories without login? Read our honest guide on what actually works and which methods to avoid.",
    url: `${SITE_URL}/instagram-story-downloader`,
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Story Downloader — What Really Works",
    description: "The honest truth about Instagram story downloads.",
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
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › Instagram Story Downloader</nav>
      <span className="kicker">The honest story, not a fake spinner</span>
      <h1>Instagram <span className="grad-text">Story</span> Downloader</h1>
            
      <p className="sub">We won't lie to you: <strong>Instagram stories require a login</strong>, so no legitimate no-login tool can fetch them. Here's what actually works.</p>
          
      <DownloaderForm api="/api/story" inputType="url" placeholder="Paste story link… e.g. instagram.com/stories/…" ariaLabel="Instagram story link" buttonLabel="Download" />
      </div></section>
      <section className="section alt"><div className="wrap"><div className="prose">
              <h2>The honest truth about story downloaders</h2>
              <p>Dozens of sites promise "Instagram story downloader — no login." Here's what they don't tell you: <strong>Instagram only serves stories to logged-in sessions.</strong> Unlike reels and posts — which have public preview pages — stories are session-gated by design. Instagram's servers simply refuse to hand story media to anonymous requests.</p>
              <p>So what do those "story downloader" sites actually do? Most show you a fake loading animation and then either fail, demand you "verify" by installing shady apps, or worse — ask for your Instagram credentials. <strong>Never enter your Instagram login on a downloader site.</strong> That's how accounts get stolen.</p>
              <p>InstaSave takes the honest route: this tool will check any link you paste and tell you plainly what it can and can't fetch. For stories, the answer is: <strong>no legitimate no-login tool can fetch them — including us.</strong> We'd rather earn your trust than waste your time.</p>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="prose">
              <h2>How to save stories the right way</h2>
              <p>If a story matters to you, the legitimate routes are simple: ask the person to send it to you, use Instagram's built-in share when the creator allows it, or save your own stories to highlights and archives from inside the app.</p>
              <p>What you should never do is type your Instagram password into a “story downloader” site. No real tool needs it — that's the classic account-theft trap. For content that <em>is</em> publicly fetchable, our <a href="/instagram-reels-downloader">reels downloader</a> and <a href="/instagram-photo-downloader">photo downloader</a> work with no login at all.</p>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2>Legitimate ways to <span className="grad-text">save stories</span></h2>
            <p>What actually works, no hacks required.</p></div><div className="steps"><div className="step"><div className="step-num">1</div><h3>Save your own stories</h3><p>Open your profile → tap a <strong>highlight</strong> → tap the story → <strong>More (⋯) → Save</strong>. Your story saves to your phone in full quality. Your archive (Profile → ☰ → Archive) keeps every past story.</p></div><div className="step"><div className="step-num">2</div><h3>Ask the poster</h3><p>Want someone else's story? <strong>Message them and ask</strong> to send it or share it to you. Creators can forward their own stories in seconds — and most are happy to when asked politely.</p></div><div className="step"><div className="step-num">3</div><h3>Use Instagram's built-in sharing</h3><p>Public stories can be <strong>shared to your own story or sent via DM</strong> directly in the app. For anything you have permission to keep, screen recording while viewing is the honest fallback.</p></div></div></div></section>
      <section className="section alt"><div className="wrap"><div className="prose">
              <h2>Why we built this page anyway</h2>
              <p>Because "instagram story downloader" is one of the most-searched downloader terms on the internet — and almost every result is a trap. We'd rather this honest page rank than another fake tool. If you're looking for downloads that <strong>do</strong> work without login, try our <a href="/instagram-reels-downloader">reels downloader</a>, <a href="/instagram-photo-downloader">photo downloader</a> or <a href="/instagram-video-downloader">video downloader</a> — those fetch real files from Instagram's public pages.</p>
              <h2>Red flags to avoid</h2>
              <p>Walk away from any "story downloader" that: asks for your Instagram username and password, requires you to "complete an offer" or install an app to unlock downloads, shows an endless loading spinner with no result, or claims it can download <strong>private</strong> stories. Those are phishing or ad-fraud schemes — private stories require the account owner's login, full stop.</p>
            </div>
          </div></section>
      <section className="section" id="faq"><div className="wrap"><div className="section-head"><h2>Story tool <span className="grad-text">FAQs</span></h2>
            </div><div className="faq-list">
              <details className="faq-item" open><summary>Can I download Instagram stories without logging in?</summary><div className="faq-a">No. Instagram only serves stories to logged-in users, so no legitimate no-login tool can fetch them. Sites claiming otherwise use fake spinners, demand shady "verifications," or harvest your login.</div></details>
              <details className="faq-item"><summary>Why can't story tools work like reel downloaders?</summary><div className="faq-a">Reels and posts have public preview pages that don't require login. Stories are session-gated by design — Instagram's servers refuse to hand story media to anonymous requests.</div></details>
              <details className="faq-item"><summary>Can I download stories from a private account?</summary><div className="faq-a">No — and any tool claiming to fetch private stories is lying or phishing. Private content requires the account owner's login.</div></details>
              <details className="faq-item"><summary>What is the legitimate way to save someone's story?</summary><div className="faq-a">Ask them to send it to you, or use Instagram's built-in share/save features (public stories can be shared to your story or sent via DM). For your own stories, save them from your archive or highlights.</div></details>
              <details className="faq-item"><summary>Can I download my own story highlights?</summary><div className="faq-a">Yes, easily. Open your profile, tap a highlight, tap the story, then More (⋯) → Save. No third-party tool needed, and the quality is the original.</div></details>
              <details className="faq-item"><summary>Is it legal to download someone else's story?</summary><div className="faq-a">Stories are the creator's copyrighted content. Save them only with permission and for personal use — never repost someone else's story as your own.</div></details>
              <details className="faq-item"><summary>Can I view someone's story without them knowing?</summary><div className="faq-a">Not through any legitimate tool. Story views are tracked by Instagram itself, and any site claiming anonymous story viewing without a login is misleading you — treat it as a red flag.</div></details>
              <details className="faq-item"><summary>Do story downloader apps actually work?</summary><div className="faq-a">Most don't. They typically show fake progress bars, then push you to install other apps or hand over your Instagram login. A real story fetch requires an Instagram session, which no honest no-login site has.</div></details>
              <details className="faq-item"><summary>Can I download my own archived stories?</summary><div className="faq-a">Yes — from inside Instagram. Open your profile, tap the menu, go to Archive, and your past stories are there to save or re-share. No third-party tool needed.</div></details>
              <details className="faq-item"><summary>Why do some sites ask for my Instagram login?</summary><div className="faq-a">Because stories are session-gated, those sites need your login to fetch them — and that's exactly why you should never give it. Handing your credentials to a random site is how accounts get stolen.</div></details>
            </div>
          </div></section>
      <section className="section alt"><div className="wrap"><div className="section-head"><h2>Tools that <span className="grad-text">actually work</span></h2>
            </div><div className="tools-grid"><a className="tool-card" href="/instagram-reels-downloader"><div className="icon-tile"><img src="/img/icons/clapperboard.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Reels Downloader</h3><p>Save public Instagram reels as high-quality MP4.</p><span className="go">Open tool →</span></a><a className="tool-card" href="/instagram-photo-downloader"><div className="icon-tile"><img src="/img/icons/photo.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Photo Downloader</h3><p>Download Instagram photos & carousels in high resolution.</p><span className="go">Open tool →</span></a><a className="tool-card" href="/instagram-video-downloader"><div className="icon-tile"><img src="/img/icons/video.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Video Downloader</h3><p>Download Instagram video posts as MP4.</p><span className="go">Open tool →</span></a></div></div></section>
    </>
  );
}
