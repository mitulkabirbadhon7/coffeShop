'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Coffee, Award, Sparkles, Flame, Compass, ChevronRight, Clock, Star } from 'lucide-react';
import VideoBackground from '@/components/ui/VideoBackground';
import OrderButton from '@/components/ui/OrderButton';

const signatureBrews = [
  {
    id: 1,
    name: 'Chocobliss Signature Mocha',
    description: 'Double ristretto infused with 72% Venezuelan dark chocolate and micro-foamed oat milk.',
    price: '$6.50',
    tag: 'Signature',
    image: '/images/F1.png',
  },
  {
    id: 2,
    name: 'Bourbon Barrel Cold Brew',
    description: 'Steeped for 24 hours in charred oak barrels with hints of vanilla bean and caramelized brown sugar.',
    price: '$7.00',
    tag: 'Limited Reserve',
    image: '/images/F2.png',
  },
  {
    id: 3,
    name: 'Caramel Hazelnut Cortado',
    description: 'Silky 1:1 espresso to warm milk ratio cut with artisanal toasted hazelnut praline syrup.',
    price: '$5.75',
    tag: 'Barista Pick',
    image: '/images/F3.png',
  },
];

const highlights = [
  {
    icon: Flame,
    title: 'Small-Batch Roasting',
    description: 'We roast weekly in micro-batches under 15kg to highlight the terroir, sweetness, and chocolate nuances.',
  },
  {
    icon: Compass,
    title: 'Ethical Direct Trade',
    description: 'Sourced directly from generational coffee estates in Ethiopia, Colombia, and Costa Rica with 100% fair pay.',
  },
  {
    icon: Award,
    title: 'Specialty Q-Graded',
    description: 'Every green lot rates above 86 points on the Specialty Coffee Association scale for uncompromised complexity.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section with Coffee Pour Video Background */}
      <section className="relative min-h-[92vh] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <VideoBackground
          srcWebm="/videos/coffee-pour.webm"
          srcMp4="/videos/coffee-pour.mp4"
          poster="/images/hero-poster.png"
          overlayClassName="bg-gradient-to-b from-coffee-dark/70 via-coffee-dark/55 to-coffee-dark/95"
        />

        <div className="relative z-10 max-w-4xl mx-auto py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coffee-gold/20 border border-coffee-gold/40 text-coffee-gold text-xs sm:text-sm font-medium tracking-widest uppercase mb-6 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-coffee-gold animate-pulse" />
            Artisanal Micro-Roastery & Lounge
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-coffee-cream leading-[1.15] mb-6 drop-shadow-md"
          >
            Where Rich Cocoa Meets <br className="hidden sm:block" />
            <span className="text-coffee-gold italic font-normal">Exquisite Coffee</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-base sm:text-xl text-coffee-cream/85 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Handcrafted with precision, patience, and passion. Immerse your senses in velvety espresso creations roasted to highlight natural cacao notes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <OrderButton
              href="/products"
              label="Explore Our Menu"
              variant="gold"
              className="w-full sm:w-auto text-base px-8 py-4"
              ariaLabel="Explore our artisan coffee menu"
            />
            <Link
              href="/about"
              aria-label="Discover our roastery story"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-coffee-cream/40 text-coffee-cream hover:bg-coffee-cream/15 transition-all text-sm font-semibold tracking-wide backdrop-blur-sm"
            >
              Our Roasting Story
              <ChevronRight className="w-4 h-4 text-coffee-gold" />
            </Link>
          </motion.div>

          {/* Quick Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-coffee-dark/60 backdrop-blur-md border border-coffee-gold/20"
          >
            <div className="p-3 text-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-coffee-gold">88+</span>
              <p className="text-xs text-coffee-cream/70 uppercase tracking-wider mt-1">SCA Cup Score</p>
            </div>
            <div className="p-3 text-center border-l border-coffee-gold/15">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-coffee-gold">100%</span>
              <p className="text-xs text-coffee-cream/70 uppercase tracking-wider mt-1">Ethical Direct Trade</p>
            </div>
            <div className="p-3 text-center border-t md:border-t-0 md:border-l border-coffee-gold/15">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-coffee-gold">72h</span>
              <p className="text-xs text-coffee-cream/70 uppercase tracking-wider mt-1">Freshness Guarantee</p>
            </div>
            <div className="p-3 text-center border-t md:border-t-0 border-l border-coffee-gold/15">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-coffee-gold">15+</span>
              <p className="text-xs text-coffee-cream/70 uppercase tracking-wider mt-1">Single Origins</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Craft Philosophy / Pillars */}
      <section className="py-24 bg-coffee-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-coffee-gold">
              The Chocobliss Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-coffee-cream mt-2 mb-4">
              Roasted with Intention, Poured with Reverence
            </h2>
            <div className="w-16 h-0.5 bg-coffee-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group relative p-8 rounded-3xl bg-coffee-medium/20 border border-coffee-gold/15 hover:border-coffee-gold/40 transition-all duration-300 hover:-translate-y-1.5 shadow-lg"
                >
                  <div className="w-14 h-14 rounded-2xl bg-coffee-dark border border-coffee-gold/30 flex items-center justify-center text-coffee-gold mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-coffee-cream mb-3 group-hover:text-coffee-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-coffee-cream/75 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Signature Creations Spotlight */}
      <section className="py-24 bg-[#2b180e] relative border-y border-coffee-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-coffee-gold">
                Featured Selections
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-coffee-cream mt-2">
                Crafted for Discerning Palates
              </h2>
            </div>
            <Link
              href="/products"
              aria-label="View our full beverage and beans menu"
              className="inline-flex items-center gap-2 text-coffee-gold hover:text-coffee-cream transition-colors text-sm font-semibold tracking-wide"
            >
              View Full Menu <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {signatureBrews.map((brew) => (
              <div
                key={brew.id}
                className="group relative flex flex-col rounded-3xl overflow-hidden bg-coffee-dark/80 border border-coffee-gold/20 hover:border-coffee-gold/50 shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-64 w-full overflow-hidden bg-coffee-medium/40">
                  <Image
                    src={brew.image}
                    alt={brew.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-coffee-dark/80 backdrop-blur-md border border-coffee-gold/40 text-[11px] font-semibold text-coffee-gold uppercase tracking-wider">
                    {brew.tag}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-serif text-xl font-bold text-coffee-cream group-hover:text-coffee-gold transition-colors">
                        {brew.name}
                      </h3>
                      <span className="font-serif text-lg font-bold text-coffee-gold">
                        {brew.price}
                      </span>
                    </div>
                    <p className="text-xs text-coffee-cream/70 leading-relaxed mb-6">
                      {brew.description}
                    </p>
                  </div>

                  <OrderButton
                    href="/products"
                    label="Order This Cup"
                    variant="outline"
                    className="w-full text-xs py-2.5"
                    ariaLabel={`Order ${brew.name}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Experience Banner / Invitation */}
      <section className="py-20 relative bg-coffee-dark text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-coffee-medium/30 via-coffee-dark to-coffee-medium/20 border border-coffee-gold/30 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-coffee-gold/10 rounded-full blur-2xl" />
            <div className="inline-flex items-center gap-2 text-coffee-gold text-xs uppercase tracking-widest mb-4">
              <Star className="w-4 h-4 fill-coffee-gold text-coffee-gold" />
              Visit Our Roastery Lounge
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-cream mb-4">
              Step Into the Sanctuary of Rich Aromas
            </h2>
            <p className="text-coffee-cream/80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
              Whether you are meeting a friend over velvety hot mochas or finding a tranquil corner for deep contemplation, a freshly pulled cup awaits.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <OrderButton
                href="/contact"
                label="Reserve a Table"
                variant="gold"
                ariaLabel="Reserve a table at our café lounge"
              />
              <Link
                href="/about"
                aria-label="Learn about our coffee beans"
                className="px-6 py-3.5 rounded-full border border-coffee-gold/40 text-coffee-gold hover:bg-coffee-gold/10 transition-colors text-sm font-semibold tracking-wide"
              >
                Learn Our Method
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
