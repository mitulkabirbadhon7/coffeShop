"use server";

import { createClient } from "@/lib/supabase/client";
import { contactSchema, type ContactInput } from "@/lib/validation/contact.schema";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";

export interface ContactActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function sendContactMessageAction(
  rawData: ContactInput | FormData
): Promise<ContactActionResult> {
  const data =
    rawData instanceof FormData
      ? {
          name: (rawData.get("name") as string) || "",
          email: (rawData.get("email") as string) || "",
          subject: (rawData.get("subject") as string) || "",
          message: (rawData.get("message") as string) || "",
          hp_field: (rawData.get("hp_field") as string) || "",
        }
      : rawData;

  const result = contactSchema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.errors[0]?.message || "Invalid contact input.";
    return { success: false, error: firstError };
  }

  // Honeypot spam bot check
  if (result.data.hp_field && result.data.hp_field.length > 0) {
    // Silently return success to waste the bot's resources
    return {
      success: true,
      message: "Thank you for reaching out! We will review your message shortly.",
    };
  }

  // Rate limit public contact messages
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
      error: "Too many messages sent. Please wait a few minutes before sending another inquiry.",
    };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: result.data.name.trim(),
      email: result.data.email.trim().toLowerCase(),
      subject: result.data.subject.trim(),
      message: result.data.message.trim(),
      status: "UNREAD",
    });

    if (error) {
      console.error("Database error saving contact message:", error);
      return {
        success: false,
        error: "Unable to deliver your message at this time. Please try again later.",
      };
    }

    return {
      success: true,
      message:
        "Thank you for contacting Chocobliss! Your message has been received by our roastery staff.",
    };
  } catch (err) {
    console.error("Unexpected error in sendContactMessageAction:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again shortly.",
    };
  }
}
