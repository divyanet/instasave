import { NextRequest, NextResponse } from 'next/server';
import { clientIp, isAllowedDownloadHost, isRateLimited, UA } from '@/lib/extraction';

/**
 * Proxy download so the file saves directly (avoids new-tab / hotlink issues).
 * SSRF guard: only Instagram CDN hosts are allowed.
 */
export async function GET(req: NextRequest) {
  if (isRateLimited(clientIp(req))) {
    return new NextResponse('Too many requests', { status: 429 });
  }
  const target = req.nextUrl.searchParams.get('u');
  const kind = req.nextUrl.searchParams.get('t') === 'image' ? 'image' : 'video';
  if (!target || typeof target !== 'string') return new NextResponse('Missing url', { status: 400 });
  let u: URL;
  try {
    u = new URL(target);
  } catch {
    return new NextResponse('Bad url', { status: 400 });
  }
  if (u.protocol !== 'https:' || !isAllowedDownloadHost(u.hostname)) {
    return new NextResponse('Forbidden host', { status: 403 });
  }
  try {
    const upstream = await fetch(u.toString(), {
      headers: { 'User-Agent': UA, Referer: 'https://www.instagram.com/' },
    });
    if (!upstream.ok || !upstream.body) return new NextResponse('Upstream failed', { status: 502 });
    const ext = kind === 'image' ? 'jpg' : 'mp4';
    const ct = upstream.headers.get('content-type') || (kind === 'image' ? 'image/jpeg' : 'video/mp4');
    const headers: Record<string, string> = {
      'Content-Type': ct,
      'Content-Disposition': `attachment; filename="instasave-${Date.now()}.${ext}"`,
      'Cache-Control': 'no-store',
    };
    const len = upstream.headers.get('content-length');
    if (len) headers['Content-Length'] = len;
    return new NextResponse(upstream.body, { headers });
  } catch {
    return new NextResponse('Download failed', { status: 502 });
  }
}
