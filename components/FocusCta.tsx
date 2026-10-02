'use client';

import type { ReactNode } from 'react';

type Props = {
  className?: string;
  href?: string;
  children: ReactNode;
};

/** CTA link that focuses the downloader input instead of navigating (same as the old inline onclick). */
export default function FocusCta({ className, href = '#', children }: Props) {
  return (
    <a
      className={className}
      href={href}
      onClick={(e) => {
        e.preventDefault();
        document.getElementById('ig-url')?.focus();
      }}
    >
      {children}
    </a>
  );
}
