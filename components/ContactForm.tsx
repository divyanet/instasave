'use client';

import { useState } from 'react';

function esc(s: unknown): string {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => {
    const m: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return m[c];
  });
}

/** Contact form — POSTs to /api/contact, shows an inline confirmation. Port of app.js. */
export default function ContactForm() {
  const [statusHtml, setStatusHtml] = useState('');
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.querySelector('[name="name"]') as HTMLInputElement)?.value || '',
      email: (form.querySelector('[name="email"]') as HTMLInputElement)?.value || '',
      message: (form.querySelector('[name="message"]') as HTMLTextAreaElement)?.value || '',
    };
    setSending(true);
    setStatusHtml('<span class="spinner"></span>Sending…');
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const j = await r.json();
      setSending(false);
      if (!j.ok) {
        setStatusHtml('❌ ' + esc(j.message || 'Could not send. Please try again.'));
        return;
      }
      form.reset();
      setStatusHtml('✅ Message sent — we usually reply within 48 hours.');
    } catch {
      setSending(false);
      setStatusHtml('❌ Network error. Please try again.');
    }
  }

  return (
    <>
      <form id="contact-form" className="contact-form" onSubmit={onSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cf-name">Your name</label>
            <input type="text" id="cf-name" name="name" placeholder="Jane Doe" autoComplete="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="cf-email">Email address</label>
            <input type="email" id="cf-email" name="email" placeholder="you@email.com" autoComplete="email" required />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="cf-topic">Topic</label>
          <input type="text" id="cf-topic" name="topic" placeholder="Bug report / Feature request / DMCA notice / Other" />
        </div>
        <div className="form-group">
          <label htmlFor="cf-message">Message</label>
          <textarea
            id="cf-message"
            name="message"
            rows={5}
            placeholder="Tell us what’s up — include the link that failed, if any…"
            required
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={sending}>
          Send message
        </button>
      </form>
      <div
        className="status"
        id="contact-status"
        role="status"
        aria-live="polite"
        style={{ marginTop: '14px', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}
        dangerouslySetInnerHTML={{ __html: statusHtml }}
      />
    </>
  );
}
