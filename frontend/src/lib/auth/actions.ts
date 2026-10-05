"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  type LoginInput,
  type SignupInput,
  type ResetPasswordInput,
  type UpdatePasswordInput,
} from "@/lib/validation/auth.schema";
import { safeRedirectPath } from "@/lib/auth/guards";
import { env } from "@/lib/env";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

export interface AuthActionResult {
  success?: boolean;
  error?: string;
  message?: string;
  needsConfirmation?: boolean;
}

async function getClientIdentifier(fallback: string): Promise<string> {
  try {
    const { headers } = await import("next/headers");
    const ip = getClientIp(headers());
    return `${ip}:${fallback}`;
  } catch {
    return `127.0.0.1:${fallback}`;
  }
}

function getRequestOrigin(): string {
  try {
    return headers().get("origin") || env.NEXT_PUBLIC_SITE_URL;
  } catch {
    return env.NEXT_PUBLIC_SITE_URL;
  }
}

/**
 * Server action to authenticate a customer via email and password.
 * Employs generic error responses to prevent account enumeration.
 */
export async function signInAction(
  input: LoginInput,
  returnUrl?: string
): Promise<AuthActionResult> {
  const validation = loginSchema.safeParse(input);
  if (!validation.success) {
    return {
      error: validation.error.errors[0]?.message || "Invalid input provided.",
    };
  }

  const { email, password } = validation.data;
  const clientIdentifier = await getClientIdentifier(email.toLowerCase());
  const rl = await checkRateLimit("auth", clientIdentifier);
  if (!rl.success) {
    return {
      error: "Too many sign-in attempts. Please wait 15 minutes before trying again.",
    };
  }
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Return generic error message to prevent user enumeration
    return {
      error: "Invalid email or password. Please verify your credentials and try again.",
    };
  }

  const destination = safeRedirectPath(returnUrl, "/account");
  redirect(destination);
}

/**
 * Server action to register a new customer account.
 */
export async function signUpAction(
  input: SignupInput
): Promise<AuthActionResult> {
  const validation = signupSchema.safeParse(input);
  if (!validation.success) {
    return {
      error: validation.error.errors[0]?.message || "Invalid input provided.",
    };
  }

  const { name, email, password } = validation.data;
  const clientIdentifier = await getClientIdentifier(email.toLowerCase());
  const rl = await checkRateLimit("auth", clientIdentifier);
  if (!rl.success) {
    return {
      error: "Too many registration attempts. Please wait 15 minutes before trying again.",
    };
  }

  const supabase = await createClient();
  const origin = getRequestOrigin();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      emailRedirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) {
    return {
      error: error.message || "Failed to create account. Please try again.",
    };
  }

  const needsConfirmation = !data.session;
  return {
    success: true,
    needsConfirmation,
    message: needsConfirmation
      ? "Account created! Please check your email to verify your address before placing orders."
      : "Account created successfully.",
  };
}

/**
 * Server action to sign out the current user session and revoke cookies.
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Server action to request a password reset email.
 * Always returns a generic success message to prevent user enumeration.
 */
export async function resetPasswordAction(
  input: ResetPasswordInput
): Promise<AuthActionResult> {
  const validation = resetPasswordSchema.safeParse(input);
  if (!validation.success) {
    return {
      error: validation.error.errors[0]?.message || "Invalid email address.",
    };
  }

  const { email } = validation.data;
  const clientIdentifier = await getClientIdentifier(email.toLowerCase());
  const rl = await checkRateLimit("auth", clientIdentifier);
  if (!rl.success) {
    return {
      error: "Too many password reset requests. Please wait 15 minutes before trying again.",
    };
  }

  const supabase = await createClient();
  const origin = getRequestOrigin();

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/callback?next=/update-password`,
  });

  // Always return generic confirmation
  return {
    success: true,
    message:
      "If a registered account matches that email, a password reset link has been dispatched.",
  };
}

/**
 * Server action to update user password when authenticated via reset token.
 */
export async function updatePasswordAction(
  input: UpdatePasswordInput
): Promise<AuthActionResult> {
  const validation = updatePasswordSchema.safeParse(input);
  if (!validation.success) {
    return {
      error: validation.error.errors[0]?.message || "Invalid password provided.",
    };
  }

  const { password } = validation.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return {
      error: error.message || "Failed to update password. Link may have expired.",
    };
  }

  redirect("/account?updated=password");
}
