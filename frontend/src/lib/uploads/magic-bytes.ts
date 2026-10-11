export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

export type SupportedImageType = "image/jpeg" | "image/png" | "image/webp";

export interface MagicByteValidationResult {
  valid: boolean;
  mimeType?: SupportedImageType;
  extension?: "jpg" | "png" | "webp";
  error?: string;
}

/**
 * Validates the true binary signature (magic bytes) of an image buffer.
 * Rejects SVGs, disguised executables, HTML, or tampered file extensions.
 */
export function validateImageMagicBytes(buffer: Uint8Array): MagicByteValidationResult {
  if (!buffer || buffer.length < 12) {
    return { valid: false, error: "File buffer is too small to be a valid image." };
  }

  // Check JPEG signature: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, mimeType: "image/jpeg", extension: "jpg" };
  }

  // Check PNG signature: 89 50 4E 47 (0x89 'P' 'N' 'G')
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { valid: true, mimeType: "image/png", extension: "png" };
  }

  // Check WebP signature: RIFF at 0..3 and WEBP at 8..11
  const isRiff =
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46;
  const isWebp =
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50;

  if (isRiff && isWebp) {
    return { valid: true, mimeType: "image/webp", extension: "webp" };
  }

  // Explicit check for dangerous SVGs disguised as images
  const headerText = new TextDecoder("utf-8").decode(buffer.slice(0, 100)).toLowerCase();
  if (
    headerText.includes("<svg") ||
    headerText.includes("<?xml") ||
    headerText.includes("<!doctype html")
  ) {
    return {
      valid: false,
      error: "SVG and XML vector files are forbidden due to script injection risks.",
    };
  }

  return {
    valid: false,
    error: "Unsupported file format. Only true JPEG, PNG, or WebP images are permitted.",
  };
}
