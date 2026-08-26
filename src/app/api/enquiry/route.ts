import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const ENQUIRY_COOKIE_NAME = "oryxen_enquiry_access";

function isValidRedirect(url: string | null): string {
    if (!url) return "/";
    if (url.startsWith("/") && !url.startsWith("//") && !url.includes("://") && !url.startsWith("/\\")) {
        if (url === "/enquiry" || url.startsWith("/enquiry?")) {
            return "/";
        }
        return url;
    }
    return "/";
}

function getSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key && url !== "https://placeholder.supabase.co") {
        return createClient(url, key);
    }
    return null;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, property, message, redirect } = body;

        // Server-side validation
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return NextResponse.json(
                { error: "Please enter your full name (minimum 2 characters)." },
                { status: 400 }
            );
        }

        if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return NextResponse.json(
                { error: "Please enter a valid email address." },
                { status: 400 }
            );
        }

        if (!phone || typeof phone !== "string" || phone.trim().length < 7) {
            return NextResponse.json(
                { error: "Please enter a valid phone number." },
                { status: 400 }
            );
        }

        if (!message || typeof message !== "string" || message.trim().length < 5) {
            return NextResponse.json(
                { error: "Please provide a brief message or requirement (minimum 5 characters)." },
                { status: 400 }
            );
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.trim();
        const cleanProperty = (property && typeof property === "string" ? property.trim() : "General Property/Project Enquiry");
        const cleanMessage = message.trim();

        // 1. Submit to Formspree
        let formspreeSuccess = false;
        try {
            const formspreeRes = await fetch("https://formspree.io/f/mandwdda", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    type: "Property/Project Enquiry",
                    propertyOrProject: cleanProperty,
                    name: cleanName,
                    email: cleanEmail,
                    phone: cleanPhone,
                    message: cleanMessage,
                    source: "Enquiry Gate"
                })
            });
            if (formspreeRes.ok) {
                formspreeSuccess = true;
            } else {
                console.warn("Formspree response not ok:", formspreeRes.status);
            }
        } catch (err) {
            console.error("Formspree forward error:", err);
        }

        // 2. Save submission to Supabase (if configured)
        try {
            const supabase = getSupabaseClient();
            if (supabase) {
                await supabase.from("form_submissions").insert({
                    type: `Enquiry Gate: ${cleanProperty}`,
                    name: cleanName,
                    email: cleanEmail,
                    company: cleanPhone,
                    message: `[Phone: ${cleanPhone}] [Property/Project: ${cleanProperty}] ${cleanMessage}`,
                    is_read: false
                });
            }
        } catch (err) {
            console.error("Supabase insert error:", err);
        }

        // 3. Send confirmation email via Resend (if API key present)
        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey) {
            try {
                const resend = new Resend(resendKey);
                const fromEmail = process.env.RESEND_FROM_EMAIL || "ORYXEN <onboarding@resend.dev>";
                await resend.emails.send({
                    from: fromEmail,
                    to: cleanEmail,
                    subject: "Your enquiry has been received - ORYXEN",
                    html: `
                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #333;">
                          <h2 style="color: #000; margin-bottom: 16px;">Enquiry Received</h2>
                          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Hi ${cleanName},</p>
                          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Thank you for your interest in <strong>${cleanProperty}</strong>. We have received your details and our team will review your requirements.</p>
                          <div style="background-color: #f9f9f9; padding: 16px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #eee;">
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;"><strong>Property / Project:</strong> ${cleanProperty}</p>
                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;"><strong>Phone:</strong> ${cleanPhone}</p>
                            <p style="margin: 0; font-size: 14px; color: #666;"><strong>Message:</strong> ${cleanMessage}</p>
                          </div>
                          <p style="font-size: 14px; color: #777;">You now have full access to browse the ORYXEN website.</p>
                          <p style="font-size: 16px; font-weight: 600; color: #000; margin-top: 32px;">ORYXEN</p>
                        </div>
                    `
                });
            } catch (err) {
                console.error("Resend confirmation email error:", err);
            }
        }

        // Generate secure access token
        const tokenPayload = {
            email: cleanEmail,
            name: cleanName,
            time: Date.now(),
            nonce: crypto.randomBytes(16).toString("hex")
        };
        const token = Buffer.from(JSON.stringify(tokenPayload)).toString("base64url");

        const targetRedirect = isValidRedirect(redirect);

        const response = NextResponse.json({
            success: true,
            message: "Thank you. Your enquiry has been submitted.",
            redirect: targetRedirect
        });

        // Set access cookie: 30 days duration, HttpOnly, secure in production
        response.cookies.set(ENQUIRY_COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });

        return response;
    } catch (error) {
        console.error("Enquiry submission API error:", error);
        return NextResponse.json(
            { error: "Something went wrong while submitting your enquiry. Please try again." },
            { status: 500 }
        );
    }
}
