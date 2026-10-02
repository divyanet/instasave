import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://instasave-nb5s.onrender.com';

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy – InstaSave",
    "url": "https://instasave-nb5s.onrender.com/privacy-policy",
    "description": "InstaSave collects no personal data, stores no links and sets no tracking cookies.",
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
        "name": "Privacy Policy",
        "item": "https://instasave-nb5s.onrender.com/privacy-policy"
      }
    ]
  }
];

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Our privacy policy: what little data we handle, how contact messages are stored, and your rights.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
  openGraph: {
    type: 'website',
    siteName: 'InstaSave',
    title: "Privacy Policy",
    description: "Our privacy policy: what little data we handle, how contact messages are stored, and your rights.",
    url: `${SITE_URL}/privacy-policy`,
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy",
    description: "What little data we handle, and your rights.",
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
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › Privacy Policy</nav>
      <h1>Privacy <span className="grad-text">Policy</span></h1>
            
      <p className="sub">Last updated: September 27, 2026. The short version: <strong>we collect nothing.</strong> No accounts, no link history, no tracking cookies.</p>
          
      </div></section>
      <section className="section"><div className="wrap"><div className="prose"><h2>1. What we collect</h2>
              <p>Nothing personal. InstaSave has no user accounts, no sign-up forms (apart from the optional contact form), and no analytics that identify you. The links you paste are <strong>processed in memory on our server and not stored or shared</strong> with anyone. Once your request completes, the link is gone.</p>
              <h2>2. Cookies &amp; local storage</h2>
              <p>We set <strong>no tracking cookies</strong>. The only thing saved in your own browser is your theme preference (dark/light), stored in <code>localStorage</code> under the key <code>instasave_theme</code> — it never leaves your device. A short download history (last 10 links) is also kept in your browser's <code>localStorage</code> for your convenience; we never see it.</p>
              <h2>3. Contact form</h2>
              <p>If you use our <a href="/contact">contact form</a>, we receive the name, email address and message you submit. This is used only to read and respond to your message. We do not sell it, share it, or add it to any mailing list.</p>
              <h2>4. Third parties</h2>
              <p>To fetch media, our server makes requests to Instagram's and Facebook's public servers on your behalf — that's how the tool works. We load fonts from Google Fonts; your browser's connection to Google is governed by Google's own privacy policy. We run no advertising networks and no third-party trackers.</p>
              <h2>5. Data retention</h2>
              <p>Because we store no usage data, there is nothing to retain and nothing to delete. Contact-form messages are kept only as long as needed to handle your request.</p>
              <h2>6. Children's privacy</h2>
              <p>InstaSave is a general-audience tool. We knowingly collect no data from anyone, including children under 13.</p>
              <h2>7. Changes to this policy</h2>
              <p>If we ever change how we handle data, we'll update this page and the "last updated" date above. Continued use of the site after changes means you accept the updated policy.</p>
              <h2>8. Contact</h2>
              <p>Questions about privacy? Reach us through the <a href="/contact">contact page</a>.</p>
            </div></div></section>
    </>
  );
}
