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
 * Fetch a single product by its unique slug (excluding soft-deleted products).
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

/**
 * Fetch related products from the same category.
 */
export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit: number = 3
): Promise<Product[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .is("deleted_at", null)
    .eq("is_available", true)
    .eq("category_id", categoryId)
    .neq("id", productId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }
  return data;
}

export interface ProductFilterOptions {
  categoryId?: string;
  search?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "name-asc" | "newest";
  availableOnly?: boolean;
}

/**
 * Pure filter and sort function for client-side and server-side catalog operations.
 */
export function filterProducts(
  products: Product[],
  options: ProductFilterOptions = {}
): Product[] {
  let filtered = [...products];

  // 1. Exclude soft-deleted products
  filtered = filtered.filter((p) => !p.deleted_at);

  // 2. Filter by availability
  if (options.availableOnly) {
    filtered = filtered.filter((p) => p.is_available);
  }

  // 3. Filter by category
  if (options.categoryId && options.categoryId !== "all") {
    filtered = filtered.filter((p) => p.category_id === options.categoryId);
  }

  // 4. Filter by search query (name, description, ingredients)
  if (options.search && options.search.trim()) {
    const query = options.search.toLowerCase().trim();
    filtered = filtered.filter((p) => {
      const matchName = p.name.toLowerCase().includes(query);
      const matchDesc = p.description?.toLowerCase().includes(query) ?? false;
      const matchIngr =
        p.ingredients?.some((ing) => ing.toLowerCase().includes(query)) ?? false;
      return matchName || matchDesc || matchIngr;
    });
  }

  // 5. Apply sorting
  switch (options.sort) {
    case "price-asc":
      filtered.sort((a, b) => a.price_minor - b.price_minor);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.price_minor - a.price_minor);
      break;
    case "name-asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
      filtered.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
    case "featured":
    default:
      filtered.sort((a, b) => {
        if (a.is_featured === b.is_featured) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return a.is_featured ? -1 : 1;
      });
      break;
  }

  return filtered;
}
