import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { applySecurityHeaders } from "@/lib/security/headers";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

export async function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";
  const path = request.nextUrl.pathname;

  // Rate limit public API endpoints
  if (path.startsWith("/api/")) {
    const ip = getClientIp(request.headers);
    const rl = await checkRateLimit("api", ip);
    if (!rl.success) {
      const retrySecs = Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000));
      const rateLimitResponse = NextResponse.json(
        { error: "Too many requests. Please slow down.", retryAfter: retrySecs },
        { status: 429 }
      );
      rateLimitResponse.headers.set("Retry-After", String(retrySecs));
      return applySecurityHeaders(rateLimitResponse, isDev);
    }
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Authenticate user with Supabase Auth server (do not trust unverified getSession())
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect Account and Admin areas
  if ((path.startsWith("/account") || path.startsWith("/admin")) && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("returnUrl", path);
    const redirectResponse = NextResponse.redirect(loginUrl);
    return applySecurityHeaders(redirectResponse, isDev);
  }

  // Redirect already logged-in users away from auth pages
  if ((path === "/login" || path === "/signup") && user) {
    const accountUrl = request.nextUrl.clone();
    accountUrl.pathname = "/account";
    const redirectResponse = NextResponse.redirect(accountUrl);
    return applySecurityHeaders(redirectResponse, isDev);
  }

  return applySecurityHeaders(supabaseResponse, isDev);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
