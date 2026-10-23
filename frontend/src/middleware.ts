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

  const allCookies = request.cookies.getAll();
  const hasDemoCookie = allCookies.some((c) => c.name === "chocobliss_demo_session");
  const hasSupabaseCookie = allCookies.some(
    (c) => c.name.startsWith("sb-") && (c.name.includes("-auth-token") || c.name.includes("auth-token"))
  );
  const hasAnyAuth = hasDemoCookie || hasSupabaseCookie;

  // 1. Auth routes (/login, /signup)
  if (path === "/login" || path === "/signup") {
    // If not authenticated, instantly render login/signup page in <5ms without remote network calls
    if (!hasAnyAuth) {
      return applySecurityHeaders(supabaseResponse, isDev);
    }
    // If demo session active, redirect directly to /account
    if (hasDemoCookie) {
      const accountUrl = request.nextUrl.clone();
      accountUrl.pathname = "/account";
      return applySecurityHeaders(NextResponse.redirect(accountUrl), isDev);
    }
  }

  // 2. Protected routes (/account, /admin)
  if (path.startsWith("/account") || path.startsWith("/admin")) {
    // If completely unauthenticated, instantly redirect to login
    if (!hasAnyAuth) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("returnUrl", path);
      return applySecurityHeaders(NextResponse.redirect(loginUrl), isDev);
    }
    // If demo session active, allow through to page
    if (hasDemoCookie) {
      return applySecurityHeaders(supabaseResponse, isDev);
    }
  }

  // 3. For public routes or when no Supabase cookie exists, bypass remote check
  if (!hasSupabaseCookie) {
    return applySecurityHeaders(supabaseResponse, isDev);
  }

  // 4. Validate Supabase cookie with strict 1000ms timeout guard
  try {
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

    const authTimeout = new Promise<{ data: { user: null } }>((resolve) =>
      setTimeout(() => resolve({ data: { user: null } }), 1000)
    );

    const { data } = await Promise.race([supabase.auth.getUser(), authTimeout]);
    const user = data?.user || null;

    if ((path.startsWith("/account") || path.startsWith("/admin")) && !user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("returnUrl", path);
      return applySecurityHeaders(NextResponse.redirect(loginUrl), isDev);
    }

    if ((path === "/login" || path === "/signup") && user) {
      const accountUrl = request.nextUrl.clone();
      accountUrl.pathname = "/account";
      return applySecurityHeaders(NextResponse.redirect(accountUrl), isDev);
    }
  } catch {
    // Supabase unreachable or network failure
  }

  return applySecurityHeaders(supabaseResponse, isDev);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
