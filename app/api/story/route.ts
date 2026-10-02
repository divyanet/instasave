import { NextRequest, NextResponse } from 'next/server';
import { clientIp, isRateLimited } from '@/lib/extraction';

/**
 * Stories: honest stub.
 * Instagram serves stories only to logged-in sessions. We never ask for
 * credentials, so story downloads are not offered. This endpoint exists so
 * the UI can show a clear, honest explanation instead of failing silently.
 */
export async function POST(req: NextRequest) {
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, code: 'RATE_LIMIT', message: 'Too many requests. Please wait a minute and try again.' },
      { status: 429 }
    );
  }
  return NextResponse.json(
    {
      ok: false,
      code: 'LOGIN_REQUIRED',
      message:
        'Instagram only shows stories to logged-in accounts, so no legitimate no-login tool can download them. ' +
        'We will never ask for your Instagram password — any site that does is not safe.',
    },
    { status: 400 }
  );
}
