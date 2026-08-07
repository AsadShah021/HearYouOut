import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/session";

/**
 * Routes that require an account. The landing page and the legal pages stay
 * public; messaging and scheduling are the product, so they sit behind sign-up.
 */
const PROTECTED = ["/dashboard", "/listener", "/chat", "/book"];

/** Signed-in users have no reason to see these. */
const AUTH_ONLY = ["/sign-in", "/sign-up", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = request.cookies.has(SESSION_COOKIE);

  if (!signedIn && PROTECTED.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    // Send them where they were headed once they're in.
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  if (signedIn && AUTH_ONLY.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip static assets, image optimisation and metadata files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|videos|.*\\.(?:svg|png|jpg|jpeg|webp|avif|mp4|vtt|ico|txt|xml)$).*)"],
};
