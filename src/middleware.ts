import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require an active Supabase session
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/settings",
  "/list-yard",
  "/onboarding",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!isProtected) return NextResponse.next();

  // Read the Supabase session cookie Supabase sets on the browser
  const supabaseCookie = request.cookies.get("sb-access-token")?.value
    || request.cookies.getAll().find(c => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"))?.value;

  if (!supabaseCookie) {
    // No session found — redirect to login, preserving the intended destination
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/list-yard",
    "/onboarding/:path*",
  ],
};
