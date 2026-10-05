import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data/products.data";
import { ProductCatalog } from "@/components/products/product-catalog";
import { Coffee, MapPin, Clock } from "lucide-react";
import { ProductsHeroWrapper } from "@/components/products/products-hero-wrapper";

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
    <main>
      {/* Cinematic Scroll Video Hero */}
      <ProductsHeroWrapper>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-20 h-screen flex flex-col justify-center items-end">
          <div className="max-w-2xl w-full text-left">
            <div className="space-y-6 pb-12 border-b border-[#FDFBF7]/20">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2C221E]/70 backdrop-blur-md border border-[#D4A373]/40 text-[#D4A373] text-xs font-semibold tracking-widest uppercase">
                  <Coffee className="w-4 h-4" />
                  <span>Dhaka Roastery Counter Menu</span>
                </div>

                <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-[#FDFBF7] leading-[1.1] drop-shadow-lg">
                  Artisanal Roasts &amp; Confections
                </h1>

                <p className="text-lg sm:text-xl text-[#FDFBF7]/90 font-sans leading-relaxed drop-shadow-md">
                  Every coffee is sourced from ethical micro-lots and roasted twice weekly.
                  All orders are prepared fresh for counter pickup at our Dhaka roastery.
                </p>
              </div>

              {/* Roastery Quick Info Card */}
              <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-[#2C221E]/60 backdrop-blur-md border border-[#D4A373]/30 text-sm text-[#FDFBF7]/90 mt-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[#D4A373]/10">
                    <Clock className="w-4 h-4 text-[#D4A373]" />
                  </div>
                  <span>Pickup: 8am – 10pm</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-[#D4A373]/10">
                    <MapPin className="w-4 h-4 text-[#D4A373]" />
                  </div>
                  <span>Road 11, Banani</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProductsHeroWrapper>

      <div className="bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Interactive Filter & Products Catalog */}
          <ProductCatalog initialProducts={products} categories={categories} />
        </div>
      </div>
    </main>
  );
}
