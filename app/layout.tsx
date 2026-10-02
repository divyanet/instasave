import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://instasave-nb5s.onrender.com';

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%232f6bff'/%3E%3Cpath d='M50 22v34m0 0l-14-14m14 14l14-14' stroke='white' stroke-width='9' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Cpath d='M28 66v10a6 6 0 0 0 6 6h32a6 6 0 0 0 6-6V66' stroke='white' stroke-width='9' stroke-linecap='round' fill='none'/%3E%3C/svg%3E";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: [{ url: FAVICON, rel: 'icon' }] },
  openGraph: { siteName: 'InstaSave', type: 'website' },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

// Runs before first paint so the saved theme applies with no flash (same as the old inline head script).
const THEME_SCRIPT = `try{var t=localStorage.getItem('instasave_theme')||'light';document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={jakarta.className}>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <div className="page-glow" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
        </div>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
