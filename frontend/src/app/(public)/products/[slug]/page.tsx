import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getProductBySlug,
  getRelatedProducts,
  getCategories,
} from "@/lib/data/products.data";
import { formatBdt } from "@/lib/utils/formatters";
import { ProductDetailActions } from "@/components/products/product-detail-actions";
import {
  Coffee,
  ArrowLeft,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return {
      title: "Product Not Found | Chocobliss Coffee Roastery",
    };
  }

  const priceText = formatBdt(product.price_minor);

  return {
    title: `${product.name} (${priceText}) | Chocobliss Roastery Dhaka`,
    description:
      product.description ||
      `Specialty small-batch ${product.name} roasted and prepared fresh in Dhaka.`,
    openGraph: {
      title: `${product.name} | Chocobliss Coffee Roastery`,
      description: product.description || "Artisanal specialty coffee in Dhaka.",
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const [categories, relatedProducts] = await Promise.all([
    getCategories(),
    product.category_id
      ? getRelatedProducts(product.id, product.category_id, 3)
      : Promise.resolve([]),
  ]);

  const category = categories.find((c) => c.id === product.category_id);
  const categoryName = category ? category.name : "Artisanal Specialty";

  // Structured JSON-LD Data for Search Engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image_path || "/images/hero-poster.jpg",
    offers: {
      "@type": "Offer",
      price: (product.price_minor / 100).toFixed(2),
      priceCurrency: "BDT",
      availability: product.is_available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceValidUntil: "2027-12-31",
      seller: {
        "@type": "Organization",
        name: "Chocobliss Coffee Roastery",
      },
    },
  };

  return (
    <div className="bg-[#FDFBF7] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* Insert JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#8A8179] font-sans"
        >
          <Link href="/" className="hover:text-[#2C221E] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#2C221E] transition-colors">
            Roastery Menu
          </Link>
          <span>/</span>
          <span className="text-[#2C221E] font-medium truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Back Link */}
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#5C4A3D] hover:text-[#2C221E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Menu</span>
          </Link>
        </div>

        {/* Main Product Presentation (Asymmetric 5/7 split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start bg-[#F4F1EA] p-6 sm:p-10 lg:p-12 rounded-lg border border-[#8A8179]/20 shadow-sm">
          {/* Left Column: Visual Showcase (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center aspect-square rounded-lg bg-[#2C221E] text-[#FDFBF7] p-8 relative overflow-hidden text-center shadow-inner">
            {/* Ambient Background Glow */}
            <div
              className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#D4A373]/15 blur-2xl pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-[#E07A5F]/15 blur-2xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="w-20 h-20 rounded-full bg-[#3A2D26] border border-[#D4A373]/40 flex items-center justify-center text-[#D4A373] mb-5 shadow-md">
              <Coffee className="w-10 h-10" />
            </div>

            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FDFBF7] max-w-xs">
              {product.name}
            </span>

            <span className="text-xs uppercase tracking-widest text-[#D4A373] font-medium mt-2 font-sans">
              {categoryName}
            </span>

            <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1613]/60 border border-[#D4A373]/30 text-[11px] text-[#FAEDCD]">
              <Sparkles className="w-3 h-3 text-[#D4A373]" />
              <span>Roasted in Dhaka • Small Batch</span>
            </div>
          </div>

          {/* Right Column: Narrative & Order Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badges & Category */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-medium uppercase tracking-wider bg-[#FAEDCD] text-[#5C4A3D]">
                {categoryName}
              </span>

              {product.is_featured && (
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#D4A373]/20 text-[#2C221E] border border-[#D4A373]/40">
                  Roaster&apos;s Featured
                </span>
              )}

              {product.is_available ? (
                <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/30">
                  In Stock &amp; Fresh
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-[#F87171]/20 text-[#F87171]">
                  Temporarily Sold Out
                </span>
              )}
            </div>

            {/* Title & Price */}
            <div className="space-y-2">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C221E] leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-2">
                <span className="text-xs uppercase tracking-widest text-[#8A8179] font-sans">
                  Pickup Price:
                </span>
                <span className="font-serif text-3xl font-bold text-[#2C221E]">
                  {formatBdt(product.price_minor)}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#5C4A3D] font-sans leading-relaxed">
              {product.description ||
                "Small-batch specialty roast, prepared with high extraction fidelity and pure origin terroir."}
            </p>

            {/* Ingredients & Sensory Notes */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-[#8A8179]/20">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8A8179] font-sans">
                  Sensory Notes &amp; Ingredients
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((note) => (
                    <span
                      key={note}
                      className="text-xs px-3 py-1 rounded-md bg-[#FDFBF7] border border-[#8A8179]/30 text-[#2C221E] font-sans"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar (Quantity + Order Button) */}
            <ProductDetailActions
              productId={product.id}
              productName={product.name}
              slug={product.slug}
              priceMinor={product.price_minor}
              imageUrl={product.image_path}
              categoryName={categoryName}
              isAvailable={product.is_available}
            />

            {/* Pickup & Craft Highlights */}
            <div className="space-y-2.5 pt-4 border-t border-[#8A8179]/15 text-xs text-[#5C4A3D] font-sans">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span>Pickup Hours: 8:00 AM – 10:00 PM Daily</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span>Counter Pickup: Road 11, Banani, Dhaka</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <span>100% Specialty Arabica &amp; Ethical Direct Trade</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Category Recommendations */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-[#8A8179]/20 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#E07A5F] font-medium">
                  More From This Roasting Profile
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#2C221E]">
                  Related Selections
                </h2>
              </div>
              <Link href="/products">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#2C221E] text-[#2C221E] hover:bg-[#2C221E] hover:text-[#FDFBF7] rounded-md text-xs"
                >
                  <span>View All Offerings</span>
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug}`}
                  className="group block p-5 rounded-lg border border-[#8A8179]/20 bg-[#F4F1EA] hover:border-[#D4A373]/60 transition-all shadow-sm"
                >
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#2C221E] group-hover:text-[#E07A5F] transition-colors">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-[#5C4A3D] line-clamp-2">
                      {rel.description}
                    </p>
                    <div className="pt-3 flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-[#2C221E]">
                        {formatBdt(rel.price_minor)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D4A373] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
