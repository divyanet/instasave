import { NextRequest, NextResponse } from 'next/server';
import { clientIp, ExtractError, fetchProfilePic, isRateLimited, normalizeProfileInput } from '@/lib/extraction';

export async function POST(req: NextRequest) {
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, code: 'RATE_LIMIT', message: 'Too many requests. Please wait a minute and try again.' },
      { status: 429 }
    );
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const username = normalizeProfileInput(body.username || body.url);
  if (!username) {
    return NextResponse.json(
      {
        ok: false,
        code: 'INVALID_INPUT',
        message: 'Please enter a valid Instagram username (letters, numbers, . and _).',
      },
      { status: 400 }
    );
  }
  try {
    const pic = await fetchProfilePic(username);
    if (!pic) {
      return NextResponse.json(
        {
          ok: false,
          code: 'NOT_FOUND',
          message: 'Could not fetch this profile picture. The account may be private or the username may be wrong.',
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      ok: true,
      type: 'image',
      source: `https://www.instagram.com/${username}/`,
      url: pic,
      images: [pic],
      thumbnail: pic,
      title: `@${username} — profile picture`,
      author: username,
    });
  } catch (e) {
    const code = e instanceof ExtractError ? e.code : 'FETCH_FAILED';
    if (code === 'FETCH_FAILED') {
      return NextResponse.json(
        { ok: false, code: 'FETCH_FAILED', message: 'Could not reach Instagram. Please try again in a moment.' },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { ok: false, code: 'NOT_FOUND', message: 'Could not fetch this profile picture.' },
      { status: 404 }
    );
  }
}
