import { NextRequest, NextResponse } from 'next/server';
import { clientIp, extractFacebookVideo, isRateLimited, normalizeFacebookUrl } from '@/lib/extraction';

export async function POST(req: NextRequest) {
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, code: 'RATE_LIMIT', message: 'Too many requests. Please wait a minute and try again.' },
      { status: 429 }
    );
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const url = normalizeFacebookUrl(body.url);
  if (!url) {
    return NextResponse.json(
      { ok: false, code: 'INVALID_URL', message: 'Please paste a valid Facebook video link (facebook.com or fb.watch).' },
      { status: 400 }
    );
  }
  try {
    const found = await extractFacebookVideo(url);
    if (!found) {
      return NextResponse.json(
        {
          ok: false,
          code: 'NOT_FOUND',
          message:
            'Could not fetch this Facebook video. It may be private, age-restricted, or login-required — we only support public videos.',
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      ok: true,
      type: 'video',
      source: url,
      url: found.videoUrl,
      images: [],
      thumbnail: found.thumbnail,
      title: found.title || 'Facebook video',
    });
  } catch {
    return NextResponse.json(
      { ok: false, code: 'FETCH_FAILED', message: 'Could not reach Facebook. Please check the link and try again.' },
      { status: 502 }
    );
  }
}
