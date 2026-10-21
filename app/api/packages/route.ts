import { NextResponse } from 'next/server';
import { getPackages, addPackage, DEFAULT_PACKAGES } from '@/lib/db';
import { validatePackagePayload } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { requireAdminAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`get_packages_${ip}`, { windowMs: 60000, max: 120 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const isPopular = searchParams.get('isPopular');
    const isBestDeal = searchParams.get('isBestDeal');

    const packages = await getPackages();

    let filtered = packages;
    if (destination) {
      filtered = filtered.filter(
        pkg => pkg.destination.toLowerCase() === destination.toLowerCase()
      );
    }
    if (isPopular === 'true') {
      filtered = filtered.filter(pkg => Boolean(pkg.isPopular));
    }
    if (isBestDeal === 'true') {
      filtered = filtered.filter(pkg => Boolean(pkg.isBestDeal));
    }

    const hasNoCache = searchParams.has('nocache') || request.headers.get('cache-control')?.includes('no-cache');
    const cacheHeader = hasNoCache
      ? 'no-store, no-cache, must-revalidate, max-age=0'
      : 'public, s-maxage=2, stale-while-revalidate=5';

    return NextResponse.json(filtered, {
      headers: {
        'Cache-Control': cacheHeader,
      },
    });
  } catch (error: any) {
    console.error('Error fetching packages, falling back to defaults:', error);
    return NextResponse.json(DEFAULT_PACKAGES, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`post_package_${ip}`, { windowMs: 60000, max: 30 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment.' },
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

    const validation = validatePackagePayload(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    const newPackage = await addPackage(validation.data);

    // Non-blocking background revalidation so client gets instant sub-50ms response
    Promise.resolve().then(() => {
      try {
        revalidatePath('/', 'page');
        revalidatePath('/', 'layout');
        revalidatePath('/');
        revalidatePath('/packages');
        revalidatePath(`/packages/${newPackage.id}`);
        revalidatePath(`/destinations/${newPackage.destination.toLowerCase().replace(/\s+/g, '-')}`);
      } catch (e) {
        console.warn('Revalidation warning:', e);
      }
    });

    return NextResponse.json(newPackage, { status: 201 });
  } catch (error: any) {
    console.error('Error adding package:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
