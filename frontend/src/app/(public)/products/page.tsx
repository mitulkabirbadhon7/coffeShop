import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data/products.data";
import { ProductCatalog } from "@/components/products/product-catalog";
import { Coffee, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Artisanal Roasts & Menu | Chocobliss Coffee Roastery",
  description:
    "Explore our complete catalog of small-batch specialty coffees, single-origin roasts, artisan cold brews, and handcrafted chocolate confections in Dhaka.",
  openGraph: {
    title: "Artisanal Coffee & Roasts Menu | Chocobliss Roastery",
    description:
      "Explore 22+ specialty small-batch roasts and chocolate pastries in Dhaka.",
  },
};

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Catalog Header */}
        <div className="border-b border-[#8A8179]/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAEDCD] text-[#5C4A3D] text-xs font-medium tracking-widest uppercase">
              <Coffee className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Dhaka Roastery Counter Menu</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2C221E]">
              Artisanal Roasts &amp; Confections
            </h1>

            <p className="text-sm sm:text-base text-[#5C4A3D] font-sans leading-relaxed">
              Every coffee is sourced from ethical micro-lots and roasted twice weekly.
              All orders are prepared fresh for counter pickup at our Dhaka roastery.
            </p>
          </div>

          {/* Roastery Quick Info Card */}
          <div className="p-4 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/20 text-xs text-[#5C4A3D] space-y-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Counter Pickup: 8:00 AM – 10:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Road 11, Banani, Dhaka</span>
            </div>
          </div>
        </div>

        {/* Interactive Filter & Products Catalog */}
        <ProductCatalog initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}
