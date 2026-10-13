import { NextResponse } from 'next/server';
import { getImageFromDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const imgData = await getImageFromDb(resolvedParams.id);

    if (!imgData || !imgData.data) {
      return new NextResponse('Image not found', { status: 404 });
    }

    return new NextResponse(new Uint8Array(imgData.data), {
      status: 200,
      headers: {
        'Content-Type': imgData.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('Error serving database image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
