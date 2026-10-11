import { Coffee, Award, Flame, Heart } from "lucide-react";
import { siteConfig } from "@/config/site.config";

export const metadata = {
  title: "Our Story & Roastery Atelier | Chocobliss Coffee Roastery",
  description: "Learn about the craftsmanship, ethics, and roasting discipline behind Chocobliss.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      {/* Intro Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#C89B5E] font-medium font-sans">
          The Chocobliss Legacy
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C221E] tracking-tight">
          Obsession with Roast & Cocoa
        </h1>
        <p className="text-base text-[#2C221E]/80 font-sans leading-relaxed">
          Founded in Dhaka, Chocobliss was born from a singular passion: marrying the delicate terroir of specialty coffee with the profound indulgence of authentic single-origin cocoa.
        </p>
      </div>

      {/* Narrative grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="p-8 sm:p-10 rounded-2xl bg-[#3A2215] text-[#F5E6D3] space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#C89B5E]/20 text-[#C89B5E] flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#F5E6D3]">
            Small Batch Artisanship
          </h2>
          <p className="text-sm text-[#F5E6D3]/75 font-sans leading-relaxed">
            Every batch of green coffee is roasted in our precision drum roaster to exact temperature curves. We never mask defects with dark ash; we highlight the origin’s natural jasmine, bergamot, and chocolate notes.
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-2xl bg-[#6B4423]/15 border border-[#C89B5E]/20 text-[#2C221E] space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#C89B5E]/15 text-[#C89B5E] flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2C221E]">
            Direct Ethical Trade
          </h2>
          <p className="text-sm text-[#2C221E]/75 font-sans leading-relaxed">
            We partner with micro-lot farmers in Ethiopia, Colombia, and Guatemala who receive premiums well above Fair Trade standards for their dedication to biodiverse, regenerative agriculture.
          </p>
        </div>
      </div>

      {/* Roastery details */}
      <div className="p-8 rounded-xl bg-white border border-[#2C221E]/10 space-y-4 text-center max-w-xl mx-auto">
        <Coffee className="w-8 h-8 text-[#C89B5E] mx-auto" />
        <h3 className="font-serif text-xl font-bold text-[#2C221E]">
          Visit Our Atelier
        </h3>
        <p className="text-sm text-[#2C221E]/70 font-sans">
          {siteConfig.contact.address}
        </p>
        <p className="text-xs uppercase tracking-wider text-[#C89B5E] font-medium font-sans">
          {siteConfig.operatingHours}
        </p>
      </div>
    </div>
  );
}
