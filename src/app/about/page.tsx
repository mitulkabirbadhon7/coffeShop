'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Coffee, Heart, Award, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import VideoBackground from '@/components/ui/VideoBackground';
import OrderButton from '@/components/ui/OrderButton';

const values = [
  {
    title: 'The Art of the Slow Roast',
    description: 'We develop our roast profile minute by minute, tuning convection heat to caramelize sugars without scorching delicate floral aromatics.',
  },
  {
    title: 'Pure Single-Origin Cacao',
    description: 'Our signature mocha blends use single-estate heirloom Criollo cacao, roasted low and slow to harmonize with high-altitude espresso.',
  },
  {
    title: 'Regenerative Agriculture',
    description: 'Our grower partners prioritize canopy shade trees, rich volcanic soil preservation, and fair living wages for harvest workers.',
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Header Banner */}
      <section className="relative py-24 sm:py-32 bg-coffee-dark text-center px-4 overflow-hidden border-b border-coffee-gold/15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-coffee-medium/30 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coffee-gold/15 border border-coffee-gold/30 text-coffee-gold text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Our Heritage & Craft
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-coffee-cream leading-tight mb-6">
            Born from an Obsession with the Perfect Cup
          </h1>
          <p className="text-base sm:text-lg text-coffee-cream/80 leading-relaxed font-light">
            Founded in 2018 in a brick-walled alleyway, Chocobliss set out to unite two of civilization’s greatest indulgences: specialty single-origin Arabica coffee and rich, velvety cacao.
          </p>
        </div>
      </section>

      {/* 2. Split Section with SteamCup Video */}
      <section className="py-20 sm:py-28 bg-[#2b180e] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Video Container with Steam Rising Video */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[420px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-coffee-gold/30 group"
            >
              <VideoBackground
                srcWebm="/videos/steam-cup.webm"
                srcMp4="/videos/steam-cup.mp4"
                poster="/images/about-poster.png"
                overlayClassName="bg-black/25 group-hover:bg-black/15 transition-colors duration-500"
                lazy={true}
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-coffee-dark/80 backdrop-blur-md border border-coffee-gold/25">
                <p className="font-serif text-coffee-gold text-sm font-semibold italic">
                  &ldquo;A cup of coffee should be an experience of quiet wonder.&rdquo;
                </p>
                <span className="text-[11px] text-coffee-cream/70 uppercase tracking-wider block mt-1">
                  — Elena Rostova, Master Roaster & Founder
                </span>
              </div>
            </motion.div>

            {/* Right: Narrative Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-coffee-gold">
                The Roasting Chamber
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-cream leading-snug">
                Where Aromas Awaken and Steam Tells the Tale
              </h2>
              <p className="text-sm sm:text-base text-coffee-cream/80 leading-relaxed">
                Every morning at dawn, our cast-iron drum roaster begins its rhythmic hum. We source micro-lots directly from farmers we know by name, ensuring each harvest is dried on raised African beds before reaching our Seattle roastery.
              </p>
              <p className="text-sm sm:text-base text-coffee-cream/80 leading-relaxed">
                When that first golden stream of espresso hits fresh stone-ground chocolate, the alchemy of Chocobliss comes alive. We never mask flaws with burnt sugar; we elevate the bean’s innate plum, bergamot, and cocoa notes.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <OrderButton
                  href="/products"
                  label="Taste the Craft"
                  variant="gold"
                  ariaLabel="Taste our crafted coffee"
                />
                <OrderButton
                  href="/contact"
                  label="Visit Our Lounge"
                  variant="outline"
                  ariaLabel="Visit our roastery lounge"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Three Pillars of Excellence */}
      <section className="py-24 bg-coffee-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-coffee-gold">
              Our Core Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-cream mt-2 mb-4">
              Commitment Behind Every Sip
            </h2>
            <div className="w-16 h-0.5 bg-coffee-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-coffee-medium/20 border border-coffee-gold/20 hover:border-coffee-gold/45 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div className="w-10 h-10 rounded-full bg-coffee-gold/20 flex items-center justify-center text-coffee-gold mb-6 font-serif font-bold text-lg">
                  {idx + 1}
                </div>
                <h3 className="font-serif text-xl font-semibold text-coffee-cream mb-3">
                  {val.title}
                </h3>
                <p className="text-sm text-coffee-cream/75 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Meet the Roasters Gallery */}
      <section className="py-20 bg-[#25130b] border-t border-coffee-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-coffee-gold">
              The Artisan Team
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-cream mt-2">
              The Hands Behind the Extraction
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-coffee-dark border border-coffee-gold/20 text-center">
              <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-coffee-gold/40">
                <Image src="/images/F4.png" alt="Head Roaster" fill className="object-cover" />
              </div>
              <h3 className="font-serif text-lg font-bold text-coffee-cream">Elena Rostova</h3>
              <p className="text-xs text-coffee-gold uppercase tracking-wider mb-2">Founder & Head Roaster</p>
              <p className="text-xs text-coffee-cream/70 leading-relaxed">
                Certified Q-Arabica Grader with 14 years exploring micro-climate farms across the equatorial coffee belt.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-coffee-dark border border-coffee-gold/20 text-center">
              <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-coffee-gold/40">
                <Image src="/images/F5.png" alt="Cacao Alchemist" fill className="object-cover" />
              </div>
              <h3 className="font-serif text-lg font-bold text-coffee-cream">Marcus Vance</h3>
              <p className="text-xs text-coffee-gold uppercase tracking-wider mb-2">Cacao Sommelier</p>
              <p className="text-xs text-coffee-cream/70 leading-relaxed">
                Master chocolatier dedicated to finding the exact bean-to-bar profile that compliments high-grown African coffees.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-coffee-dark border border-coffee-gold/20 text-center sm:col-span-2 md:col-span-1">
              <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-coffee-gold/40">
                <Image src="/images/F6.png" alt="Head Barista" fill className="object-cover" />
              </div>
              <h3 className="font-serif text-lg font-bold text-coffee-cream">Kiran Patel</h3>
              <p className="text-xs text-coffee-gold uppercase tracking-wider mb-2">Lead Barista Trainer</p>
              <p className="text-xs text-coffee-cream/70 leading-relaxed">
                National Latte Art Finalist refining espresso extraction geometry and silky steamed oat milk texture.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
