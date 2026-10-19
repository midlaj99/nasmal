import { NextResponse } from 'next/server';
import { uploadImageBuffer } from '@/lib/cloudinary';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { requireAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`upload_${ip}`, { windowMs: 60000, max: 40 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Upload rate limit reached. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    const auth = await requireAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    const data = await request.formData();
    
    // Check for multiple files ('files') or single file ('file')
    const filesList: File[] = [];
    const filesFromForm = data.getAll('files') as File[];
    if (filesFromForm && filesFromForm.length > 0) {
      for (const f of filesFromForm) {
        if (f && typeof f === 'object' && f.size > 0) {
          filesList.push(f);
        }
      }
    }

    const singleFile = data.get('file') as File | null;
    if (singleFile && singleFile.size > 0 && filesList.length === 0) {
      filesList.push(singleFile);
    }

    if (filesList.length === 0) {
      return NextResponse.json({ error: 'No files provided for upload' }, { status: 400 });
    }

    const allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'
    ];
    const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB for images
    const MAX_VIDEO_SIZE = 60 * 1024 * 1024; // 60MB for videos

    for (const file of filesList) {
      if (!allowedMimeTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file format (${file.name}). Allowed: JPG, PNG, WEBP, GIF, SVG, MP4, WebM, MOV.` },
          { status: 400 }
        );
      }

      const isVideo = file.type.startsWith('video/');
      const maxLimit = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

      if (file.size > maxLimit) {
        return NextResponse.json(
          { error: `File size exceeds ${isVideo ? '60MB' : '15MB'} limit (${file.name}).` },
          { status: 400 }
        );
      }
    }

    // Upload all files concurrently in parallel for blazing speed
    const uploadedUrls = await Promise.all(
      filesList.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        return uploadImageBuffer(buffer, file.name, 'nasmal_packages', file.type || 'image/jpeg');
      })
    );

    return NextResponse.json({
      url: uploadedUrls[0],
      urls: uploadedUrls,
      count: uploadedUrls.length
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
