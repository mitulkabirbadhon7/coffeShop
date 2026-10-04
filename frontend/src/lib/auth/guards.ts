import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Validates a redirect URL to prevent Open Redirect attacks.
 * Only allows relative paths on the same origin (e.g. "/account", "/products").
 * Disallows protocol-relative URLs ("//evil.com") and external protocols.
 */
export function safeRedirectPath(
  urlCandidate: string | null | undefined,
  defaultPath: string = "/account"
): string {
  if (!urlCandidate || typeof urlCandidate !== "string") {
    return defaultPath;
  }

  const trimmed = urlCandidate.trim();

  // Must begin with a single slash, not double slash or backslash
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return defaultPath;
  }

  // Reject URLs containing control characters or embedded schemes
  if (/[\u0000-\u001F\u007F-\u009F]/.test(trimmed)) {
    return defaultPath;
  }

  return trimmed;
}

/**
 * Fetches the currently authenticated user on the server.
 * Uses `supabase.auth.getUser()` to verify the JWT against Supabase Auth.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Requires a verified authenticated user session.
 * Redirects to `/login` if not logged in.
 */
export async function requireUser(returnUrl?: string): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    const destination = returnUrl
      ? `/login?returnUrl=${encodeURIComponent(safeRedirectPath(returnUrl, "/account"))}`
      : "/login";
    redirect(destination);
  }

  return user;
}

/**
 * Requires the authenticated user to hold an 'ADMIN' role in public.profiles.
 * Validates session, confirmed email, and loads role directly from the database (preventing role tampering).
 * Redirects to `/verify-email` if email is unconfirmed, `/account` if customer, or `/login` if unauthenticated.
 */
export async function requireAdmin(): Promise<{ user: User; profile: Profile }> {
  const user = await requireUser("/admin");

  if (!user.email_confirmed_at) {
    redirect("/verify-email");
  }

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile || profile.role !== "ADMIN") {
    redirect("/account");
  }

  return { user, profile };
}

/**
 * Asserts that the user and profile hold administrative privileges.
 * Throws an explicit AuthorizationError if non-admin or unverified (used in Server Actions).
 */
export function assertAdmin(user: User, profile: Profile): void {
  if (!user.email_confirmed_at) {
    throw new Error("Access denied: Administrator email address must be confirmed.");
  }
  if (profile.role !== "ADMIN") {
    throw new Error("Forbidden: This action requires administrator privileges.");
  }
}
