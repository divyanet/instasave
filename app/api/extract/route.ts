import { NextRequest, NextResponse } from 'next/server';
import { clientIp, extractMedia, ExtractError, isRateLimited, normalizeInstagramUrl } from '@/lib/extraction';

export async function POST(req: NextRequest) {
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, code: 'RATE_LIMIT', message: 'Too many requests. Please wait a minute and try again.' },
      { status: 429 }
    );
  }
  const body = await req.json().catch(() => ({}));
  const canonical = normalizeInstagramUrl(body && (body as Record<string, unknown>).url);
  if (!canonical) {
    return NextResponse.json(
      {
        ok: false,
        code: 'INVALID_URL',
        message: 'Please paste a valid public Instagram link (instagram.com/reel/…, /p/… or /tv/…).',
      },
      { status: 400 }
    );
  }
  try {
    const info = await extractMedia(canonical);
    return NextResponse.json({ ok: true, source: canonical, ...info });
  } catch (e) {
    const code = e instanceof ExtractError ? e.code : 'FETCH_FAILED';
    const map: Record<string, [number, string]> = {
      NOT_FOUND: [404, 'Could not find media at this link. It may be private, deleted, or the link is wrong.'],
      FETCH_FAILED: [502, 'Could not reach Instagram. Please check the link and try again.'],
    };
    const [status, message] = map[code] || map.FETCH_FAILED;
    return NextResponse.json({ ok: false, code, message }, { status });
  }
}
