import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://instasave-nb5s.onrender.com';

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "DMCA & Copyright Policy – InstaSave",
    "url": "https://instasave-nb5s.onrender.com/dmca",
    "description": "InstaSave DMCA and copyright policy: how to report infringement and file a takedown notice.",
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
        "name": "DMCA & Copyright Policy",
        "item": "https://instasave-nb5s.onrender.com/dmca"
      }
    ]
  }
];

export const metadata: Metadata = {
  title: "DMCA & Copyright Policy",
  description: "Our DMCA and copyright policy: how to report infringement and what a valid takedown notice must include.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/dmca` },
  openGraph: {
    type: 'website',
    siteName: 'InstaSave',
    title: "DMCA & Copyright Policy",
    description: "Our DMCA and copyright policy: how to report infringement and what a valid takedown notice must include.",
    url: `${SITE_URL}/dmca`,
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DMCA & Copyright Policy",
    description: "How to file a DMCA takedown notice with us.",
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
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › DMCA</nav>
      <h1>DMCA &amp; <span className="grad-text">Copyright</span></h1>
            
      <p className="sub">Last updated: September 27, 2026. We respect creators’ rights and comply with the Digital Millennium Copyright Act (17 U.S.C. § 512).</p>
          
      </div></section>
      <section className="section"><div className="wrap"><div className="prose"><h2>1. Our position on copyright</h2>
              <p>InstaSave is a tool that fetches publicly available media from Instagram and Facebook at a user’s request. <strong>We do not host, upload, or store media files on our servers</strong> — files are passed through directly from the social platform’s own servers to the user’s device. All media remains the property of its original owners and creators.</p>
              <p>Our tool is intended for downloading content you have the right to save — your own posts, royalty-free material, or content the owner has allowed to be shared. Please do not use InstaSave for copyrighted or restricted content without permission.</p>
              <h2>2. DMCA compliance</h2>
              <p>InstaSave complies with 17 U.S.C. § 512 and the Digital Millennium Copyright Act (DMCA). It is our policy to respond to valid infringement notices and take appropriate action, which may include blocking specific links or disabling access to reported material through our service.</p>
              <h2>3. Filing a takedown notice</h2>
              <p>If you believe material processed through our service infringes your copyright, send us a notice containing all of the following:</p>
              <ul>
                <li>Identification of the copyrighted work you claim has been infringed (or a representative list, if multiple works).</li>
                <li>Identification of the infringing material — the exact Instagram/Facebook URLs involved — and information reasonably sufficient for us to locate it.</li>
                <li>Your full name, address, telephone number, and email address.</li>
                <li>A statement that you have a good-faith belief the use of the material is not authorized by the copyright owner, its agent, or the law.</li>
                <li>A statement that the information in the notice is accurate and, under penalty of perjury, that you are authorized to act on behalf of the copyright owner.</li>
                <li>Your physical or electronic signature.</li>
              </ul>
              <h2>4. Where to send your notice</h2>
              <p>Submit your takedown notice through our <a href="/contact">contact form</a> with the subject line <strong>“DMCA Takedown”</strong>. Notices missing the elements above cannot be processed.</p>
              <h2>5. Counter-notices</h2>
              <p>If you believe material was blocked as a result of a mistake or misidentification, you may send a counter-notice through the same <a href="/contact">contact form</a> (subject: “DMCA Counter-Notice”) including your contact details, identification of the material, and a statement under penalty of perjury that you have a good-faith belief the material was removed by mistake.</p>
              <h2>6. Repeat infringers</h2>
              <p>We may block URLs, limit access, or take other appropriate steps against users who repeatedly request infringing material through our service.</p>
              <h2>7. Please note</h2>
              <p>We can only act on material that involves our service. If the content lives on Instagram or Facebook itself, please also report it directly to that platform — they control the original post and can remove it at the source.</p>
      </div></div></section>
    </>
  );
}
