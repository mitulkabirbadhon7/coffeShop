import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug } from "@/lib/data/products.data";
import { formatCurrency } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, ArrowLeft, ShieldCheck, Clock, ShoppingBag } from "lucide-react";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Chocobliss Coffee Roastery`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-[#2C221E]/70 hover:text-[#C89B5E] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Roasts</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white p-8 sm:p-12 rounded-2xl border border-[#2C221E]/10 shadow-sm">
        {/* Visual Box */}
        <div className="aspect-square rounded-xl bg-[#3A2215] flex flex-col items-center justify-center p-8 text-center text-[#F5E6D3] relative overflow-hidden">
          <div className="w-24 h-24 rounded-full bg-[#6B4423]/40 border border-[#C89B5E]/30 flex items-center justify-center text-[#C89B5E] mb-4">
            <Coffee className="w-12 h-12" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#F5E6D3]">
            {product.name}
          </span>
          <span className="text-xs uppercase tracking-widest text-[#C89B5E] mt-1">
            Artisanal Reserve
          </span>
        </div>

        {/* Details Box */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {product.is_featured && <Badge variant="gold">Signature Selection</Badge>}
              <Badge variant="outline" className="text-[#2C221E]">
                In Stock & Fresh
              </Badge>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C221E]">
              {product.name}
            </h1>
            <p className="font-serif text-3xl font-bold text-[#C89B5E]">
              {formatCurrency(product.price_minor, product.currency)}
            </p>
          </div>

          <p className="text-base text-[#2C221E]/80 font-sans leading-relaxed">
            {product.description}
          </p>

          {product.ingredients && product.ingredients.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#2C221E]/10">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#2C221E]/60 font-sans">
                Tasting & Ingredient Notes
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-3 py-1 rounded-full bg-[#FDFBF7] border border-[#2C221E]/15 text-[#2C221E]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3 pt-4 border-t border-[#2C221E]/10 text-xs text-[#2C221E]/70 font-sans">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C89B5E]" />
              <span>Available for pickup: 8:00 AM – 10:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ethically sourced single-origin Arabica & Belgian cocoa</span>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="primary" size="lg" className="w-full inline-flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Pickup Order</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
