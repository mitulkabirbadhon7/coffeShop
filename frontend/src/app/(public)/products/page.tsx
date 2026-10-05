import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data/products.data";
import { ProductCatalog } from "@/components/products/product-catalog";
import { Coffee, MapPin, Clock } from "lucide-react";
import { FrameSequence } from "@/components/animations/FrameSequence";

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
      <div className="relative min-h-[60vh] flex items-center bg-[#1A1613] overflow-hidden">
        <FrameSequence
          folder="ingredients"
          frameCount={120}
          poster="/posters/ingredients.jpg"
          className="absolute inset-0 w-full h-full z-0"
        />
        
        {/* Cinematic Dark Overlay */}
        <div className="absolute inset-0 backdrop-blur-[1px] bg-gradient-to-r from-[#1A1613]/95 via-[#1A1613]/85 to-[#1A1613]/60 z-0" />

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#FDFBF7]/20">
              <div className="space-y-4 max-w-2xl text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2C221E]/70 backdrop-blur-md border border-[#D4A373]/40 text-[#D4A373] text-xs font-medium tracking-widest uppercase">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Dhaka Roastery Counter Menu</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FDFBF7]">
                  Artisanal Roasts &amp; Confections
                </h1>

                <p className="text-base sm:text-lg text-[#FDFBF7]/85 font-sans leading-relaxed max-w-xl">
                  Every coffee is sourced from ethical micro-lots and roasted twice weekly.
                  All orders are prepared fresh for counter pickup at our Dhaka roastery.
                </p>
              </div>

              {/* Roastery Quick Info Card */}
              <div className="p-5 rounded-xl bg-[#2C221E]/70 backdrop-blur-md border border-[#D4A373]/30 text-xs text-[#FDFBF7]/90 space-y-2 shrink-0">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#D4A373]" />
                  <span>Counter Pickup: 8:00 AM – 10:00 PM</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D4A373]" />
                  <span>Road 11, Banani, Dhaka</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Interactive Filter & Products Catalog */}
          <ProductCatalog initialProducts={products} categories={categories} />
        </div>
      </div>
    </main>
  );
}
