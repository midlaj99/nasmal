import { NextResponse } from 'next/server';
import { getCloudinaryConfig, updateCloudinaryConfig } from '@/lib/db';
import { validateCloudinaryPayload } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { requireAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    const config = await getCloudinaryConfig();
    const maskedKey = config.apiKey
      ? config.apiKey.slice(0, 3) + '••••' + config.apiKey.slice(-3)
      : '';

    return NextResponse.json({
      success: true,
      cloudName: config.cloudName,
      apiKeyMasked: maskedKey,
      isConfigured: config.isConfigured,
      updatedAt: config.updatedAt,
    });
  } catch (error: any) {
    console.error('Error fetching Cloudinary settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`post_cld_config_${ip}`, { windowMs: 60000, max: 20 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    const auth = await requireAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const validation = validateCloudinaryPayload(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    const updated = await updateCloudinaryConfig(validation.data);

    return NextResponse.json({
      success: true,
      message: 'Cloudinary configuration updated. Media will now stream directly from Cloudinary CDN with zero Mongo storage used.',
      isConfigured: updated.isConfigured,
      cloudName: updated.cloudName,
    });
  } catch (error: any) {
    console.error('Error updating Cloudinary settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
