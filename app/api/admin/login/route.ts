import { NextResponse } from 'next/server';
import { getOrCreateAdmin, verifyPassword, createAdminSession } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sanitizeString } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Rate limit: Max 10 attempts per minute per IP
    const rateLimit = checkRateLimit(`login_ip_${ip}`, { windowMs: 60000, max: 10 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait before trying again.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Malformed request payload' }, { status: 400 });
    }

    const username = sanitizeString(body.username || '').toLowerCase();
    const password = String(body.password || '');

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const admin = await getOrCreateAdmin();
    const db = await getDb();

    // Check account lockout
    if (admin.lockUntil && new Date(admin.lockUntil).getTime() > Date.now()) {
      const remainingMinutes = Math.ceil((new Date(admin.lockUntil).getTime() - Date.now()) / (60 * 1000));
      return NextResponse.json(
        { error: `Account temporarily locked due to consecutive failed attempts. Please try again in ${remainingMinutes} minute(s).` },
        { status: 423 }
      );
    }

    // Verify username or email match
    const isIdentifierMatch = admin.username.toLowerCase() === username || admin.email.toLowerCase() === username;
    const isPasswordMatch = isIdentifierMatch && verifyPassword(password, admin.passwordHash);

    if (!isPasswordMatch) {
      const newFailedAttempts = (admin.failedAttempts || 0) + 1;
      const updates: any = { failedAttempts: newFailedAttempts };

      // Lock account after 5 consecutive failed attempts
      if (newFailedAttempts >= 5) {
        updates.lockUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes lockout
      }

      await db.collection('admins').updateOne({ id: admin.id }, { $set: updates });

      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Login successful: Reset failed attempts & update last login
    await db.collection('admins').updateOne(
      { id: admin.id },
      {
        $set: {
          failedAttempts: 0,
          lockUntil: null,
          lastLoginAt: new Date().toISOString(),
        }
      }
    );

    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const signedSessionToken = await createAdminSession(admin, userAgent, ip);

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        username: admin.username,
        email: admin.email,
      }
    });

    // Set secure HTTP-Only cookie
    response.cookies.set('nasmal_admin_session', signedSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
