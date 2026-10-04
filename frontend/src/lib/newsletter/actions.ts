"use server";

import { createClient } from "@/lib/supabase/client";
import { newsletterSchema } from "@/lib/validation/newsletter.schema";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

export interface NewsletterActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function subscribeNewsletterAction(
  formData: FormData | { email: string; hp_field?: string }
): Promise<NewsletterActionResult> {
  const rawData =
    formData instanceof FormData
      ? {
          email: formData.get("email") as string,
          hp_field: (formData.get("hp_field") as string) || "",
        }
      : formData;

  const result = newsletterSchema.safeParse(rawData);
  if (!result.success) {
    const errorMsg = result.error.errors[0]?.message || "Invalid email address";
    return { success: false, error: errorMsg };
  }

  // Honeypot trap: if filled by a spam bot, silently simulate success
  if (result.data.hp_field && result.data.hp_field.length > 0) {
    return {
      success: true,
      message: "Thank you for joining our private roastery dispatch!",
    };
  }

  // Rate limit public newsletter subscriptions
  let clientIp = "127.0.0.1";
  try {
    const { headers } = await import("next/headers");
    clientIp = getClientIp(headers());
  } catch {
    // Test environment fallback
  }

  const rl = await checkRateLimit("publicMutation", clientIp);
  if (!rl.success) {
    return {
      success: false,
      error: "Too many subscription attempts. Please try again in a few minutes.",
    };
  }

  const email = result.data.email.toLowerCase();

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (error) {
      // Postgres unique constraint violation code
      if (error.code === "23505") {
        return {
          success: true,
          message: "You're already subscribed to our roastery dispatch!",
        };
      }
      console.error("Newsletter subscription error:", error);
      return {
        success: false,
        error: "Unable to process subscription right now. Please try again later.",
      };
    }

    return {
      success: true,
      message: "Welcome to the Chocobliss Roaster Dispatch! Check your inbox soon.",
    };
  } catch (err) {
    console.error("Newsletter subscription unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
