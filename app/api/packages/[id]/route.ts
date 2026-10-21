import { NextResponse } from 'next/server';
import { getPackageById, updatePackage, deletePackage } from '@/lib/db';
import { sanitizeString, sanitizeUrl, sanitizeArrayOfStrings } from '@/lib/validation';
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
    const rateLimit = checkRateLimit(`get_pkg_${ip}`, { windowMs: 60000, max: 240 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    const resolvedParams = await params;
    const pkg = await getPackageById(resolvedParams.id);
    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    return NextResponse.json(pkg, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (error: any) {
    console.error('Error fetching package:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`patch_package_${ip}`, { windowMs: 60000, max: 40 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait.' },
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

    // Sanitize updates
    const updates: any = {};
    if (body.title !== undefined) updates.title = sanitizeString(body.title);
    if (body.destination !== undefined) updates.destination = sanitizeString(body.destination);
    if (body.price !== undefined) updates.price = sanitizeString(String(body.price));
    if (body.image !== undefined) updates.image = sanitizeUrl(body.image);
    if (body.rating !== undefined) updates.rating = String(parseFloat(body.rating) || 5.0).slice(0, 4);
    if (body.reviewsCount !== undefined) updates.reviewsCount = parseInt(body.reviewsCount, 10) || 0;
    if (body.description !== undefined) updates.description = sanitizeString(body.description);
    if (body.images !== undefined) updates.images = sanitizeArrayOfStrings(body.images);
    if (body.highlights !== undefined) updates.highlights = sanitizeArrayOfStrings(body.highlights);
    if (body.quickFacts !== undefined) updates.quickFacts = sanitizeArrayOfStrings(body.quickFacts);
    if (body.inclusions !== undefined) updates.inclusions = sanitizeArrayOfStrings(body.inclusions);
    if (body.tags !== undefined) updates.tags = sanitizeArrayOfStrings(body.tags);
    if (body.suitableFor !== undefined) updates.suitableFor = sanitizeArrayOfStrings(body.suitableFor);
    if (body.isPopular !== undefined) updates.isPopular = Boolean(body.isPopular);
    if (body.isBestDeal !== undefined) updates.isBestDeal = Boolean(body.isBestDeal);
    if (body.originalPrice !== undefined) updates.originalPrice = sanitizeString(String(body.originalPrice));
    if (body.childPrice !== undefined) updates.childPrice = sanitizeString(String(body.childPrice));
    if (body.childAgeLimit !== undefined) updates.childAgeLimit = sanitizeString(String(body.childAgeLimit));
    if (body.hasOptions !== undefined) {
      updates.hasOptions = Boolean(body.hasOptions);
    } else if (body.options && Array.isArray(body.options) && body.options.length > 0) {
      updates.hasOptions = true;
    }
    if (body.optionsSectionTitle !== undefined) updates.optionsSectionTitle = sanitizeString(String(body.optionsSectionTitle));
    if (body.options !== undefined && Array.isArray(body.options)) {
      updates.options = body.options.map((opt: any) => ({
        id: sanitizeString(String(opt.id || Date.now() + Math.random().toString(36).substring(2, 7))),
        title: sanitizeString(String(opt.title || '')),
        badge: opt.badge ? sanitizeString(String(opt.badge)) : '',
        inclusions: sanitizeArrayOfStrings(opt.inclusions),
        moreDetails: opt.moreDetails ? sanitizeString(String(opt.moreDetails)) : '',
        price: opt.price ? sanitizeString(String(opt.price)) : '',
        childPrice: opt.childPrice ? sanitizeString(String(opt.childPrice)) : '',
        isAvailable: opt.isAvailable !== false,
      })).filter((opt: any) => opt.title.length > 0);
    }
    if (body.video !== undefined) updates.video = sanitizeString(String(body.video));

    const updated = await updatePackage(resolvedParams.id, updates);

    if (!updated) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    // Non-blocking background revalidation for maximum API responsiveness
    Promise.resolve().then(() => {
      try {
        revalidatePath('/', 'page');
        revalidatePath('/', 'layout');
        revalidatePath('/');
        revalidatePath(`/packages/${updated.id}`);
        revalidatePath('/packages');
      } catch (e) {
        console.warn('Revalidation notice:', e);
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating package:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`del_package_${ip}`, { windowMs: 60000, max: 30 });
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
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }

    await deletePackage(rawId);

    // Non-blocking background revalidation
    Promise.resolve().then(() => {
      try {
        revalidatePath('/');
        revalidatePath(`/packages/${rawId}`);
        revalidatePath('/packages');
        revalidatePath('/activities');
      } catch (e) {
        console.warn('Revalidation notice:', e);
      }
    });

    return NextResponse.json({ success: true, message: 'Package deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting package:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
