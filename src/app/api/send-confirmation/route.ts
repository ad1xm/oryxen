import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { email, name } = await request.json();

        if (!email || !name) {
            return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
        }

        await resend.emails.send({
            from: 'ORYXEN <onboarding@resend.dev>',
            to: email,
            subject: 'Your message has been received - ORYXEN',
            html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Hi, I'm Aditya, the founder of ORYXEN.</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Your message has been received. I personally go through every inquiry.</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">If your idea or requirement aligns with the kind of work we do, you can expect a response within 72 hours.</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 32px;">Thanks for reaching out and sharing your thoughts.</p>
          
          <p style="font-size: 16px; font-weight: 600; color: #000;">ORYXEN</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          
          <p style="font-size: 12px; color: #666;">This is an automated confirmation email. Please do not reply directly to this email.</p>
        </div>
      `
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Resend email error:', error);
        return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 });
    }
}
