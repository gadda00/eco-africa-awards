import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Must match the secret used in @/lib/auth.ts
const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET ?? "dev-only-secret-do-not-use-in-production-please-set-NEXTAUTH_SECRET";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow auth API routes to pass through
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check for session token
  const token = await getToken({
    req,
    secret: AUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/judge", req.url));
    }
  }

  // Judge-only routes
  if (pathname.startsWith("/judge") || pathname.startsWith("/api/judge")) {
    if (token.role !== "JUDGE" && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/judge/:path*", "/api/admin/:path*", "/api/judge/:path*"],
};
