import type { Metadata } from "next";
import { Coffee, Flame, Award, HeartHandshake, Users } from "lucide-react";
import { RoasteryHero } from "@/components/about/roastery-hero";

export const metadata: Metadata = {
  title: "Our Roastery, Craft & Philosophy | Chocobliss",
  description:
    "Discover the artisanal roasting process, single-origin sourcing ethics, and passionate team behind Chocobliss Coffee Roastery in Dhaka.",
  openGraph: {
    title: "Our Roastery | Chocobliss Dhaka",
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
      icon: <HeartHandshake className="w-5 h-5 text-[#C89B5E]" />,
    },
    {
      step: "02",
      title: "Small-Batch Drum Profiling",
      desc: "Roasted in small 5kg batches using tailored temperature and airflow curves. We roast to celebrate inherent origin terroir—never over-roasting to bitter charcoal.",
      icon: <Flame className="w-5 h-5 text-[#C89B5E]" />,
    },
    {
      step: "03",
      title: "Artisanal Cocoa Tempering",
      desc: "Our confections are crafted with single-origin raw cacao nibs, stone-ground and hand-tempered without emulsifiers, artificial flavors, or palm oil.",
      icon: <Award className="w-5 h-5 text-[#C89B5E]" />,
    },
    {
      step: "04",
      title: "Sensory Cupping & Release",
      desc: "Every single roast batch undergoes rigorous triangle cupping to evaluate fragrance, aroma, acidity, mouthfeel, and sweetness balance before bagging.",
      icon: <Coffee className="w-5 h-5 text-[#C89B5E]" />,
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
    <main className="bg-[#1A1613]">
      <RoasteryHero>
        <div className="space-y-24 md:space-y-32">
          
          {/* Main Narrative */}
          <div className="space-y-8 max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-[#2C221E] leading-tight">
              Sourced with Integrity, Roasted with Discipline.
            </h1>
            <p className="text-lg md:text-xl text-[#2C221E]/80 font-sans leading-relaxed">
              For decades, coffee and chocolate were often treated as mass commodities—over-roasted,
              sugared, and generic. At Chocobliss, we approach them as exquisite agricultural
              creations whose nuances deserve to be celebrated.
            </p>
            <p className="text-lg md:text-xl text-[#2C221E]/80 font-sans leading-relaxed">
              We roast exclusively in micro-batches to guarantee peak freshness. When you
              order an espresso or pickup a bag of beans from our counter, you are experiencing
              coffee roasted within days, not months.
            </p>
          </div>

          {/* 4-Stage Roasting Discipline */}
          <div className="space-y-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2C221E]">
              Our Craft Process
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto text-left">
              {craftSteps.map((step) => (
                <div key={step.step} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-serif text-2xl font-bold text-[#C89B5E]">
                      {step.step}
                    </span>
                    <div className="h-[1px] flex-1 bg-[#2C221E]/10" />
                    {step.icon}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#2C221E]">
                    {step.title}
                  </h3>
                  <p className="text-lg text-[#2C221E]/70 leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* The Team */}
          <div className="space-y-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 justify-center w-full">
                <Users className="w-5 h-5 text-[#C89B5E]" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2C221E]">
                The Artisans
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto text-left">
              {team.map((member) => (
                <div key={member.name} className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-[#2C221E]">
                    {member.name}
                  </h3>
                  <p className="text-sm font-bold uppercase tracking-widest text-[#C89B5E]">
                    {member.role}
                  </p>
                  <p className="text-lg text-[#2C221E]/70 leading-relaxed font-sans">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </RoasteryHero>
    </main>
  );
}
