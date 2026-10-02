import { NextRequest, NextResponse } from 'next/server';
import { clientIp, isRateLimited } from '@/lib/extraction';

export async function POST(req: NextRequest) {
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, code: 'RATE_LIMIT', message: 'Too many requests. Please wait a minute and try again.' },
      { status: 429 }
    );
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const { name, email, message } = body;
  if (!name || !email || !message || typeof message !== 'string') {
    return NextResponse.json(
      { ok: false, message: 'Please fill in your name, email and message.' },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return NextResponse.json({ ok: false, message: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json(
      { ok: false, message: 'Your message is too long (max 5000 characters).' },
      { status: 400 }
    );
  }
  console.log(
    `[contact] ${String(name).slice(0, 80)} <${String(email).slice(0, 120)}>: ${message.slice(0, 300)}`
  );
  return NextResponse.json({ ok: true });
}
