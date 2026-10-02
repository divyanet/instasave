import type { Metadata } from 'next';
import DownloaderForm from '@/components/DownloaderForm';
import FocusCta from '@/components/FocusCta';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://instasave-nb5s.onrender.com';

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "InstaSave Audio Downloader",
    "url": "https://instasave-nb5s.onrender.com/instagram-audio-downloader",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Extract audio from public Instagram reels and videos as MP3 files for free. No login required.",
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
        "name": "Instagram Audio Downloader",
        "item": "https://instasave-nb5s.onrender.com/instagram-audio-downloader"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I download audio from an Instagram reel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Copy the reel's link from Instagram, paste it into the box above and hit Download. Our server extracts the reel's soundtrack and converts it to an MP3 in seconds."
        }
      },
      {
        "@type": "Question",
        "name": "What quality are the MP3 files?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We convert the reel's original audio track to MP3 at high bitrate, so you hear the same quality Instagram streams — clean, with no re-recording through speakers."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use downloaded Instagram audio in my own reels?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The safe way to use trending audio in your own reels is Instagram's built-in \"Use audio\" feature — it keeps the original artist credited automatically. Only use downloaded audio where you have the rights to it."
        }
      },
      {
        "@type": "Question",
        "name": "Is it legal to download Instagram audio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Keep downloads for personal, offline listening and respect music copyright. Commercial use of copyrighted music requires a license from the rights holder."
        }
      },
      {
        "@type": "Question",
        "name": "Can I extract audio from a private reel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Private-account content is never accessible to any third-party tool. Only public reels and video posts can be converted."
        }
      },
      {
        "@type": "Question",
        "name": "How long does the audio conversion take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Usually just a few seconds. The reel's audio is extracted on our server and converted to MP3 immediately after you paste the link."
        }
      },
      {
        "@type": "Question",
        "name": "Does the MP3 include the video?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No — this tool delivers audio only. If you want the full video, paste the same link into our reels downloader or video downloader."
        }
      },
      {
        "@type": "Question",
        "name": "Can I convert Instagram music posts to MP3 too?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Any public reel or video post link works — the tool extracts whatever audio the post contains."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download Instagram audio on iPhone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Copy the reel link from the Instagram app, paste it here in Safari, and tap Download. The MP3 saves to your Files app, ready for offline listening."
        }
      },
      {
        "@type": "Question",
        "name": "Why do some reels show ‘no audio available’?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Some reels genuinely have no separate audio stream for Instagram to serve — for example, clips with certain licensed music in some regions. When that happens we tell you plainly instead of handing you a silent file."
        }
      },
      {
        "@type": "Question",
        "name": "Can I extract audio from regular Instagram video posts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The audio downloader works with any public reel or video post link — paste it the same way and you'll get the MP3."
        }
      },
      {
        "@type": "Question",
        "name": "Is the MP3 the same quality as the reel's sound?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We convert the reel's original audio track directly on our server, so there's no re-recording loss or background noise — it's the cleanest copy available from the source."
        }
      }
    ]
  }
];

