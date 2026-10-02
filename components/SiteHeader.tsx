'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const TOOLS = [
  { href: '/instagram-reels-downloader', label: 'Reels downloader', icon: '/img/icons/clapperboard-black.png' },
  { href: '/instagram-video-downloader', label: 'Video downloader', icon: '/img/icons/video-black.png' },
  { href: '/instagram-photo-downloader', label: 'Photo downloader', icon: '/img/icons/photo-black.png' },
  { href: '/instagram-audio-downloader', label: 'Audio downloader', icon: '/img/icons/music-black.png' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const active = (p: string) => (pathname === p ? 'active' : undefined);

  return (
    <header className="site-header">
      <div className="wrap nav">
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
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/" className={active('/')}>Home</Link>
          <Link href="/instagram-reels-downloader" className={active('/instagram-reels-downloader')}>Reels</Link>
          <Link href="/instagram-photo-downloader" className={active('/instagram-photo-downloader')}>Photos</Link>
          <Link href="/instagram-audio-downloader" className={active('/instagram-audio-downloader')}>Audio</Link>
        </nav>
        <div className="nav-right">
          <div className="tool-switch" role="navigation" aria-label="Switch tool">
            {TOOLS.map((t) => (
              <Link key={t.href} className="ts-btn" href={t.href} aria-label={t.label} title={t.label}>
                <img src={t.icon} alt="" aria-hidden="true" width="20" height="20" />
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
