import { createClient } from "@/lib/supabase/server";
import { AdminProductTable } from "@/components/admin/products/admin-product-table";

export const metadata = {
  title: "Products & Roasts | Chocobliss Admin Atelier",
};

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("product_categories")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F5E6D3]">
          Specialty Roasts &amp; Products
        </h1>
        <p className="text-xs sm:text-sm text-[#F5E6D3]/60 font-sans">
          Manage specialty single origins, chocolate bars, minor unit pricing in BDT, and inventory availability.
        </p>
      </div>

      <AdminProductTable
        initialProducts={products || []}
        categories={categories || []}
      />
    </div>
  );
}
