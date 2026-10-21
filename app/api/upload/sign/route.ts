import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getCloudinaryConfig } from '@/lib/db';
import { requireAdminAuth } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`upload_sign_${ip}`, { windowMs: 60000, max: 120 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many upload requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    const auth = await requireAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    const config = await getCloudinaryConfig();
    const body = await request.json().catch(() => ({}));
    const resourceType = body.resourceType === 'video' ? 'video' : 'image';
    const folder = body.folder || 'nasmal_packages';

    // 1. Signed Direct Upload: when cloudName + apiKey + apiSecret are present
    if (config.cloudName && config.apiKey && config.apiSecret) {
      const timestamp = Math.round(Date.now() / 1000);
      const paramsToSign: Record<string, any> = {
        folder,
        timestamp,
      };

      const signature = cloudinary.utils.api_sign_request(paramsToSign, config.apiSecret);

      return NextResponse.json({
        success: true,
        isConfigured: true,
        mode: 'signed',
        cloudName: config.cloudName,
        apiKey: config.apiKey,
        timestamp,
        signature,
        folder,
        resourceType,
      });
    }

    // 2. Unsigned Direct Upload: when uploadPreset is configured
    if (config.cloudName && config.uploadPreset) {
      return NextResponse.json({
        success: true,
        isConfigured: true,
        mode: 'unsigned',
        cloudName: config.cloudName,
        uploadPreset: config.uploadPreset,
        folder,
        resourceType,
      });
    }

    // 3. Not configured yet
    return NextResponse.json({
      success: false,
      isConfigured: false,
      cloudName: config.cloudName || 'woe2kr5p',
      message: 'Cloudinary credentials not configured yet.',
    });
  } catch (error: any) {
    console.error('Error generating Cloudinary upload signature:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
