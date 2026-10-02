import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, unlink } from 'fs';
import {
  clientIp,
  convertFirstWorkingToMp3,
  extractAllVideoUrls,
  getFfmpegPath,
  isRateLimited,
  normalizeInstagramUrl,
} from '@/lib/extraction';

/** Reel/video -> MP3 (GET, returns the file directly). */
export async function GET(req: NextRequest) {
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, code: 'RATE_LIMIT', message: 'Too many requests. Please wait a minute and try again.' },
      { status: 429 }
    );
  }
  const canonical = normalizeInstagramUrl(req.nextUrl.searchParams.get('url'));
  if (!canonical) {
    return NextResponse.json(
      {
        ok: false,
        code: 'INVALID_URL',
        message: 'Please paste a valid public Instagram link (instagram.com/reel/… or /p/…).',
      },
      { status: 400 }
    );
  }
  if (!getFfmpegPath()) {
    return NextResponse.json(
      { ok: false, code: 'NO_FFMPEG', message: 'Audio conversion is temporarily unavailable. Please try again later.' },
      { status: 503 }
    );
  }
  const { videos, dashAudio } = await extractAllVideoUrls(canonical);
  const candidates = [...videos, ...(dashAudio ? [dashAudio] : [])];
  if (!candidates.length) {
    return NextResponse.json(
      {
        ok: false,
        code: 'NOT_FOUND',
        message: 'Could not find media at this link. It may be private, deleted, or the link is wrong.',
      },
      { status: 404 }
    );
  }
  const converted = await convertFirstWorkingToMp3(candidates);
  if (!converted) {
    return NextResponse.json(
      { ok: false, code: 'NO_AUDIO', message: 'This video has no audio track to convert. Try another reel or video.' },
      { status: 422 }
    );
  }

  // Stream the MP3 to the client, then delete the temp file.
  const stream = createReadStream(converted.file);
  const cleanup = () => unlink(converted.file, () => {});
  stream.on('close', cleanup);
  stream.on('error', cleanup);

  const webStream = new ReadableStream({
    start(controller) {
      stream.on('data', (chunk) => controller.enqueue(chunk));
      stream.on('end', () => {
        controller.close();
        cleanup();
      });
      stream.on('error', (err) => {
        controller.error(err);
        cleanup();
      });
    },
    cancel() {
      stream.destroy();
      cleanup();
    },
  });

  return new NextResponse(webStream, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': `attachment; filename="instasave-audio-${converted.id}.mp3"`,
      'Cache-Control': 'no-store',
    },
  });
}
