import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProductsSection } from "@/components/home/featured-products";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const StorySection = dynamic(() => import("@/components/home/story-section").then((mod) => mod.StorySection));
const CraftAtmosphereSection = dynamic(() => import("@/components/home/craft-atmosphere").then((mod) => mod.CraftAtmosphereSection));
const TestimonialsSection = dynamic(() => import("@/components/home/testimonials-section").then((mod) => mod.TestimonialsSection));
const NewsletterSection = dynamic(() => import("@/components/home/newsletter-section").then((mod) => mod.NewsletterSection));

export const metadata: Metadata = {
  title: "Chocobliss Coffee Roastery | Artisanal Roasts & Fine Cocoa Confections",
  description:
    "Experience small-batch specialty coffee and handcrafted chocolate creations in Dhaka. Fresh roasted beans, authentic brews, and artisanal pastries available for daily pickup.",
  openGraph: {
    title: "Chocobliss Coffee Roastery | Dhaka",
    description:
      "Small-batch specialty coffee roasts and single-origin cocoa pairings in Dhaka.",
    type: "website",
    locale: "en_US",
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full selection:bg-[#D4A373] selection:text-[#1A1613]">
      {/* 1. Hero with Video/Poster background & Editorial Asymmetry */}
      <HeroSection />

      {/* 2. Curated Featured Roasts & Cocoa Treats */}
      <FeaturedProductsSection />

      {/* 3. The Roastery Philosophy & Sourcing Story */}
      <StorySection />

      {/* 4. Atelier Craft Atmosphere & Hours */}
      <CraftAtmosphereSection />

      {/* 5. Guest Testimonials */}
      <TestimonialsSection />

      {/* 6. Newsletter: The Roaster's Dispatch */}
      <NewsletterSection />

      {/* Mobile Sticky Order Button (Visible only on small screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#1A1613] via-[#1A1613]/95 to-transparent z-50 flex justify-center pb-8 pt-12 pointer-events-none">
        <Link href="/products" className="w-full max-w-sm pointer-events-auto">
          <Button
            variant="primary"
            size="lg"
            className="w-full bg-[#D4A373] text-[#1A1613] hover:bg-[#FAEDCD] font-bold shadow-2xl h-14 rounded-full flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Explore Menu & Order</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
