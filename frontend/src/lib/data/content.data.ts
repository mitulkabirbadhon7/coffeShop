import { createClient } from "@/lib/supabase/client";
import { sanitizeJsonContent, sanitizeText } from "@/lib/sanitizer";
import type { Database } from "@/types/database.types";

export type SiteContent = Database["public"]["Tables"]["site_content"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

/**
 * Fetch a published site content item by key (e.g. 'hero_section', 'store_info', 'story_section').
 * Public consumers only receive rows where published = true, with sanitized content.
 */
export async function getPublishedContent(contentKey: string): Promise<Record<string, unknown> | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("content_key", contentKey)
    .eq("published", true)
    .single();

  if (error || !data || !data.content) {
    return null;
  }

  // Recursively sanitize all strings to neutralize any XSS payloads
  const sanitized = sanitizeJsonContent(data.content);
  return (sanitized as Record<string, unknown>) || null;
}

/**
 * Fetch all published testimonials ordered by sort_order.
 * Returns only published records with sanitized strings.
 */
export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }

  if (!data) return [];

  // Defense-in-depth sanitization for public display
  return data.map((t) => ({
    ...t,
    name: sanitizeText(t.name, 100),
    quote: sanitizeText(t.quote, 500),
    role_or_context: t.role_or_context ? sanitizeText(t.role_or_context, 100) : null,
  }));
}
