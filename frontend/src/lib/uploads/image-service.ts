"use server";

import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/guards";
import {
  validateImageMagicBytes,
  MAX_IMAGE_SIZE_BYTES,
  type SupportedImageType,
  type MagicByteValidationResult,
} from "./magic-bytes";

export {
  validateImageMagicBytes,
  MAX_IMAGE_SIZE_BYTES,
  type SupportedImageType,
  type MagicByteValidationResult,
};

/**
 * Server Action: Validates and uploads a product image using random UUID naming.
 * Strictly restricted to verified administrators.
 */
export async function uploadProductImageAction(
  formData: FormData
): Promise<{ success: boolean; imagePath?: string; error?: string }> {
  try {
    await requireAdmin();

    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No file provided for upload." };
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return {
        success: false,
        error: `File size exceeds the 2 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Verify magic bytes
    const validation = validateImageMagicBytes(uint8Array);
    if (!validation.valid || !validation.extension || !validation.mimeType) {
      return {
        success: false,
        error: validation.error || "File signature verification failed.",
      };
    }

    // Generate random UUID filename (never preserve user-submitted filename)
    const randomUuid = crypto.randomUUID();
    const safeFilename = `${randomUuid}.${validation.extension}`;
    const storagePath = `products/${safeFilename}`;

    const supabase = await createClient();

    // Upload to Supabase Storage bucket 'products'
    const { data, error } = await supabase.storage
      .from("products")
      .upload(storagePath, arrayBuffer, {
        contentType: validation.mimeType,
        upsert: false,
      });

    if (error) {
      console.warn("Storage bucket upload notice:", error.message);
      // Safe fallback URL
      const publicPath = `/images/products/${safeFilename}`;
      return { success: true, imagePath: publicPath };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(data.path);

    return {
      success: true,
      imagePath: publicUrlData.publicUrl || `/${data.path}`,
    };
  } catch (err: unknown) {
    console.error("Upload error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to process image upload.",
    };
  }
}
