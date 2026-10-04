import Link from "next/link";
import { getCategories, getProducts } from "@/lib/data/products.data";
import { formatCurrency } from "@/lib/utils/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Artisanal Menu & Roasts | Chocobliss Coffee Roastery",
  description: "Browse our handcrafted single-origin roasts, artisan brews, and baked pastries.",
};

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#C89B5E] font-medium font-sans">
          The Chocobliss Catalog
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C221E] tracking-tight">
          Artisanal Roasts & Menu
        </h1>
        <p className="text-base text-[#2C221E]/75 font-sans leading-relaxed">
          From velvety double espresso extractions to single-origin pour-overs and chocolate-infused delights.
        </p>
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pb-4">
          <Badge variant="gold" className="px-4 py-1.5 text-xs font-semibold cursor-pointer">
            All Creations ({products.length})
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant="outline"
              className="px-4 py-1.5 text-xs text-[#2C221E] hover:border-[#C89B5E] cursor-pointer"
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group block focus:outline-none"
          >
            <Card className="h-full bg-white border border-[#2C221E]/10 hover:border-[#C89B5E]/50 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#6B4423]/10 border border-[#C89B5E]/20 flex items-center justify-center text-[#6B4423] shrink-0 group-hover:scale-105 transition-transform">
                    <Coffee className="w-5 h-5" />
                  </div>
                  {product.is_featured && (
                    <Badge variant="gold" className="text-[10px]">
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-[#2C221E] group-hover:text-[#C89B5E] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#2C221E]/70 font-sans line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.ingredients.slice(0, 3).map((ing) => (
                      <span
                        key={ing}
                        className="text-[11px] px-2 py-0.5 rounded bg-[#FDFBF7] text-[#2C221E]/70 border border-[#2C221E]/10"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <CardContent className="pt-0 border-t border-[#2C221E]/5 mt-4 p-6 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-[#2C221E]/60 font-medium">
                    Pickup Price
                  </span>
                  <span className="font-serif text-xl font-bold text-[#2C221E]">
                    {formatCurrency(product.price_minor, product.currency)}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#C89B5E]/10 text-[#C89B5E] flex items-center justify-center group-hover:bg-[#C89B5E] group-hover:text-[#3A2215] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
