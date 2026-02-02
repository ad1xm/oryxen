"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const company = formData.get("company") as string;
    const description = formData.get("description") as string;

    if (!name || !email || !description) {
        return { error: "Missing required fields" };
    }

    try {
        // 1. Send notification to Team
        await resend.emails.send({
            from: "Oryxen Contact <onboarding@resend.dev>", // specific sender signature or default
            to: "hello@oryxen.tech",
            subject: `New Inquiry from ${name}`,
            text: `
        Name: ${name}
        Email: ${email}
        Company: ${company}
        
        Project Description:
        ${description}
      `,
        });

        // 2. Send confirmation to User
        await resend.emails.send({
            from: "Aditya from Oryxen <onboarding@resend.dev>",
            to: email,
            subject: "Message received",
            text: `Hi there,

I’m Aditya, the founder of ORYXEN.

Thanks for reaching out. I’ve received your message and will personally review it.
If your project aligns with what we’re building here, you can expect a response within 72 hours.

Looking forward to learning more about what you’re working on.

— Aditya
ORYXEN`
        });

        return { success: true };
    } catch (error) {
        console.error("Email error:", error);
        return { error: "Failed to send email" };
    }
}
