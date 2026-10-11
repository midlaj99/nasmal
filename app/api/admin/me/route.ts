import { NextResponse } from 'next/server';
import { verifyAdminSessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/nasmal_admin_session=([^;]+)/);
    const sessionToken = match ? match[1] : null;

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false });
    }

    const session = await verifyAdminSessionToken(sessionToken);

    if (!session) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        username: session.username,
        email: session.email,
      }
    });
  } catch (error: any) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
