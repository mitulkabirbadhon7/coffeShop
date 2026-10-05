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
    <main>
      {/* Hero Section */}
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-20 min-h-[50vh] flex flex-col justify-center items-center bg-[#1A1613]">
          
          <div className="absolute inset-0 z-0">
             <img src="/posters/ingredients.jpg" alt="" className="w-full h-full object-cover opacity-50" />
          </div>

          <div className="relative z-10 max-w-4xl w-full text-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2C221E]/70 backdrop-blur-md border border-[#D4A373]/40 text-[#D4A373] text-xs font-semibold tracking-widest uppercase">
                <Coffee className="w-4 h-4" />
                <span>Dhaka Roastery Counter Menu</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FDFBF7] leading-[1.1] drop-shadow-lg">
                Artisanal Roasts &amp; Confections
              </h1>

              <p className="text-base sm:text-lg text-[#FDFBF7]/90 font-sans leading-relaxed drop-shadow-md max-w-2xl mx-auto">
                Every coffee is sourced from ethical micro-lots and roasted twice weekly.
                All orders are prepared fresh for counter pickup at our Dhaka roastery.
              </p>
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
