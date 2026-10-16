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

    // Check account lockout status
    if (admin.lockUntil) {
      const lockExpiryTime = new Date(admin.lockUntil).getTime();
      const now = Date.now();

      if (lockExpiryTime > now) {
        const remainingSeconds = Math.max(1, Math.ceil((lockExpiryTime - now) / 1000));
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        const timeMessage = mins > 0
          ? `${mins} minute${mins === 1 ? '' : 's'} and ${secs} second${secs === 1 ? '' : 's'}`
          : `${secs} second${secs === 1 ? '' : 's'}`;

        return NextResponse.json(
          { error: `Account locked due to 3 failed attempts. Please try again in ${timeMessage}.` },
          { status: 423 }
        );
      } else {
        // 5-minute lockout has expired: automatically reset failed attempts
        await db.collection('admins').updateOne(
          { id: admin.id },
          { $set: { failedAttempts: 0, lockUntil: null } }
        );
        admin.failedAttempts = 0;
        admin.lockUntil = null;
      }
    }

    // Verify username or email match
    const isIdentifierMatch = admin.username.toLowerCase() === username || admin.email.toLowerCase() === username;
    const isPasswordMatch = isIdentifierMatch && verifyPassword(password, admin.passwordHash);

    if (!isPasswordMatch) {
      const currentFailures = admin.failedAttempts || 0;
      const newFailedAttempts = currentFailures + 1;
      const updates: any = { failedAttempts: newFailedAttempts };

      // Requirement: Exactly 3 failed attempts locks for 5 minutes
      if (newFailedAttempts >= 3) {
        const lockUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes lockout
        updates.lockUntil = lockUntil;
        updates.failedAttempts = 3;

        await db.collection('admins').updateOne({ id: admin.id }, { $set: updates });

        return NextResponse.json(
          { error: 'Account locked for 5 minutes due to 3 consecutive failed login attempts.' },
          { status: 423 }
        );
      }

      await db.collection('admins').updateOne({ id: admin.id }, { $set: updates });
      const remainingAttempts = 3 - newFailedAttempts;

      return NextResponse.json(
        {
          error: `Invalid credentials. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining before a 5-minute lockout.`
        },
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