export const metadata: Metadata = {
  title: "Instagram Audio Downloader — Reels to MP3",
  description: "Download Instagram reel audio as MP3 with our free online tool. Extract the soundtrack from any public reel in seconds. Try it now!",
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: { canonical: `${SITE_URL}/instagram-audio-downloader` },
  openGraph: {
    type: 'website',
    siteName: 'InstaSave',
    title: "Instagram Audio Downloader — Reels to MP3",
    description: "Download Instagram reel audio as MP3 with our free online tool. Extract the soundtrack from any public reel in seconds. Try it now!",
    url: `${SITE_URL}/instagram-audio-downloader`,
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Audio Downloader — Reels to MP3",
    description: "Extract Instagram reel audio as MP3 free. No login required.",
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
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › Instagram Audio Downloader</nav>
      <span className="kicker">Free · No login · MP3 in seconds</span>
      <h1>Instagram <span className="grad-text">Audio</span> Downloader</h1>
            
      <p className="sub">Extract the soundtrack from any <strong>public</strong> Instagram reel or video as an MP3 — free, no login, ready for offline listening.</p>
          
      <DownloaderForm api="/api/audio" inputType="url" placeholder="Paste reel/video link… e.g. instagram.com/reel/…" ariaLabel="Instagram reel or video link" buttonLabel="Download" sampleUrl="https://www.instagram.com/reel/DWzITTYCS4N/" />
      </div></section>
      <section className="section alt"><div className="wrap"><div className="prose">
              <h2>Turn any reel's sound into an MP3</h2>
              <p>Heard a song, voiceover or sound effect in a reel that you want to keep? Instagram gives you no way to save audio separately — and screen-recording the video just to get the sound is clumsy. <strong>InstaSave's Instagram audio downloader</strong> takes any public reel or video link, extracts the original audio track on our server, and hands you a clean <strong>MP3</strong> — ready for offline listening, ringtones, or reference in your own edits.</p>
              <p>No re-recording, no background noise, no quality loss from playing it through your speakers. Just the original soundtrack, converted.</p>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="prose">
              <h2>Why extract audio from Instagram reels?</h2>
              <p>A reel's sound is often the best part — a song you can't identify, a motivational voiceover, a comedy dialogue you want to replay. Instagram gives you no way to save audio on its own, so an <strong>Instagram audio downloader</strong> fills the gap: paste the reel link and get a clean MP3 for offline listening or editing reference.</p>
              <p>Want the full video instead? Use the <a href="/instagram-reels-downloader">reels downloader</a>. Only after the pictures? That's the <a href="/instagram-photo-downloader">photo downloader</a>.</p>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2>How to download Instagram audio — <span className="grad-text">3 steps</span></h2>
            <p>Device-specific tips included.</p></div><div className="steps"><div className="step"><div className="step-num">1</div><h3>Copy the reel link</h3><p><strong>iPhone/Android:</strong> in the Instagram app, tap the share icon (✈) on the reel and choose <strong>Copy link</strong>. <strong>PC:</strong> open the reel and copy the URL from the address bar.</p></div><div className="step"><div className="step-num">2</div><h3>Paste it here</h3><p>Drop the link into the box above and hit <strong>Download</strong>. Our server fetches the reel and extracts its audio track.</p></div><div className="step"><div className="step-num">3</div><h3>Save the MP3</h3><p>Download the converted MP3. It plays in every music app — Apple Music, Spotify local files, VLC, you name it.</p></div></div></div></section>
      <section className="section alt"><div className="wrap"><div className="section-head"><h2>Features that make it <span className="grad-text">effortless</span></h2>
            </div><div className="cards"><div className="card"><div className="icon-tile"><img src="/img/icons/music.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Original audio</h3><p>Extracted from the source file — not re-recorded through speakers.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/music.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>High-bitrate MP3</h3><p>Clean conversion that preserves the reel's sound quality.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/video.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Any reel or video</h3><p>Works with reels, video posts and long-form videos.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/padlock.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>No login needed</h3><p>Public posts only — your account is never involved.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/tag.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Free & unlimited</h3><p>Convert as many reels as you like, no caps or paywall.</p></div><div className="card"><div className="icon-tile"><img src="/img/icons/check.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Plays anywhere</h3><p>MP3 works in every music player on phone and desktop.</p></div></div></div></section>
      <section className="section"><div className="wrap"><div className="prose">
              <h2>Formats &amp; quality</h2>
              <p>Audio is extracted from the reel's original video file and converted to <strong>MP3</strong> at a high bitrate on our server — the whole process usually takes just a few seconds. The result is a single audio file with no video, perfect for offline listening, ringtones, sampling reference, or studying a voiceover. Want the full video instead? Paste the same link into our <a href="/instagram-reels-downloader">reels downloader</a>.</p>
              <h2>Honest limitations &amp; copyright</h2>
              <p><strong>Private-account reels can't be converted</strong> — Instagram never exposes them to third-party tools. Also: music on Instagram is copyrighted. Keeping an MP3 for personal offline listening is fine; <strong>commercial use of copyrighted music requires a license</strong> from the rights holder. If you want to use trending audio in your own reels, Instagram's built-in "Use audio" feature is the safe route — it keeps the original artist credited.</p>
            </div>
          </div></section>
      <section className="section alt" id="faq"><div className="wrap"><div className="section-head"><h2>Audio downloader <span className="grad-text">FAQs</span></h2>
            </div><div className="faq-list">
              <details className="faq-item" open><summary>How do I download audio from an Instagram reel?</summary><div className="faq-a">Copy the reel's link from Instagram, paste it into the box above and hit Download. Our server extracts the reel's soundtrack and converts it to an MP3 in seconds.</div></details>
              <details className="faq-item"><summary>What quality are the MP3 files?</summary><div className="faq-a">We convert the reel's original audio track to MP3 at high bitrate, so you hear the same quality Instagram streams — clean, with no re-recording through speakers.</div></details>
              <details className="faq-item"><summary>Can I use downloaded Instagram audio in my own reels?</summary><div className="faq-a">The safe way to use trending audio in your own reels is Instagram's built-in "Use audio" feature — it keeps the original artist credited automatically. Only use downloaded audio where you have the rights to it.</div></details>
              <details className="faq-item"><summary>Is it legal to download Instagram audio?</summary><div className="faq-a">Keep downloads for personal, offline listening and respect music copyright. Commercial use of copyrighted music requires a license from the rights holder.</div></details>
              <details className="faq-item"><summary>Can I extract audio from a private reel?</summary><div className="faq-a">No. Private-account content is never accessible to any third-party tool. Only public reels and video posts can be converted.</div></details>
              <details className="faq-item"><summary>How long does the audio conversion take?</summary><div className="faq-a">Usually just a few seconds. The reel's audio is extracted on our server and converted to MP3 immediately after you paste the link.</div></details>
              <details className="faq-item"><summary>Does the MP3 include the video?</summary><div className="faq-a">No — this tool delivers audio only. If you want the full video, paste the same link into our <a href="/instagram-reels-downloader">reels downloader</a> or <a href="/instagram-video-downloader">video downloader</a>.</div></details>
              <details className="faq-item"><summary>Can I convert Instagram music posts to MP3 too?</summary><div className="faq-a">Yes. Any public reel or video post link works — the tool extracts whatever audio the post contains.</div></details>
              <details className="faq-item"><summary>Can I download Instagram audio on iPhone?</summary><div className="faq-a">Yes. Copy the reel link from the Instagram app, paste it here in Safari, and tap Download. The MP3 saves to your Files app, ready for offline listening.</div></details>
              <details className="faq-item"><summary>Why do some reels show ‘no audio available’?</summary><div className="faq-a">Some reels genuinely have no separate audio stream for Instagram to serve — for example, clips with certain licensed music in some regions. When that happens we tell you plainly instead of handing you a silent file.</div></details>
              <details className="faq-item"><summary>Can I extract audio from regular Instagram video posts?</summary><div className="faq-a">Yes. The audio downloader works with any public reel or video post link — paste it the same way and you'll get the MP3.</div></details>
              <details className="faq-item"><summary>Is the MP3 the same quality as the reel's sound?</summary><div className="faq-a">We convert the reel's original audio track directly on our server, so there's no re-recording loss or background noise — it's the cleanest copy available from the source.</div></details>
            </div>
          </div></section>
      <section className="section"><div className="wrap"><div className="section-head"><h2>More <span className="grad-text">download tools</span></h2>
            </div><div className="tools-grid"><a className="tool-card" href="/instagram-reels-downloader"><div className="icon-tile"><img src="/img/icons/clapperboard.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Reels Downloader</h3><p>Save public Instagram reels as high-quality MP4.</p><span className="go">Open tool →</span></a><a className="tool-card" href="/instagram-video-downloader"><div className="icon-tile"><img src="/img/icons/video.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Video Downloader</h3><p>Download Instagram video posts as MP4.</p><span className="go">Open tool →</span></a><a className="tool-card" href="/instagram-photo-downloader"><div className="icon-tile"><img src="/img/icons/photo.png" alt="" aria-hidden="true" width="30" height="30" loading="lazy" /></div><h3>Photo Downloader</h3><p>Download Instagram photos & carousels in high resolution.</p><span className="go">Open tool →</span></a></div></div></section>
      <section className="section"><div className="wrap"><div className="cta-band"><h2>Love that reel sound?</h2><p>Paste the link and get the MP3 in seconds.</p><FocusCta className="btn btn-ghost" href="#dl-form">Get the MP3 free</FocusCta></div></div></section>
    </>
  );
}
