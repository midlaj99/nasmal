import { NextResponse } from 'next/server';
import { getPreferences, addPreference } from '@/lib/db';
import { sanitizeString } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { requireAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`get_prefs_${ip}`, { windowMs: 60000, max: 120 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    const preferences = await getPreferences();
    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`post_prefs_${ip}`, { windowMs: 60000, max: 40 });
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

    const body = await request.json();

    const label = sanitizeString(body.label);
    if (!label) {
      return NextResponse.json({ error: 'Title/Label is required' }, { status: 400 });
    }

    const rawIcon = typeof body.icon === 'string' ? body.icon.trim() : '';
    const icon = rawIcon ? sanitizeString(rawIcon) : '🏷️';

    const newPref = await addPreference({ label, icon });
    return NextResponse.json(newPref, { status: 201 });
  } catch (error) {
    console.error('Error adding preference:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
