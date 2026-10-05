import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProductsSection } from "@/components/home/featured-products";

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
    </div>
  );
}
