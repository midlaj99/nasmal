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
    const rateLimit = checkRateLimit(`get_img_${ip}`, { windowMs: 60000, max: 600 });
    if (!rateLimit.allowed) {
      return new NextResponse('Rate limit exceeded', {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.resetTime) },
      });
    }

    const resolvedParams = await params;
    const safeId = String(resolvedParams.id || '').trim().replace(/[^a-zA-Z0-9_-]/g, '');

    if (!safeId) {
      return new NextResponse('Invalid image ID', { status: 400 });
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
      return new NextResponse('Image not found', { status: 404 });
    }

    return new NextResponse(new Uint8Array(imgData.data), {
      status: 200,
      headers: {
        'Content-Type': imgData.contentType,
        'ETag': etag,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Error serving database image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
