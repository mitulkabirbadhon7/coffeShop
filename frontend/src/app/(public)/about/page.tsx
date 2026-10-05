import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Coffee,
  Flame,
  Award,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryVideoCard } from "@/components/home/story-video-card";

export const metadata: Metadata = {
  title: "Our Story, Craft & Philosophy | Chocobliss Coffee Roastery",
  description:
    "Discover the artisanal roasting process, single-origin sourcing ethics, and passionate team behind Chocobliss Coffee Roastery in Dhaka.",
  openGraph: {
    title: "About Chocobliss Coffee Roastery | Dhaka",
    description:
      "Small-batch roasting discipline, direct trade relationships, and bean-to-bar chocolate craftsmanship.",
  },
};

export default function AboutPage() {
  const craftSteps = [
    {
      step: "01",
      title: "Micro-Lot Terroir Sourcing",
      desc: "We exclusively purchase specialty grade green coffees (SCA score 86+) directly from smallholder farms in Ethiopia, Colombia, Guatemala, and Sumatra with full harvest traceability.",
    },
    {
      step: "02",
      title: "Small-Batch Drum Profiling",
      desc: "Roasted in small 5kg batches using tailored temperature and airflow curves. We roast to celebrate inherent origin terroir—never over-roasting to bitter charcoal.",
    },
    {
      step: "03",
      title: "Artisanal Cocoa Tempering",
      desc: "Our confections are crafted with single-origin raw cacao nibs, stone-ground and hand-tempered without emulsifiers, artificial flavors, or palm oil.",
    },
    {
      step: "04",
      title: "Sensory Cupping & Release",
      desc: "Every single roast batch undergoes rigorous triangle cupping to evaluate fragrance, aroma, acidity, mouthfeel, and sweetness balance before bagging.",
    },
  ];

  const team = [
    {
      name: "Tariq Rahman",
      role: "Founder & Master Roaster",
      bio: "Certified Q-Grader with over a decade of roasting discipline across specialty origins. Tariq calibrates every single green coffee profile in our Dhaka atelier.",
    },
    {
      name: "Ayesha Sen",
      role: "Head Chocolatier & Pastry Artisan",
      bio: "Trained in European bean-to-bar chocolate making, Ayesha blends single-origin dark cocoa infusions and artisan pastries to complement our roasts.",
    },
  ];

  return (
    <div className="bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-20 lg:space-y-24">
        {/* Editorial Page Header */}
        <div className="border-b border-[#8A8179]/20 pb-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAEDCD] text-[#5C4A3D] text-xs font-medium tracking-widest uppercase">
            <Coffee className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>The Chocobliss Atelier</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2C221E] leading-[1.08]">
            Sourced with Integrity, Roasted with Discipline
          </h1>

          <p className="text-base sm:text-lg text-[#5C4A3D] font-sans leading-relaxed">
            Chocobliss was founded in Dhaka out of reverence for the ritual of coffee
            and chocolate. We believe true luxury lies in patience, provenance, and
            uncompromising craft.
          </p>
        </div>

        {/* Narrative & Visual Showcase (Asymmetric 5/7 split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 relative">
            <StoryVideoCard
              poster="/images/story-craft.jpg"
              videoSrc="/videos/Ingredients.mp4"
              autoPlay={true}
              captionTitle="Our Roastery • Dhaka"
              captionSubtitle="Pure ingredients, direct-trade cacao & specialty beans"
            />

            {/* Decorative Offset Badge */}
            <div className="hidden sm:flex absolute -bottom-5 -right-5 p-4 rounded-lg bg-[#2C221E] text-[#FDFBF7] shadow-xl border border-[#D4A373]/30 items-center gap-3 z-20">
              <Coffee className="w-6 h-6 text-[#D4A373] shrink-0" />
              <div>
                <p className="font-serif text-sm font-bold">100% Traceable</p>
                <p className="text-[11px] text-[#8A8179]">Direct-Trade Specialty Origins</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#E07A5F] font-medium">
              The Genesis
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C221E] leading-tight">
              Bridging the Worlds of Specialty Coffee &amp; Single-Origin Cacao
            </h2>

            <p className="text-sm sm:text-base text-[#5C4A3D] font-sans leading-relaxed">
              For decades, coffee and chocolate were often treated as mass commodities—over-roasted,
              sugared, and generic. At Chocobliss, we approach them as exquisite agricultural
              creations whose nuances deserve to be celebrated.
            </p>

            <p className="text-sm sm:text-base text-[#5C4A3D] font-sans leading-relaxed">
              We roast exclusively in micro-batches to guarantee peak freshness. When you
              order an espresso or pickup a bag of beans from our counter, you are experiencing
              coffee roasted within days, not months.
            </p>

            {/* Sourcing pillars */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/20 flex items-start gap-3">
                <HeartHandshake className="w-5 h-5 text-[#E07A5F] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#2C221E]">
                    Direct Trade Sourcing
                  </h3>
                  <p className="text-xs text-[#5C4A3D] mt-0.5">
                    Above fair-trade premiums paid directly to growers.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/20 flex items-start gap-3">
                <Award className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#2C221E]">
                    Zero Artificial Additives
                  </h3>
                  <p className="text-xs text-[#5C4A3D] mt-0.5">
                    100% natural, unadulterated beans and cacao.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Stage Roasting Discipline */}
        <div className="space-y-10 pt-6">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAEDCD] text-[#5C4A3D] text-xs font-medium tracking-widest uppercase">
              <Flame className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Roasting Discipline</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C221E]">
              Our Craft Process
            </h2>
            <p className="text-sm text-[#5C4A3D]">
              Precision, thermal calibration, and sensory science behind every extraction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {craftSteps.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/20 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="font-serif text-2xl font-bold text-[#D4A373] block">
                    {step.step}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#2C221E]">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#5C4A3D] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Team / Artisans */}
        <div className="space-y-10 pt-6">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAEDCD] text-[#5C4A3D] text-xs font-medium tracking-widest uppercase">
              <Users className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>The Roastery Team</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C221E]">
              Craftspeople Behind The Counter
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div
                key={member.name}
                className="p-8 rounded-lg bg-[#2C221E] text-[#FDFBF7] border border-[#5C4A3D]/40 space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-[#3A2D26] border border-[#D4A373]/30 flex items-center justify-center text-[#D4A373]">
                  <Coffee className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#FDFBF7]">
                    {member.name}
                  </h3>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#D4A373]">
                    {member.role}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-[#FDFBF7]/80 leading-relaxed font-sans pt-2">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-12 rounded-lg bg-[#1A1613] text-[#FDFBF7] border border-[#5C4A3D]/40 text-center space-y-6">
          <Sparkles className="w-8 h-8 text-[#D4A373] mx-auto" />
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FDFBF7]">
              Taste The Difference in Dhaka
            </h2>
            <p className="text-xs sm:text-sm text-[#8A8179] leading-relaxed">
              Order fresh whole beans or reserve your handcrafted drink for counter pickup today.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/products">
              <Button
                variant="primary"
                size="md"
                className="bg-[#D4A373] text-[#1A1613] hover:bg-[#FAEDCD] rounded-md font-medium px-6 h-11 inline-flex items-center gap-2"
              >
                <span>Explore The Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="md"
                className="border-[#D4A373] text-[#D4A373] hover:bg-[#D4A373] hover:text-[#1A1613] rounded-md font-medium px-6 h-11"
              >
                <span>Find Our Atelier</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
