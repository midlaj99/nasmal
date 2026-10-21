import { NextResponse } from 'next/server';
import { updateDestination, deleteDestination, getDestinationById } from '@/lib/db';
import { sanitizeString, sanitizeUrl } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { requireAdminAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`get_dest_${ip}`, { windowMs: 60000, max: 240 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    const resolvedParams = await params;
    const dest = await getDestinationById(resolvedParams.id);
    if (!dest) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }
    return NextResponse.json(dest, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (error: any) {
    console.error('Error fetching destination:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`patch_dest_${ip}`, { windowMs: 60000, max: 40 });
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

    const resolvedParams = await params;
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const updates: any = {};
    if (body.title !== undefined) updates.title = sanitizeString(body.title);
    if (body.image !== undefined) updates.image = sanitizeUrl(body.image);
    if (body.toursCount !== undefined) updates.toursCount = parseInt(body.toursCount, 10) || 0;

    const updated = await updateDestination(resolvedParams.id, updates);

    if (!updated) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    // Fast non-blocking revalidation
    Promise.resolve().then(() => {
      try {
        revalidatePath('/');
        revalidatePath('/destinations');
      } catch (e) {
        console.warn('Revalidation notice:', e);
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating destination:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`del_dest_${ip}`, { windowMs: 60000, max: 30 });
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

    const resolvedParams = await params;
    const rawId = resolvedParams?.id || '';
    if (!rawId.trim()) {
      return NextResponse.json({ error: 'Destination ID is required' }, { status: 400 });
    }

    await deleteDestination(rawId);

    // Fast non-blocking revalidation
    Promise.resolve().then(() => {
      try {
        revalidatePath('/');
        revalidatePath('/destinations');
        revalidatePath(`/destinations/${rawId}`);
        revalidatePath('/activities');
      } catch (e) {
        console.warn('Revalidation notice:', e);
      }
    });

    return NextResponse.json({ success: true, message: 'Destination deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting destination:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
