import { NextResponse } from 'next/server';
import { getWishlist, addToWishlist, removeFromWishlist, isWishlisted } from '@/lib/db';
import { sanitizeString } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`wishlist_get_${ip}`, { windowMs: 60000, max: 120 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = sanitizeString(searchParams.get('userId') || '');
    const packageId = sanitizeString(searchParams.get('packageId') || '');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Check specific package status
    if (packageId) {
      const wishlisted = await isWishlisted(userId, packageId);
      return NextResponse.json({ isWishlisted: wishlisted });
    }

    // Return full wishlisted packages list
    const items = await getWishlist(userId);
    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Error in wishlist GET:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`wishlist_post_${ip}`, { windowMs: 60000, max: 60 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    const body = await request.json();
    const userId = sanitizeString(body.userId || '');
    const packageId = sanitizeString(body.packageId || '');

    if (!userId || !packageId) {
      return NextResponse.json({ error: 'userId and packageId are required' }, { status: 400 });
    }

    const success = await addToWishlist(userId, packageId);
    return NextResponse.json({ success, isWishlisted: true });
  } catch (error: any) {
    console.error('Error in wishlist POST:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`wishlist_del_${ip}`, { windowMs: 60000, max: 60 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = sanitizeString(searchParams.get('userId') || '');
    const packageId = sanitizeString(searchParams.get('packageId') || '');

    if (!userId || !packageId) {
      return NextResponse.json({ error: 'userId and packageId are required' }, { status: 400 });
    }

    const success = await removeFromWishlist(userId, packageId);
    return NextResponse.json({ success, isWishlisted: false });
  } catch (error: any) {
    console.error('Error in wishlist DELETE:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
