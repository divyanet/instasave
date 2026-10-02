'use client';

import { useRef, useState } from 'react';

type Props = {
  api?: string;
  inputType?: string;
  placeholder?: string;
  ariaLabel?: string;
  sampleUrl?: string;
  buttonLabel?: string;
};

type Status = { html: string; kind: '' | 'loading' | 'ok' | 'error' };

type ResultData = {
  type: string;
  limited?: boolean;
  url?: string;
  images?: string[];
  thumbnail?: string | null;
  audioBlobUrl?: string;
};

function esc(s: unknown): string {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => {
    const m: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return m[c];
  });
}

function dlHref(fileUrl: string, kind: string): string {
  return '/api/download?u=' + encodeURIComponent(fileUrl) + '&t=' + (kind === 'image' ? 'image' : 'video');
}

const ICON_DL = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M4 21h16" />
  </svg>
);

const ICON_RETRY = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 2.6-6.4" />
    <path d="M3 4v5h5" />
  </svg>
);

/**
 * The paste-link / preview / download widget. Port of public/js/app.js.
 * api prop selects the tool: /api/extract (default), /api/audio, /api/profile-pic,
 * /api/fb-extract, /api/story.
 */
export default function DownloaderForm({
  api = '/api/extract',
  inputType = 'url',
  placeholder = 'Paste Instagram link…',
  ariaLabel = 'Instagram link',
  sampleUrl,
  buttonLabel = 'Download',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>({ html: '', kind: '' });
  const [result, setResult] = useState<ResultData | null>(null);

  const isAudio = api === '/api/audio';

  function reset() {
    setResult(null);
    setStatus({ html: '', kind: '' });
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleAudio(url: string) {
    setStatus({ html: '<span class="spinner"></span>Converting to MP3… this takes a few seconds.', kind: 'loading' });
    try {
      const r = await fetch(api + '?url=' + encodeURIComponent(url));
      const ct = r.headers.get('content-type') || '';
      if (!r.ok || ct.indexOf('application/json') !== -1) {
        const j = await r.json();
        throw new Error(j.message || 'Conversion failed.');
      }
      const blob = await r.blob();
      setLoading(false);
      if (!blob || !blob.size) throw new Error('Empty audio file.');
      const blobUrl = URL.createObjectURL(blob);
      setStatus({ html: '✅ Your MP3 is ready.', kind: 'ok' });
      setResult({ type: 'audio', audioBlobUrl: blobUrl });
    } catch (err) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setStatus({ html: '❌ ' + esc(msg), kind: 'error' });
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = (inputRef.current?.value || '').trim();
    if (!url) {
      setStatus({ html: 'Please paste a link first.', kind: 'error' });
      inputRef.current?.focus();
      return;
    }
    setLoading(true);
    setResult(null);
    setStatus({ html: '', kind: '' });

    if (isAudio) {
      await handleAudio(url);
      return;
    }

    setStatus({ html: '<span class="spinner"></span>Fetching media…', kind: 'loading' });
    try {
      const r = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const j = await r.json();
      setLoading(false);
      if (!j.ok) {
        setStatus({ html: '❌ ' + esc(j.message || 'Something went wrong. Please try again.'), kind: 'error' });
        return;
      }
      setStatus({ html: '✅ Media found — tap download below.', kind: 'ok' });
      setResult(j);
      try {
        const h = JSON.parse(localStorage.getItem('instasave_history') || '[]');
        h.unshift({ url: j.source, title: j.title, at: Date.now() });
        localStorage.setItem('instasave_history', JSON.stringify(h.slice(0, 10)));
      } catch {
        /* private mode */
      }
    } catch {
      setLoading(false);
      setStatus({ html: '❌ Network error. Check your connection and try again.', kind: 'error' });
    }
  }

  function useSample() {
    if (inputRef.current && sampleUrl) {
      inputRef.current.value = sampleUrl;
      inputRef.current.focus();
    }
    formRef.current?.requestSubmit();
  }

  function pasteHelper() {
    const input = inputRef.current;
    if (!input || input.value) return;
    if (!navigator.clipboard || !navigator.clipboard.readText) return;
    navigator.clipboard
      .readText()
      .then((t) => {
        t = (t || '').trim();
        if (/instagram\.com\//i.test(t) || /facebook\.com\//i.test(t) || /fb\.watch\//i.test(t)) input.value = t;
      })
      .catch(() => {});
  }

  function againBtn() {
    return (
      <button type="button" className="btn btn-soft btn-block" onClick={reset}>
        {ICON_RETRY}Download Again
      </button>
    );
  }

  function renderResult(d: ResultData) {
    if (d.type === 'audio' && d.audioBlobUrl) {
      return (
        <div className="dl-result">
          <div className="dl-preview">
            <div className="dl-art">
              <img src="/img/icons/music.png" alt="" aria-hidden="true" />
            </div>
          </div>
          <a className="btn btn-primary btn-block" href={d.audioBlobUrl} download="instasave-audio.mp3">
            {ICON_DL}Download MP3
          </a>
          {againBtn()}
        </div>
      );
    }
    if (d.type === 'video' && !d.limited && d.url) {
      return (
        <div className="dl-result">
          <div className="dl-preview">
            <video controls playsInline preload="metadata" poster={d.thumbnail || undefined} src={d.url} />
          </div>
          <a className="btn btn-primary btn-block" href={dlHref(d.url, 'video')}>
            {ICON_DL}Download Video
          </a>
          {againBtn()}
        </div>
      );
    }
    if (d.type === 'video' && d.limited) {
      return (
        <div className="dl-result">
          {d.thumbnail ? (
            <div className="dl-preview">
              <img src={d.thumbnail} alt="Video preview" loading="lazy" />
            </div>
          ) : null}
          <div className="limited-note">
            ⚠️ <strong>Video file blocked:</strong> Instagram is currently refusing automated video requests from our
            server, so the MP4 can&rsquo;t be fetched right now. Open the reel in the Instagram app and use its
            built-in save/share instead. We retry the video automatically on every request &mdash; it unlocks the
            moment Instagram allows it.
          </div>
          {againBtn()}
        </div>
      );
    }
    if (d.type === 'image' && d.images && d.images.length) {
      return (
        <div className="dl-result">
          <div className="dl-preview">
            <img src={d.images[0]} alt="Photo preview" loading="lazy" />
          </div>
          <a className="btn btn-primary btn-block" href={dlHref(d.images[0], 'image')}>
            {ICON_DL}Download Photo
          </a>
          {againBtn()}
        </div>
      );
    }
    if (d.type === 'carousel' && d.images && d.images.length) {
      return (
        <div className="dl-result">
          <div className="dl-preview">
            <img src={d.images[0]} alt="Photo 1 preview" loading="lazy" />
          </div>
          {d.images.map((src, i) => (
            <a key={src} className="btn btn-primary btn-block" href={dlHref(src, 'image')}>
              {ICON_DL}Download Photo {i + 1}
            </a>
          ))}
          {againBtn()}
        </div>
      );
    }
    return null;
  }

  return (
    <div className="dl-card">
      <form className="dl-form" ref={formRef} onSubmit={onSubmit}>
        <svg
          className="form-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        <input
          ref={inputRef}
          type={inputType}
          id="ig-url"
          name="url"
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          aria-label={ariaLabel}
          onFocus={pasteHelper}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {buttonLabel}
        </button>
      </form>
      {sampleUrl ? (
        <div className="sample-row">
          <span>No link handy?</span>{' '}
          <button type="button" className="sample-link" onClick={useSample}>
            Try a sample reel →
          </button>
        </div>
      ) : null}
      <div
        className={'status' + (status.kind ? ' ' + status.kind : '')}
        role="status"
        aria-live="polite"
        dangerouslySetInnerHTML={{ __html: status.html }}
      />
      <div className={'result' + (result ? ' show' : '')}>{result ? renderResult(result) : null}</div>
    </div>
  );
}
