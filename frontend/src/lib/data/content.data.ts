import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

export type SiteContent = Database["public"]["Tables"]["site_content"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

/**
 * Fetch a published site content item by key (e.g. 'hero_section', 'store_info').
 */
export async function getPublishedContent(contentKey: string): Promise<Record<string, unknown> | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("content_key", contentKey)
    .eq("published", true)
    .single();

  if (error || !data) {
    return null;
  }
  return (data.content as Record<string, unknown>) || null;
}

/**
 * Fetch all published testimonials ordered by sort_order.
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
  return data || [];
}
