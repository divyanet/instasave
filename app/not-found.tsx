import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found \u2013 InstaSave',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <section className="page-hero"><div className="wrap">
      <h1>Page not found</h1>
      <p className="sub">The link you followed doesn’t exist — but the downloader does.</p>
      <p style={{ marginTop: "28px" }}><a className="btn btn-primary" href="/">Back to InstaSave</a></p>
      </div></section>
    </>
  );
}
