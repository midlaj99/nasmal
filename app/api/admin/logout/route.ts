import { NextResponse } from 'next/server';
import { destroyAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/nasmal_admin_session=([^;]+)/);
    const sessionToken = match ? match[1] : null;

    if (sessionToken) {
      await destroyAdminSession(sessionToken);
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // Clear cookie
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
