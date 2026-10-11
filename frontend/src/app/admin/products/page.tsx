import { getProducts } from "@/lib/data/products.data";
import { formatCurrency } from "@/lib/utils/formatters";
import { Badge } from "@/components/ui/badge";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#F5E6D3]">
            Product Catalog
          </h1>
          <p className="text-sm text-[#F5E6D3]/70 font-sans">
            Manage specialty roasts, minor unit pricing, and stock availability.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#5C4A3D]/40 bg-[#2C221E] overflow-hidden">
        <table className="w-full text-left text-sm font-sans">
          <thead className="bg-[#1A1613] text-[#D4A373] text-xs uppercase tracking-wider border-b border-[#5C4A3D]/40">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Price (BDT)</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#5C4A3D]/30 text-[#F5E6D3]">
            {products.map((item) => (
              <tr key={item.id} className="hover:bg-[#3A2D26] transition-colors">
                <td className="px-6 py-4 font-medium text-[#F5E6D3]">
                  {item.name}
                  {item.is_featured && (
                    <span className="ml-2 text-[10px] text-[#D4A373] font-semibold uppercase">
                      ★ Featured
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-xs text-[#F5E6D3]/60">{item.slug}</td>
                <td className="px-6 py-4 font-serif text-[#D4A373]">
                  {formatCurrency(item.price_minor, item.currency)}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={item.is_available ? "success" : "warning"}>
                    {item.is_available ? "Available" : "Unavailable"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
