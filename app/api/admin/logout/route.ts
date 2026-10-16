import { NextResponse } from 'next/server';
import { destroyAdminSession } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`admin_logout_${ip}`, { windowMs: 60000, max: 30 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/nasmal_admin_session=([^;]+)/);
    const sessionToken = match ? match[1] : null;

    if (sessionToken) {
      await destroyAdminSession(sessionToken);
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // Clear session cookie securely
    response.cookies.set('nasmal_admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    console.error('Admin logout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
