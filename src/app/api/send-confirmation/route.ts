import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            console.error('RESEND_API_KEY is missing');
            return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }

        const resend = new Resend(apiKey);
        const { email, name, type, project, description } = await request.json();

        if (!email || !name) {
            return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
        }

        const fromEmail = process.env.RESEND_FROM_EMAIL || 'ORYXEN <onboarding@resend.dev>';

        // Define templates
        let subject = 'Your message has been received - ORYXEN';
        let projectSection = project ? `<p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;"><strong>Project Interest:</strong> ${project}</p>` : '';
        let messageSection = description ? `
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 24px;">
            <p style="font-size: 14px; color: #666; margin-bottom: 8px; font-weight: 600;">YOUR MESSAGE:</p>
            <p style="font-size: 15px; line-height: 1.6; color: #333; margin: 0; white-space: pre-wrap;">${description}</p>
        </div>` : '';

        let htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Hi, I'm Aditya, the founder of ORYXEN.</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Your message has been received. I personally go through every inquiry.</p>
          
          ${projectSection}
          ${messageSection}

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">If your idea or requirement aligns with the kind of work we do, you can expect a response within 72 hours.</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 32px;">Thanks for reaching out and sharing your thoughts.</p>
          <p style="font-size: 16px; font-weight: 600; color: #000;">ORYXEN</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="font-size: 12px; color: #666;">This is an automated confirmation email. Please do not reply directly to this email.</p>
        </div>`;

        if (type === 'consultation') {
            subject = 'Consultation Confirmed - ORYXEN';
            htmlContent = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Hi, I’m Aditya from ORYXEN.</p>
              
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Your 30-minute consultation has been successfully scheduled. I’ll review the details you shared before the call so we can use the time effectively.</p>
              
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">During the session, we’ll focus on understanding your idea, requirements, and whether it aligns with the kind of work we take on at ORYXEN.</p>
              
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">If needed, I’ll also share next steps or suggestions after the discussion.</p>
              
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 32px;">Looking forward to the conversation.</p>
              
              <p style="font-size: 16px; font-weight: 600; color: #000;">ORYXEN</p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
              
              <p style="font-size: 12px; color: #666;">This is an automated confirmation email.</p>
            </div>`;
        }

        await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: subject,
            html: htmlContent
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Resend email error:', error);
        return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 });
    }
}
