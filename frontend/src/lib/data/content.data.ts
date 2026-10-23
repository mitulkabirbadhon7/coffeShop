import { createClient } from "@/lib/supabase/client";
import { sanitizeJsonContent, sanitizeText } from "@/lib/sanitizer";
import type { Database } from "@/types/database.types";
import { FALLBACK_TESTIMONIALS } from "./fallback.data";

export type SiteContent = Database["public"]["Tables"]["site_content"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

const DEFAULT_CONTENT: Record<string, Record<string, unknown>> = {
  hero_section: {
    title: "Where Artisanal Roast Meets Pure Chocolate Indulgence",
    subtitle: "Immerse yourself in small-batch specialty coffee and handcrafted cocoa confections, meticulously brewed in the heart of Dhaka.",
    cta_text: "Explore Menu & Order",
    cta_link: "/products",
    secondary_cta_text: "Our Story",
    secondary_cta_link: "/about",
  },
  store_info: {
    hours: "Daily 8:00 AM – 10:00 PM",
    address: "House 14, Road 7, Banani, Dhaka, Bangladesh",
    phone: "+880 1700 000000",
    email: "contact@chocoblisscoffee.com",
  },
  story_section: {
    heading: "Coffee as an Art Form, Not a Rushed Commodity",
    subheading: "Our Roastery Philosophy",
    body: "Founded on the belief that extraordinary coffee begins long before the water touches the grounds. We partner with smallholder cooperatives across high-altitude terroirs to bring micro-lot green beans to our Dhaka roastery.",
  },
};

/**
 * Fetch a published site content item by key (e.g. 'hero_section', 'store_info', 'story_section').
 * Public consumers only receive rows where published = true, with sanitized content.
 */
export async function getPublishedContent(contentKey: string): Promise<Record<string, unknown> | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("content_key", contentKey)
      .eq("published", true)
      .single();

    if (error || !data || !data.content) {
      return DEFAULT_CONTENT[contentKey] || null;
    }

    // Recursively sanitize all strings to neutralize any XSS payloads
    const sanitized = sanitizeJsonContent(data.content);
    return (sanitized as Record<string, unknown>) || DEFAULT_CONTENT[contentKey] || null;
  } catch {
    return DEFAULT_CONTENT[contentKey] || null;
  }
}

/**
 * Fetch all published testimonials ordered by sort_order.
 * Returns only published records with sanitized strings.
 */
export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_TESTIMONIALS;
    }

    // Defense-in-depth sanitization for public display
    return data.map((t) => ({
      ...t,
      name: sanitizeText(t.name, 100),
      quote: sanitizeText(t.quote, 500),
      role_or_context: t.role_or_context ? sanitizeText(t.role_or_context, 100) : null,
    }));
  } catch {
    return FALLBACK_TESTIMONIALS;
  }
}
