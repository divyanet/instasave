'use client';

import { useEffect } from 'react';

function applyTheme(t: string) {
  document.documentElement.setAttribute('data-theme', t);
  try {
    localStorage.setItem('instasave_theme', t);
  } catch {
    /* private mode */
  }
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t === 'dark' ? '#07070d' : '#f5f5fa');
}

export default function ThemeToggle() {
  useEffect(() => {
    // Sync the label with the theme set by the head inline script.
    applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
  }, []);

  return (
    <button
      className="theme-toggle"
      aria-label="Toggle dark mode"
      onClick={() => {
        const cur = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(cur === 'dark' ? 'light' : 'dark');
      }}
    >
      <svg
        className="ic-moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg
        className="ic-sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
