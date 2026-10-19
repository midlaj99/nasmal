import { NextResponse } from 'next/server';
import { createEnquiry } from '@/lib/db';
import { validateContactPayload } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sendMail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    // Rate limit contact submissions to 10 per minute per IP
    const rateLimit = checkRateLimit(`contact_${ip}`, { windowMs: 60000, max: 10 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before sending another message.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetTime) } }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const validation = validateContactPayload(body);
    if (!validation.isValid || !validation.data) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    const { fullname, phone, email, enquiryType, message } = validation.data;

    const newEnquiry = await createEnquiry({
      fullname,
      phone,
      email,
      enquiryType,
      message,
    });

    // Attempt to send email notification to admin desk (async & fail-safe)
    try {
      const emailSubject = `New [${enquiryType}] Enquiry: ${fullname} - Nasmal Tourisms`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #047857; margin-top: 0;">New Contact Form Enquiry</h2>
          <p style="color: #475569; font-size: 14px;">A new message was submitted through the Nasmal Tourisms contact page.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #1e293b; width: 140px;">Reference ID:</td>
              <td style="padding: 10px 0; color: #047857; font-weight: bold;">${newEnquiry.id}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #1e293b;">Enquiry Type:</td>
              <td style="padding: 10px 0; color: #334155;"><strong>${enquiryType}</strong></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #1e293b;">Full Name:</td>
              <td style="padding: 10px 0; color: #334155;">${fullname}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #1e293b;">Phone:</td>
              <td style="padding: 10px 0; color: #334155;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #1e293b;">Email:</td>
              <td style="padding: 10px 0; color: #334155;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #1e293b;">Date:</td>
              <td style="padding: 10px 0; color: #334155;">${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' })} (Dubai Time)</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 6px; border-left: 4px solid #047857;">
            <p style="margin: 0; font-weight: bold; color: #1e293b; margin-bottom: 8px;">Message:</p>
            <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
            Nasmal Tourisms LLC &bull; Bur Dubai, Dubai, UAE &bull; <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}">Quick WhatsApp Reply</a>
          </div>
        </div>
      `;

      sendMail({
        to: process.env.ADMIN_EMAIL || 'nasmaltourism@gmail.com',
        subject: emailSubject,
        html: emailHtml,
        text: `New ${enquiryType} Enquiry from ${fullname} (${phone}, ${email}):\n\n${message}`,
      }).catch(err => {
        console.error('Non-blocking: Failed to send contact email notification:', err);
      });
    } catch (mailErr) {
      console.warn('Mail notification trigger warning:', mailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been received successfully! Our travel specialist will reach out shortly.',
        enquiry: {
          id: newEnquiry.id,
          fullname: newEnquiry.fullname,
          enquiryType: newEnquiry.enquiryType,
          createdAt: newEnquiry.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error in contact API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
