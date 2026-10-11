import { NextResponse } from 'next/server';
import { generateOtpCode, hashOtp, getOrCreateAdmin } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { sendMail } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Rate limit: Max 2 OTP requests per 2 minutes per IP
    const rateLimit = checkRateLimit(`otp_send_${ip}`, { windowMs: 120000, max: 2 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Please wait before requesting another OTP.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    const admin = await getOrCreateAdmin();
    const recipientEmail = admin.email || 'nasmaltourism@gmail.com';

    const db = await getDb();
    const otpsCollection = db.collection('otps');

    // Invalidate any existing unused OTPs for this email
    await otpsCollection.updateMany(
      { email: recipientEmail, used: false },
      { $set: { used: true } }
    );

    const otpCode = generateOtpCode();
    const codeHash = hashOtp(otpCode);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    const otpRecord = {
      id: `otp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      email: recipientEmail,
      codeHash,
      attempts: 0,
      expiresAt,
      used: false,
      createdAt: new Date().toISOString(),
    };

    await otpsCollection.insertOne(otpRecord as any);

    // Send formatted HTML OTP Email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: #0f172a; padding: 24px; text-align: center; }
          .header h1 { color: #ffffff; font-size: 20px; margin: 0; letter-spacing: 0.5px; font-weight: 700; }
          .body { padding: 32px 28px; color: #1e293b; }
          .title { font-size: 18px; font-weight: 700; margin-bottom: 12px; color: #0f172a; }
          .text { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
          .otp-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #e00b3e; font-family: monospace; }
          .expiry { font-size: 12px; color: #64748b; margin-top: 8px; font-weight: 500; }
          .security-note { font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; line-height: 1.5; }
          .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛡️ NASMAL TOURISMS</h1>
          </div>
          <div class="body">
            <div class="title">Admin Password Reset Request</div>
            <p class="text">You have requested a secure One-Time Password (OTP) to reset the login password for the <strong>Nasmal Tourisms Admin Portal</strong>.</p>
            <div class="otp-box">
              <div class="otp-code">${otpCode}</div>
              <div class="expiry">Valid for 10 minutes (Single use only)</div>
            </div>
            <p class="text">Enter this code on the admin portal verification page to proceed with resetting your password.</p>
            <div class="security-note">
              <strong>Security Alert:</strong> If you did not initiate this request, someone may be attempting to access your admin account. Do not share this code with anyone.
            </div>
          </div>
          <div class="footer">
            © 2026 Nasmal Tourisms. Highly Protected Admin Infrastructure.
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await sendMail({
        to: recipientEmail,
        subject: `🔐 Your Admin OTP Code: ${otpCode} - Nasmal Tourisms`,
        html: emailHtml,
        text: `Your Nasmal Tourisms Admin OTP code is: ${otpCode}. It expires in 10 minutes.`,
      });
    } catch (mailError: any) {
      console.error('Failed to send email via SMTP:', mailError);
      return NextResponse.json(
        { error: `Failed to deliver email: ${mailError?.message || 'SMTP connection error'}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${recipientEmail}`,
      email: recipientEmail,
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
