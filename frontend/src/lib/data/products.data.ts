import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

export type ProductCategory = Database["public"]["Tables"]["product_categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];

/**
 * Fetch all product categories sorted by sort_order.
 */
export async function getCategories(): Promise<ProductCategory[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data || [];
}

/**
 * Fetch available, non-deleted products with optional category filtering.
 */
export async function getProducts(categoryId?: string): Promise<Product[]> {
  const supabase = createClient();
  let query = supabase
    .from("products")
    .select("*")
    .is("deleted_at", null)
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data || [];
}

/**
 * Fetch featured products for the marketing homepage.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .is("deleted_at", null)
    .eq("is_available", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
  return data || [];
}

/**
 * Fetch a single product by its unique slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}
