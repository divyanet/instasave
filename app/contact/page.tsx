import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://instasave-nb5s.onrender.com';

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Contact Us – InstaSave",
    "url": "https://instasave-nb5s.onrender.com/contact",
    "description": "Contact the InstaSave team: report a bug, request a feature, or send a DMCA notice.",
    "isPartOf": {
      "@type": "WebSite",
      "name": "InstaSave",
      "url": "https://instasave-nb5s.onrender.com/"
    }
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
        "name": "Contact",
        "item": "https://instasave-nb5s.onrender.com/contact"
      }
    ]
  }
];

export const metadata: Metadata = {
  title: "Contact Us — Report a Bug or Request a Feature",
  description: "Contact our team: report a bug, request a feature, or send a DMCA notice. We read every message and reply as soon as we can.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    type: 'website',
    siteName: 'InstaSave',
    title: "Contact Us — Report a Bug or Request a Feature",
    description: "Contact our team: report a bug, request a feature, or send a DMCA notice. We read every message and reply as soon as we can.",
    url: `${SITE_URL}/contact`,
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us — Report a Bug or Request a Feature",
    description: "Get in touch: report a bug or request a feature.",
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
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › Contact</nav>
      <h1>Contact <span className="grad-text">Us</span></h1>
            
      <p className="sub">Found a bug? Want a feature? Need to send a copyright notice? We read every message.</p>
          
      </div></section>
      <section className="section"><div className="wrap">
      <ContactForm />
      
      <div className="notice-box" style={{ maxWidth: "640px", margin: "18px auto 0" }}><strong>Please note</strong>Messages are currently logged on our server for review — we typically respond within 48 hours.</div>
      </div></section>
      <section className="section alt"><div className="wrap"><div className="prose"><h2>Before you write</h2>
              <p>A link that won't download is usually one of two things: the post is <strong>private</strong> (no tool can fetch it — see our <a href="/instagram-story-downloader">honest story guide</a>), or Instagram is <strong>temporarily rate-limiting</strong> video fetches (the video unlocks automatically once the block lifts). Check the  first — your answer is probably already there.</p>
              <h2>Copyright notices</h2>
              <p>If you're a rights holder, please include everything listed in our <a href="/terms-of-service#dmca">DMCA policy</a> so we can act quickly.</p>
            </div></div></section>
    </>
  );
}
