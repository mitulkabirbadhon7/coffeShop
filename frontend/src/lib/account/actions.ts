"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import {
  profileSchema,
  addressSchema,
  type ProfileInput,
  type AddressInput,
} from "@/lib/validation/account.schema";

export interface AccountActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Update authenticated user's display name in profiles table.
 */
export async function updateProfileAction(
  rawData: ProfileInput | FormData
): Promise<AccountActionResult> {
  const user = await requireUser();

  const data =
    rawData instanceof FormData
      ? {
          display_name: (rawData.get("display_name") as string) || "",
        }
      : rawData;

  const result = profileSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors[0]?.message || "Invalid profile data.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: result.data.display_name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: "Unable to update profile. Please try again." };
    }

    try {
      revalidatePath("/account");
    } catch {
      // Ignore when invoked outside Next.js request context (e.g. unit tests)
    }
    return { success: true, message: "Profile successfully updated." };
  } catch (err) {
    console.error("Unexpected error updating profile:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Add a new pickup address for the authenticated user.
 */
export async function createAddressAction(
  rawData: AddressInput | FormData
): Promise<AccountActionResult> {
  const user = await requireUser();

  const data =
    rawData instanceof FormData
      ? {
          label: (rawData.get("label") as string) || "Home",
          recipient_name: (rawData.get("recipient_name") as string) || "",
          phone: (rawData.get("phone") as string) || "",
          line1: (rawData.get("line1") as string) || "",
          line2: (rawData.get("line2") as string) || "",
          city: (rawData.get("city") as string) || "Dhaka",
          postal_code: (rawData.get("postal_code") as string) || "",
          country: (rawData.get("country") as string) || "Bangladesh",
          is_default: rawData.get("is_default") === "true" || rawData.get("is_default") === "on",
        }
      : rawData;

  const result = addressSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors[0]?.message || "Invalid address data.",
    };
  }

  try {
    const supabase = await createClient();

    // If marked default, unset existing defaults first
    if (result.data.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { error } = await supabase.from("addresses").insert({
      user_id: user.id,
      label: result.data.label,
      recipient_name: result.data.recipient_name,
      phone: result.data.phone,
      line1: result.data.line1,
      line2: result.data.line2 || null,
      city: result.data.city,
      postal_code: result.data.postal_code,
      country: result.data.country,
      is_default: result.data.is_default,
    });

    if (error) {
      console.error("Error inserting address:", error);
      return { success: false, error: "Failed to save address." };
    }

    try {
      revalidatePath("/account/addresses");
    } catch {
      // Ignore in unit tests
    }
    return { success: true, message: "Address added successfully." };
  } catch (err) {
    console.error("Unexpected error saving address:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Delete a user address (guarded by user_id to prevent IDOR).
 */
export async function deleteAddressAction(
  addressId: string
): Promise<AccountActionResult> {
  const user = await requireUser();

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", addressId)
      .eq("user_id", user.id); // Strict ownership guard (anti-IDOR)

    if (error) {
      console.error("Error deleting address:", error);
      return { success: false, error: "Unable to delete address." };
    }

    try {
      revalidatePath("/account/addresses");
    } catch {
      // Ignore in unit tests
    }
    return { success: true, message: "Address removed." };
  } catch (err) {
    console.error("Unexpected error deleting address:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Set an address as the default address for the user.
 */
export async function setDefaultAddressAction(
  addressId: string
): Promise<AccountActionResult> {
  const user = await requireUser();

  try {
    const supabase = await createClient();

    // 1. Reset all to false
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);

    // 2. Set target address to true (guarded by user_id)
    const { error } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", addressId)
      .eq("user_id", user.id); // Strict ownership guard

    if (error) {
      console.error("Error setting default address:", error);
      return { success: false, error: "Unable to update default address." };
    }

    try {
      revalidatePath("/account/addresses");
    } catch {
      // Ignore in unit tests
    }
    return { success: true, message: "Default address updated." };
  } catch (err) {
    console.error("Unexpected error setting default address:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
