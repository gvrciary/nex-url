import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { ROUTES } from "./constants/route";
import { handleRedirect } from "./server/middleware/redirect";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameWithoutSlash = pathname.slice(1);

  if (
    pathnameWithoutSlash.toLowerCase() === ROUTES.DASHBOARD.toLowerCase() ||
    pathnameWithoutSlash.toLowerCase() === ROUTES.SETTINGS.toLowerCase()
  ) {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (
    pathname.startsWith("/") &&
    pathname.length > 1 &&
    pathnameWithoutSlash.toLowerCase() !== ROUTES.NOT_FOUND.toLowerCase()
  ) {
    const alias = pathname.slice(1);
    return handleRedirect(request, alias);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/settings",
    "/((?!api/|_next/|images/|docs/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
