import Link from "next/link";
import { Coffee, ShieldCheck, Database, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="bg-[#3A2215] text-[#F5E6D3] py-20 px-4 sm:px-6 lg:px-8 selection:bg-[#C89B5E] selection:text-[#3A2215]">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C89B5E]/30 bg-[#6B4423]/25 text-[#C89B5E] text-xs font-medium tracking-widest uppercase">
          <Coffee className="w-3.5 h-3.5" />
          <span>Small Batch Roastery & Atelier</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F5E6D3] leading-[1.1]">
          Where Artisanal Roast Meets Pure Chocolate Indulgence
        </h1>

        <p className="text-lg sm:text-xl text-[#F5E6D3]/80 leading-relaxed font-sans max-w-2xl mx-auto">
          Meticulously crafted specialty coffee and single-origin cocoa infusions, roasted fresh in the heart of Dhaka.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/products">
            <Button variant="primary" size="lg" className="inline-flex items-center gap-2">
              <span>Explore The Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="secondary" size="lg">
              <span>Our Roastery Story</span>
            </Button>
          </Link>
        </div>

        {/* Feature pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left">
          <div className="p-6 rounded-lg border border-[#C89B5E]/20 bg-[#6B4423]/20 space-y-3">
            <Database className="w-6 h-6 text-[#C89B5E]" />
            <h2 className="font-serif text-lg font-semibold text-[#F5E6D3]">
              PostgreSQL Schema
            </h2>
            <p className="text-xs text-[#F5E6D3]/70 leading-relaxed font-sans">
              11 tables with non-bypassable Row Level Security and automated sync triggers active.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-[#C89B5E]/20 bg-[#6B4423]/20 space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#4ADE80]" />
            <h2 className="font-serif text-lg font-semibold text-[#F5E6D3]">
              Strict RLS Isolation
            </h2>
            <p className="text-xs text-[#F5E6D3]/70 leading-relaxed font-sans">
              Automated tests verify cross-user isolation and tamper-proof role boundaries.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-[#C89B5E]/20 bg-[#6B4423]/20 space-y-3">
            <Award className="w-6 h-6 text-[#C89B5E]" />
            <h2 className="font-serif text-lg font-semibold text-[#F5E6D3]">
              Curated Roasts
            </h2>
            <p className="text-xs text-[#F5E6D3]/70 leading-relaxed font-sans">
              22 specialty roasts, artisan brews, and cocoa pastries seeded in Bangladeshi Taka.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
