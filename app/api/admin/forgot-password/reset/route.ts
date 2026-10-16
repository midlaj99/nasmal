import { NextResponse } from 'next/server';
import { verifySignedToken, hashPassword, getOrCreateAdmin } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`pwd_reset_${ip}`, { windowMs: 60000, max: 5 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many reset attempts. Please wait.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Malformed request payload' }, { status: 400 });
    }

    const resetToken = String(body.resetToken || '').trim();
    const newPassword = String(body.newPassword || '').trim();

    if (!resetToken) {
      return NextResponse.json({ error: 'Reset token is required' }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Verify cryptographic token signature
    const payload = verifySignedToken(resetToken);
    if (!payload || !payload.startsWith('reset_')) {
      return NextResponse.json({ error: 'Invalid or tampered reset token. Please request a new OTP.' }, { status: 401 });
    }

    const parts = payload.split('_');
    const timestamp = parseInt(parts[1], 10);
    // Token valid for 15 minutes max
    if (isNaN(timestamp) || Date.now() - timestamp > 15 * 60 * 1000) {
      return NextResponse.json({ error: 'Reset token has expired. Please request a new OTP.' }, { status: 401 });
    }

    const admin = await getOrCreateAdmin();
    const db = await getDb();

    // Check single-use token protection to prevent replay attacks
    const crypto = await import('crypto');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const alreadyUsed = await db.collection('used_reset_tokens').findOne({ tokenHash });
    if (alreadyUsed) {
      return NextResponse.json(
        { error: 'This reset token has already been used. Please request a new OTP.' },
        { status: 401 }
      );
    }

    // Mark token as used immediately
    await db.collection('used_reset_tokens').insertOne({
      tokenHash,
      usedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });

    // Hash new password using scrypt
    const newPasswordHash = hashPassword(newPassword);

    await db.collection('admins').updateOne(
      { id: admin.id },
      {
        $set: {
          passwordHash: newPasswordHash,
          failedAttempts: 0,
          lockUntil: null,
          updatedAt: new Date().toISOString(),
        }
      }
    );

    // Revoke all existing sessions for total security
    await db.collection('sessions').deleteMany({ adminId: admin.id });

    return NextResponse.json({
      success: true,
      message: 'Admin password has been reset successfully. Please log in with your new password.',
    });
  } catch (error: any) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
