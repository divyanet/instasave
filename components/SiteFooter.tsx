import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="logo" href="/" aria-label="InstaSave home">
              <span className="logo-mark">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5" />
                  <path d="M5 20h14" />
                </svg>
              </span>
              <span>
                Insta<em>Save</em>
              </span>
            </Link>
            <p>
              InstaSave is an online free tool to download Instagram reels, videos, photos, and audio to your device.
              Save any reels video to your phone or computer and view it offline anytime &mdash; simple and free.
            </p>
          </div>
          <div className="footer-col">
            <h4>Tools</h4>
            <Link href="/instagram-reels-downloader">Reels Downloader</Link>
            <Link href="/instagram-video-downloader">Video Downloader</Link>
            <Link href="/instagram-photo-downloader">Photo Downloader</Link>
            <Link href="/instagram-audio-downloader">Audio Downloader</Link>
            <Link href="/instagram-profile-downloader">Profile Downloader</Link>
            <Link href="/facebook-video-downloader">Facebook Video Downloader</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <Link href="/how-to-download">How to Download</Link>
            <Link href="/instagram-story-downloader">Story Download Guide</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            <Link href="/dmca">DMCA</Link>
          </div>
        </div>
        <p className="footer-disclaimer">
          InstaSave is not affiliated with Instagram&trade;, Facebook&trade;, or Meta Platforms. We do not host or
          store media files on our servers &mdash; all content belongs to its original owners. Please don&apos;t use
          this tool for copyrighted or restricted content; we comply with the DMCA and respond to valid infringement
          notices.
        </p>
        <div className="footer-bottom">
          <span>&copy; 2026 InstaSave. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
