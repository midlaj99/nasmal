import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await sendMail({
      to: 'nasmaltourism@gmail.com',
      subject: 'Nasmal Tourism - Security Test Verification',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2>Security Verification Successful</h2>
          <p>This is a verification email confirming that Google App Password and SMTP connection are working properly.</p>
          <p>Time: ${new Date().toISOString()}</p>
        </div>
      `,
    });
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || String(err), stack: err?.stack }, { status: 500 });
  }
}
