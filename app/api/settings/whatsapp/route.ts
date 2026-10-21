import { NextResponse } from 'next/server';
import { getWhatsAppConfig, updateWhatsAppConfig } from '@/lib/db';
import { validateWhatsAppPayload } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { requireAdminAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`get_wa_config_${ip}`, { windowMs: 60000, max: 240 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    const config = await getWhatsAppConfig();
    return NextResponse.json(
      { success: true, ...config },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching WhatsApp configuration:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`post_wa_config_${ip}`, { windowMs: 60000, max: 30 });
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

    const validation = validateWhatsAppPayload(body);
    if (!validation.isValid || !validation.data) {
      return NextResponse.json({ error: validation.errors?.join(', ') || 'Invalid WhatsApp payload' }, { status: 400 });
    }

    const updated = await updateWhatsAppConfig(validation.data);

    try {
      revalidatePath('/');
      revalidatePath('/checkout');
      revalidatePath('/contact');
    } catch (e) {
      console.warn('Revalidation notice:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'WhatsApp number updated successfully. All customer orders will be sent to this number.',
      ...updated,
    });
  } catch (error: any) {
    console.error('Error updating WhatsApp configuration:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  return POST(request);
}
