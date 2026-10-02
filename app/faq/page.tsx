import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://instasave-nb5s.onrender.com';

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is InstaSave free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes — completely free, with unlimited downloads. No account, no trial, no paywall, no \"premium unlock\"."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need an Instagram account or login?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. We never ask for your username, password or any credentials. The tool only reads public posts, so your account can't be banned, hacked or linked to your downloads."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download from private accounts or stories?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No — and be suspicious of any site that says it can. Private posts, stories, close-friends content and DMs require the owner's login. No legitimate tool can bypass that, and sites asking for your password are phishing."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a watermark on downloads?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "None. Files are fetched from Instagram's own content servers, so what you get is the clean original MP4 or JPG — unlike screen recordings or repost apps that stamp their logo on it."
        }
      },
      {
        "@type": "Question",
        "name": "What formats do I get?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Reels and video posts download as MP4 ; photos and carousel images as JPG . Both play everywhere with no conversion needed."
        }
      },
      {
        "@type": "Question",
        "name": "Which devices and browsers work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Anything with a modern browser: iPhone (Safari), Android (Chrome), Windows, Mac, Linux, even tablets. Nothing to install — see the step-by-step guide for each device."
        }
      },
      {
        "@type": "Question",
        "name": "Why does a reel sometimes show only a preview, without the video?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Instagram aggressively rate-limits automated requests from servers. During one of these blocks we can't pull the MP4 — so instead of a dead error, we show the reel's cover photo, title and author, and the video button unlocks automatically once Instagram allows it again. Photo downloads are never affected."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download a whole carousel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Carousel posts are detected automatically and every photo gets its own preview thumbnail and download button."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a download limit?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No daily cap. There's only a light per-minute rate limit to stop bots from abusing the service — normal use never hits it."
        }
      },
      {
        "@type": "Question",
        "name": "Is downloading Instagram content legal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It depends on what you do with it. Downloading content you own , or saving for personal offline viewing , is the intended use. Re-uploading someone else's reel or photo as your own — or using it commercially — violates the creator's copyright and Instagram's terms, and can lead to takedowns or account strikes. When in doubt: ask permission and give credit."
        }
      },
      {
        "@type": "Question",
        "name": "How do I report copyright infringement (DMCA)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "InstaSave doesn't host any Instagram content — files pass through directly from Instagram's servers and aren't stored. Still, if you're a rights holder with a concern, contact us with the details (your work, the link in question, your contact info) and valid notices are actioned promptly."
        }
      },
      {
        "@type": "Question",
        "name": "Do you store my links, downloads or personal data?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Pasted links are processed in memory to fetch the media and are not stored or shared. Downloaded files stream through the server and are not kept. We don't ask for names, emails or logins — there's nothing to leak."
        }
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
        "name": "FAQ",
        "item": "https://instasave-nb5s.onrender.com/faq"
      }
    ]
  }
];

export const metadata: Metadata = {
  title: "Instagram Downloader FAQ — Free, Legal & Privacy Answers",
  description: "Is it free? Do you need to log in? Is downloading legal? Get honest answers to the most common Instagram downloader questions.",
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    type: 'website',
    siteName: 'InstaSave',
    title: "Instagram Downloader FAQ — Free, Legal & Privacy Answers",
    description: "Is it free? Do you need to log in? Is downloading legal? Get honest answers to the most common Instagram downloader questions.",
    url: `${SITE_URL}/faq`,
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Downloader FAQ — Free, Legal & Privacy Answers",
    description: "Is it free? Legal? Private? Every downloader question answered.",
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
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › FAQ</nav>
      <h1>Frequently asked <span className="grad-text">questions</span></h1>
            
      <p className="sub">Everything about InstaSave: cost, privacy, legality, devices and troubleshooting.</p>
          
      </div></section>
      <section className="section"><div className="wrap">
      <div className="section-head"><h2>All questions</h2><p>Everything about downloading with InstaSave.</p></div>
      <div className="faq-list"><details className="faq-item" open><summary>Is InstaSave free?</summary><div className="faq-a">Yes — completely free, with unlimited downloads. No account, no trial, no paywall, no "premium unlock".</div></details>
              <details className="faq-item"><summary>Do I need an Instagram account or login?</summary><div className="faq-a">No. We never ask for your username, password or any credentials. The tool only reads public posts, so your account can't be banned, hacked or linked to your downloads.</div></details>
              <details className="faq-item"><summary>Can I download from private accounts or stories?</summary><div className="faq-a">No — and be suspicious of any site that says it can. Private posts, stories, close-friends content and DMs require the owner's login. No legitimate tool can bypass that, and sites asking for your password are phishing.</div></details>
              <details className="faq-item"><summary>Is there a watermark on downloads?</summary><div className="faq-a">None. Files are fetched from Instagram's own content servers, so what you get is the clean original MP4 or JPG — unlike screen recordings or repost apps that stamp their logo on it.</div></details>
              <details className="faq-item"><summary>What formats do I get?</summary><div className="faq-a">Reels and video posts download as <strong>MP4</strong>; photos and carousel images as <strong>JPG</strong>. Both play everywhere with no conversion needed.</div></details>
              <details className="faq-item"><summary>Which devices and browsers work?</summary><div className="faq-a">Anything with a modern browser: iPhone (Safari), Android (Chrome), Windows, Mac, Linux, even tablets. Nothing to install — see the <a href="/how-to-download">step-by-step guide</a> for each device.</div></details>
              <details className="faq-item"><summary>Why does a reel sometimes show only a preview, without the video?</summary><div className="faq-a">Instagram aggressively rate-limits automated requests from servers. During one of these blocks we can't pull the MP4 — so instead of a dead error, we show the reel's cover photo, title and author, and the video button unlocks automatically once Instagram allows it again. Photo downloads are never affected.</div></details>
              <details className="faq-item"><summary>Can I download a whole carousel?</summary><div className="faq-a">Yes. Carousel posts are detected automatically and every photo gets its own preview thumbnail and download button.</div></details>
              <details className="faq-item"><summary>Is there a download limit?</summary><div className="faq-a">No daily cap. There's only a light per-minute rate limit to stop bots from abusing the service — normal use never hits it.</div></details>
              <details className="faq-item" id="legal"><summary>Is downloading Instagram content legal?</summary><div className="faq-a">It depends on what you do with it. Downloading content <strong>you own</strong>, or saving for <strong>personal offline viewing</strong>, is the intended use. Re-uploading someone else's reel or photo as your own — or using it commercially — violates the creator's copyright and Instagram's terms, and can lead to takedowns or account strikes. When in doubt: ask permission and give credit.</div></details>
              <details className="faq-item"><summary>How do I report copyright infringement (DMCA)?</summary><div className="faq-a">InstaSave doesn't host any Instagram content — files pass through directly from Instagram's servers and aren't stored. Still, if you're a rights holder with a concern, contact us with the details (your work, the link in question, your contact info) and valid notices are actioned promptly.</div></details>
              <details className="faq-item" id="privacy"><summary>Do you store my links, downloads or personal data?</summary><div className="faq-a">No. Pasted links are processed in memory to fetch the media and are not stored or shared. Downloaded files stream through the server and are not kept. We don't ask for names, emails or logins — there's nothing to leak.</div></details>
            </div>
      </div></section>
    </>
  );
}
