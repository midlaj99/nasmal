import { NextResponse } from 'next/server';
import { verifyOtpHash, signToken, getOrCreateAdmin } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Rate limit: Max 5 verify attempts per minute per IP
    const rateLimit = checkRateLimit(`otp_verify_${ip}`, { windowMs: 60000, max: 5 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please wait.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Malformed request payload' }, { status: 400 });
    }

    const otp = String(body.otp || '').trim();
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: 'Please enter a valid 6-digit numeric OTP' }, { status: 400 });
    }

    const admin = await getOrCreateAdmin();
    const recipientEmail = admin.email || 'nasmaltourism@gmail.com';

    const db = await getDb();
    const otpsCollection = db.collection('otps');

    // Find the latest active OTP for this email
    const latestOtp = await otpsCollection.findOne(
      { email: recipientEmail, used: false },
      { sort: { createdAt: -1 } }
    );

    if (!latestOtp) {
      return NextResponse.json({ error: 'No active OTP found. Please request a new code.' }, { status: 400 });
    }

    // Check expiration
    if (new Date(latestOtp.expiresAt).getTime() < Date.now()) {
      await otpsCollection.updateOne({ id: latestOtp.id }, { $set: { used: true } });
      return NextResponse.json({ error: 'OTP has expired. Please request a new code.' }, { status: 400 });
    }

    // Check brute force attempts on this OTP
    if ((latestOtp.attempts || 0) >= 3) {
      await otpsCollection.updateOne({ id: latestOtp.id }, { $set: { used: true } });
      return NextResponse.json({ error: 'Too many incorrect attempts on this code. It has been invalidated for security. Please request a new OTP.' }, { status: 400 });
    }

    // Verify OTP hash with timing safe comparison
    const isMatch = verifyOtpHash(otp, latestOtp.codeHash);

    if (!isMatch) {
      await otpsCollection.updateOne({ id: latestOtp.id }, { $inc: { attempts: 1 } });
      const remaining = 3 - ((latestOtp.attempts || 0) + 1);
      return NextResponse.json({
        error: `Invalid OTP code. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : 'Code has been invalidated.'}`
      }, { status: 400 });
    }

    // OTP matched: Mark as used immediately to prevent replay attacks
    await otpsCollection.updateOne({ id: latestOtp.id }, { $set: { used: true } });

    // Issue signed reset token valid for 15 minutes
    const tokenPayload = `reset_${Date.now()}_${admin.id}`;
    const resetToken = signToken(tokenPayload);

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      resetToken,
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
