import { NextResponse } from 'next/server';
import { getImageFromDb } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`get_img_${ip}`, { windowMs: 60000, max: 1200 });
    if (!rateLimit.allowed) {
      return new NextResponse('Rate limit exceeded', {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.resetTime) },
      });
    }

    const resolvedParams = await params;
    const safeId = String(resolvedParams.id || '').trim().replace(/[^a-zA-Z0-9_-]/g, '');

    if (!safeId) {
      return new NextResponse('Invalid media ID', { status: 400 });
    }

    // Check If-None-Match header for instant 304 response
    const clientEtag = request.headers.get('if-none-match');
    const etag = `"${safeId}"`;

    if (clientEtag === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    const imgData = await getImageFromDb(safeId);

    if (!imgData || !imgData.data) {
      return new NextResponse('Media not found', { status: 404 });
    }

    const buffer = imgData.data;
    const totalSize = buffer.length;
    const contentType = imgData.contentType || 'image/jpeg';
    const isVideo = contentType.startsWith('video/');

    // HTTP 206 Partial Content Range streaming for video playback (Safari & Chrome video players)
    const rangeHeader = request.headers.get('range');
    if (isVideo && rangeHeader && rangeHeader.startsWith('bytes=')) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10) || 0;
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

      if (start >= totalSize || end >= totalSize || start > end) {
        return new NextResponse('Requested range not satisfiable', {
          status: 416,
          headers: {
            'Content-Range': `bytes */${totalSize}`,
          },
        });
      }

      const chunk = buffer.subarray(start, end + 1);
      const chunkSize = chunk.length;

      return new NextResponse(new Uint8Array(chunk), {
        status: 206,
        headers: {
          'Content-Type': contentType,
          'Content-Range': `bytes ${start}-${end}/${totalSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(chunkSize),
          'ETag': etag,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(totalSize),
        'Accept-Ranges': 'bytes',
        'ETag': etag,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Error serving database media:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
