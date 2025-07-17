import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { handleRedirect } from "./server/middleware/redirect";
import { ROUTES } from "./constants/route";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === "/dashboard" || pathname === "/settings") {
        const sessionCookie = getSessionCookie(request);

        if (!sessionCookie) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        return NextResponse.next();
    }

    if (pathname.startsWith("/") && pathname.length > 1 && !pathname.startsWith(ROUTES.NOT_FOUND)) {
        const alias = pathname.slice(1);
        return handleRedirect(request, alias);
    }

    return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard", "/settings", "/((?!api/|_next/|images/|docs/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)"],
};