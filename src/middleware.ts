import { NextRequest, NextResponse } from "next/server";

// Secret for signing/verifying the enquiry access token
const ENQUIRY_COOKIE_NAME = "oryxen_enquiry_access";

function isValidRedirect(url: string | null): string {
    if (!url) return "/";
    // Prevent open redirect: must start with single / and not //
    if (url.startsWith("/") && !url.startsWith("//") && !url.includes("://") && !url.startsWith("/\\")) {
        // Disallow redirecting back to /enquiry
        if (url === "/enquiry" || url.startsWith("/enquiry?")) {
            return "/";
        }
        return url;
    }
    return "/";
}

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    // 1. Always allow technical, static, internal, admin and API routes
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/admin") ||
        pathname === "/robots.txt" ||
        pathname === "/sitemap.xml" ||
        pathname === "/site.webmanifest" ||
        pathname.endsWith(".ico") ||
        pathname.endsWith(".png") ||
        pathname.endsWith(".jpg") ||
        pathname.endsWith(".jpeg") ||
        pathname.endsWith(".webp") ||
        pathname.endsWith(".svg") ||
        pathname.endsWith(".mp4") ||
        pathname.endsWith(".woff") ||
        pathname.endsWith(".woff2") ||
        pathname.endsWith(".ttf")
    ) {
        return NextResponse.next();
    }

    const hasAccessCookie = request.cookies.has(ENQUIRY_COOKIE_NAME);

    // 2. Handling the /enquiry page itself
    if (pathname === "/enquiry") {
        if (hasAccessCookie) {
            const redirectParam = request.nextUrl.searchParams.get("redirect");
            const target = isValidRedirect(redirectParam);
            return NextResponse.redirect(new URL(target, request.url));
        }
        return NextResponse.next();
    }

    // 3. Protected Public Routes
    if (!hasAccessCookie) {
        // Construct the redirect URL to preserve the original target
        const currentPath = pathname + (search || "");
        const enquiryUrl = new URL("/enquiry", request.url);
        if (currentPath && currentPath !== "/") {
            enquiryUrl.searchParams.set("redirect", currentPath);
        }
        return NextResponse.redirect(enquiryUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
