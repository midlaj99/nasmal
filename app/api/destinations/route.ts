import { NextResponse } from 'next/server';
import { getDestinations, addDestination, DEFAULT_DESTINATIONS } from '@/lib/db';
import { validateDestinationPayload } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { requireAdminAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`get_destinations_${ip}`, { windowMs: 60000, max: 120 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    const { searchParams } = new URL(request.url);
    const hasNoCache = searchParams.has('nocache') || request.headers.get('cache-control')?.includes('no-cache');
    const cacheHeader = hasNoCache
      ? 'no-store, no-cache, must-revalidate, max-age=0'
      : 'public, s-maxage=2, stale-while-revalidate=5';

    const destinations = await getDestinations();
    return NextResponse.json(destinations, {
      headers: {
        'Cache-Control': cacheHeader,
      },
    });
  } catch (error: any) {
    console.error('Error fetching destinations, falling back to defaults:', error);
    return NextResponse.json(DEFAULT_DESTINATIONS, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`post_destination_${ip}`, { windowMs: 60000, max: 30 });
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

    const validation = validateDestinationPayload(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    const newDestination = await addDestination(validation.data);

    // Fast non-blocking revalidation
    Promise.resolve().then(() => {
      try {
        revalidatePath('/');
        revalidatePath('/destinations');
        revalidatePath(`/destinations/${newDestination.id}`);
      } catch (e) {
        console.warn('Revalidation notice:', e);
      }
    });

    return NextResponse.json(newDestination, { status: 201 });
  } catch (error: any) {
    console.error('Error adding destination:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
