import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://instasave-nb5s.onrender.com';

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service – InstaSave",
    "url": "https://instasave-nb5s.onrender.com/terms-of-service",
    "description": "InstaSave terms of service: personal use only, respect creators' copyright, DMCA takedown process.",
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
        "name": "Terms of Service",
        "item": "https://instasave-nb5s.onrender.com/terms-of-service"
      }
    ]
  }
];

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Our terms of service: fair-use rules, respect for creators",
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/terms-of-service` },
  openGraph: {
    type: 'website',
    siteName: 'InstaSave',
    title: "Terms of Service",
    description: "Our terms of service: fair-use rules, respect for creators",
    url: `${SITE_URL}/terms-of-service`,
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service",
    description: "Fair-use rules and respect for creators",
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
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › Terms of Service</nav>
      <h1>Terms of <span className="grad-text">Service</span></h1>
            
      <p className="sub">Last updated: September 27, 2026. By using InstaSave you agree to these terms.</p>
          
      </div></section>
      <section className="section"><div className="wrap"><div className="prose"><h2>1. What InstaSave is</h2>
              <p>InstaSave is a free web tool that helps you download media from <strong>public</strong> Instagram and Facebook posts by fetching the original files from those platforms' own servers. We are not affiliated with Instagram, Facebook or Meta Platforms, Inc.</p>
              <h2>2. Acceptable use</h2>
              <p>You agree to use InstaSave only for <strong>personal, non-commercial use</strong>. Specifically, you agree that you will:</p>
              <ul>
                <li>Only download content you own, or content you have the creator's permission to save.</li>
                <li>Never re-upload someone else's content as your own, and always credit the original creator when sharing with permission.</li>
                <li>Never use the service to harass, impersonate, or infringe anyone's rights.</li>
                <li>Not attempt to abuse, overload, or circumvent the service's technical limits.</li>
              </ul>
              <p><strong>Copyright belongs to the creators.</strong> Downloading a file does not transfer any ownership or license to you.</p>
              <h2>3. What the service cannot do</h2>
              <p>InstaSave only works with public content. We cannot and do not access private accounts, private stories, direct messages, or any content that requires a login. We make no claim otherwise.</p>
              <h2 id="dmca">4. DMCA &amp; copyright complaints</h2>
              <p>We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA). InstaSave does not host Instagram or Facebook content on its servers — it fetches files on demand. If you are a rights holder and believe your copyrighted work is being misused through this service, send a takedown notice via our <a href="/contact">contact page</a> including:</p>
              <ul>
                <li>Your full name and contact information.</li>
                <li>Identification of the copyrighted work you claim is infringed.</li>
                <li>The specific InstaSave page or the source URL involved.</li>
                <li>A statement that you have a good-faith belief the use is unauthorized.</li>
                <li>A statement, under penalty of perjury, that you are authorized to act on behalf of the rights holder.</li>
              </ul>
              <p>Valid notices are reviewed promptly, and we will take appropriate action, which may include blocking the reported content from being processed.</p>
              <h2>5. No warranties</h2>
              <p>The service is provided "as is" without warranties of any kind. We do not guarantee that any particular link will be downloadable at any given time — Instagram and Facebook may rate-limit or block automated requests, which is outside our control.</p>
              <h2>6. Limitation of liability</h2>
              <p>To the maximum extent permitted by law, InstaSave is not liable for any damages arising from your use of the service, including how you use downloaded content. You are solely responsible for ensuring your downloads comply with applicable copyright law.</p>
              <h2>7. Changes</h2>
              <p>We may update these terms from time to time. Continued use of the service after changes means you accept the updated terms.</p>
              <h2>8. Contact</h2>
              <p>Questions about these terms? Reach us through the <a href="/contact">contact page</a>.</p>
            </div></div></section>
    </>
  );
}
