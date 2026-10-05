import * as React from "react";
import Link from "next/link";
import { Coffee, ArrowRight, Sparkles } from "lucide-react";
import { getFeaturedProducts, getCategories } from "@/lib/data/products.data";
import { formatBdt } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";

export async function FeaturedProductsSection() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#FDFBF7] text-[#2C221E]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D4A373]/30 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAEDCD] text-[#5C4A3D] text-xs font-medium tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Seasonal Curations</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#2C221E]">
              Featured Roasts &amp; Confections
            </h2>
            <p className="text-sm sm:text-base text-[#5C4A3D] font-sans leading-relaxed">
              Each selection is hand-roasted in small 5kg batches or crafted from
              ethically sourced, single-origin cacao. Freshly prepared for counter pickup.
            </p>
          </div>

          <Link href="/products" className="shrink-0">
            <Button
              variant="outline"
              size="md"
              className="border-[#2C221E] text-[#2C221E] hover:bg-[#2C221E] hover:text-[#FDFBF7] rounded-md font-medium inline-flex items-center gap-2 h-11 px-5"
            >
              <span>Explore Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Product Cards Grid */}
        {products.length === 0 ? (
          <div className="p-12 text-center rounded-lg border border-[#D4A373]/20 bg-[#F4F1EA]">
            <Coffee className="w-8 h-8 text-[#8A8179] mx-auto mb-3" />
            <p className="text-sm text-[#5C4A3D]">
              New seasonal batches are currently being roasted. Check back shortly!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const categoryName = product.category_id
                ? categoryMap.get(product.category_id) || "Specialty"
                : "Specialty";

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between rounded-lg border border-[#8A8179]/20 bg-[#F4F1EA] p-6 hover:shadow-md hover:border-[#D4A373]/60 transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Category & Badge */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#E07A5F] tracking-wider uppercase text-[11px]">
                        {categoryName}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#FAEDCD] text-[#5C4A3D]">
                        Batch Fresh
                      </span>
                    </div>

                    {/* Product Name & Description */}
                    <div className="space-y-2">
                      <h3 className="font-serif text-xl font-bold text-[#2C221E] group-hover:text-[#E07A5F] transition-colors">
                        <Link href={`/products/${product.slug}`}>
                          {product.name}
                        </Link>
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5C4A3D] font-sans line-clamp-2 leading-relaxed">
                        {product.description ||
                          "Specialty small-batch roast with delicate origin character and rich cocoa undertones."}
                      </p>
                    </div>
                  </div>

                  {/* Pricing & Order CTA */}
                  <div className="pt-6 mt-6 border-t border-[#8A8179]/15 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8A8179] block">
                        Pickup Price
                      </span>
                      <span className="font-serif text-lg font-bold text-[#2C221E]">
                        {formatBdt(product.price_minor)}
                      </span>
                    </div>

                    <Link href={`/products/${product.slug}`}>
                      <Button
                        variant="primary"
                        size="sm"
                        className="btn-cup-fill bg-[#2C221E] text-[#FDFBF7] hover:text-[#1A1613] rounded-md text-xs font-medium h-9 px-4 inline-flex items-center gap-1.5"
                      >
                        <span>Order Pickup</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
