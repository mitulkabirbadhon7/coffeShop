import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const destination = safeRedirectPath(next, "/account");
      return NextResponse.redirect(new URL(destination, requestUrl.origin));
    }
  }

  // Return to login with error parameter if code is invalid or expired
  return NextResponse.redirect(
    new URL("/login?error=auth_verification_failed", requestUrl.origin)
  );
}
