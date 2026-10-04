import Link from "next/link";
import { Coffee, ShieldCheck, Database, Award } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#3A2215] text-[#F5E6D3] flex flex-col items-center justify-center p-6 selection:bg-[#C89B5E] selection:text-[#3A2215]">
      <div className="max-w-2xl w-full text-center space-y-8 py-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C89B5E]/30 bg-[#6B4423]/20 text-[#C89B5E] text-sm tracking-wider uppercase">
          <Coffee className="w-4 h-4" />
          <span>Chocobliss Coffee Roastery</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#F5E6D3] leading-tight">
          Where Artisanal Roast Meets Pure Chocolate Indulgence
        </h1>

        <p className="text-lg text-[#F5E6D3]/80 leading-relaxed font-sans max-w-xl mx-auto">
          Meticulously crafted specialty coffee and single-origin cocoa infusions, roasted fresh in the heart of Dhaka.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left">
          <div className="p-5 rounded-lg border border-[#C89B5E]/20 bg-[#6B4423]/20 space-y-2">
            <Database className="w-6 h-6 text-[#C89B5E]" />
            <h2 className="font-serif text-base font-semibold text-[#F5E6D3]">PostgreSQL Schema</h2>
            <p className="text-xs text-[#F5E6D3]/70">11 tables with non-bypassable RLS & auto-sync triggers active.</p>
          </div>
          <div className="p-5 rounded-lg border border-[#C89B5E]/20 bg-[#6B4423]/20 space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#4ADE80]" />
            <h2 className="font-serif text-base font-semibold text-[#F5E6D3]">RLS Isolation</h2>
            <p className="text-xs text-[#F5E6D3]/70">Strict cross-user boundaries, verified via automated test suite.</p>
          </div>
          <div className="p-5 rounded-lg border border-[#C89B5E]/20 bg-[#6B4423]/20 space-y-2">
            <Award className="w-6 h-6 text-[#C89B5E]" />
            <h2 className="font-serif text-base font-semibold text-[#F5E6D3]">Curated Menu</h2>
            <p className="text-xs text-[#F5E6D3]/70">22 signature roasts, artisan brews & pastries seeded in BDT.</p>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/products"
            className="px-8 py-3 rounded-full bg-[#C89B5E] text-[#3A2215] font-medium transition duration-300 hover:bg-[#F5E6D3] inline-flex items-center gap-2"
          >
            <span>Explore Menu</span>
          </Link>
          <Link
            href="/about"
            className="px-8 py-3 rounded-full border border-[#C89B5E]/50 text-[#F5E6D3] font-medium transition duration-300 hover:bg-[#6B4423]/30"
          >
            <span>Our Roastery</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
