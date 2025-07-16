import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { handleRedirect } from "./server/middleware/redirect";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.startsWith("/not-found")) {
        return NextResponse.next();
    }

    if (pathname === "/dashboard" || pathname === "/settings") {
        const sessionCookie = getSessionCookie(request);

        if (!sessionCookie) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        return NextResponse.next();
    }

    if (pathname.startsWith("/") && pathname.length > 1) {
        const alias = pathname.slice(1);
        return handleRedirect(request, alias);
    }

    return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard", "/settings", "/((?!api/|_next/|images/|docs/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)"],
};