'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Coffee, Heart, Check, Filter } from 'lucide-react';
import VideoBackground from '@/components/ui/VideoBackground';
import OrderButton from '@/components/ui/OrderButton';

interface Product {
  id: number;
  name: string;
  category: 'mochas' | 'espresso' | 'coldbrew' | 'beans';
  origin: string;
  notes: string[];
  price: string;
  roast: 'Light' | 'Medium' | 'Medium-Dark';
  image: string;
  popular?: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Chocobliss Royal Mocha',
    category: 'mochas',
    origin: 'Antioquia, Colombia & Venezuela Heirloom Cacao',
    notes: ['Dark Cocoa', 'Black Cherry', 'Molasses'],
    price: '$6.75',
    roast: 'Medium',
    image: '/images/F1.png',
    popular: true,
  },
  {
    id: 2,
    name: 'Bourbon Cask Cold Brew',
    category: 'coldbrew',
    origin: 'Yirgacheffe, Ethiopia (Aged in American Oak)',
    notes: ['Vanilla Bean', 'Charred Oak', 'Jasmine'],
    price: '$7.25',
    roast: 'Light',
    image: '/images/F2.png',
    popular: true,
  },
  {
    id: 3,
    name: 'Smoked Sea Salt Caramel Latte',
    category: 'mochas',
    origin: 'Tarrazú, Costa Rica & Fleur De Sel',
    notes: ['Brown Butter', 'Toffee', 'Honeycomb'],
    price: '$6.50',
    roast: 'Medium',
    image: '/images/F3.png',
  },
  {
    id: 4,
    name: 'Sidama Reserve Natural Espresso',
    category: 'espresso',
    origin: 'Bensa, Sidama, Ethiopia (2,100m elevation)',
    notes: ['Blueberry Jam', 'Bergamot', 'Cacao Nibs'],
    price: '$4.50',
    roast: 'Light',
    image: '/images/F4.png',
    popular: true,
  },
  {
    id: 5,
    name: 'Spiced Cardamom White Mocha',
    category: 'mochas',
    origin: 'Huehuetenango, Guatemala & Organic Cocoa Butter',
    notes: ['Green Cardamom', 'Sweet Cream', 'Nutmeg'],
    price: '$6.25',
    roast: 'Medium',
    image: '/images/F5.png',
  },
  {
    id: 6,
    name: 'Nitro Velvet Chocolate Stout Cold Brew',
    category: 'coldbrew',
    origin: 'Sumatra Kerinci & Cocoa Husk Steep',
    notes: ['Baker’s Chocolate', 'Cedar', 'Creamy Head'],
    price: '$6.85',
    roast: 'Medium-Dark',
    image: '/images/F6.png',
  },
  {
    id: 7,
    name: 'Golden Hour Reserve 250g Whole Bean',
    category: 'beans',
    origin: 'Huila, Colombia (Pink Bourbon Variety)',
    notes: ['Peach Nectar', 'Milk Chocolate', 'Sugar Cane'],
    price: '$24.00',
    roast: 'Medium',
    image: '/images/F7.png',
  },
  {
    id: 8,
    name: 'Midnight Cacao Espresso 250g Whole Bean',
    category: 'beans',
    origin: 'Brazil Cerrado & Guatemala Antigua Blend',
    notes: ['Dark Truffle', 'Toasted Hazelnut', 'Caramel'],
    price: '$22.00',
    roast: 'Medium-Dark',
    image: '/images/F8.png',
    popular: true,
  },
];

const categories = [
  { id: 'all', label: 'All Offerings' },
  { id: 'mochas', label: 'Artisan Mochas' },
  { id: 'espresso', label: 'Specialty Espresso' },
  { id: 'coldbrew', label: 'Cold Brews' },
  { id: 'beans', label: 'Whole Bean Bags' },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [orderedToast, setOrderedToast] = useState<string | null>(null);

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleOrder = (productName: string) => {
    setOrderedToast(`Added "${productName}" to your reservation cup!`);
    setTimeout(() => {
      setOrderedToast(null);
    }, 3500);
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Header with Ingredients Video as Section Background */}
      <section className="relative min-h-[50vh] sm:min-h-[55vh] flex items-center justify-center text-center px-4 overflow-hidden border-b border-coffee-gold/20">
        <VideoBackground
          srcWebm="/videos/ingredients.webm"
          srcMp4="/videos/ingredients.mp4"
          poster="/images/ingredients-poster.png"
          overlayClassName="bg-gradient-to-b from-coffee-dark/80 via-coffee-dark/70 to-coffee-dark/95"
        />

        <div className="relative z-10 max-w-3xl mx-auto py-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coffee-gold/20 border border-coffee-gold/40 text-coffee-gold text-xs font-semibold uppercase tracking-widest mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Pure Origins & Harmonious Blends
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-coffee-cream leading-tight mb-4 drop-shadow-md">
            The Artisan Coffee Menu
          </h1>

          <p className="text-base sm:text-lg text-coffee-cream/85 max-w-2xl mx-auto leading-relaxed font-light">
            Every drink is pulled from meticulously calibrated burrs and blended with slow-melted bean-to-bar chocolate, organic botanicals, and velvety textured milk.
          </p>
        </div>
      </section>

      {/* Toast Notification */}
      {orderedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-coffee-gold text-coffee-dark font-semibold text-sm shadow-2xl animate-fade-in border border-white/20">
          <Check className="w-5 h-5 shrink-0" />
          <span>{orderedToast}</span>
        </div>
      )}

      {/* 2. Filter Pills & Category Navigation */}
      <section className="py-8 bg-[#28160d] border-b border-coffee-gold/15 sticky top-[69px] z-30 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                aria-label={`Filter by ${cat.label}`}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all ${
                  activeCategory === cat.id
                    ? 'bg-coffee-gold text-coffee-dark shadow-md shadow-coffee-gold/20 scale-105'
                    : 'bg-coffee-dark/60 text-coffee-cream/80 hover:bg-coffee-medium/40 hover:text-coffee-gold border border-coffee-gold/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Product Cards Grid */}
      <section className="py-16 sm:py-24 bg-coffee-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="group flex flex-col rounded-3xl overflow-hidden bg-coffee-medium/15 border border-coffee-gold/20 hover:border-coffee-gold/50 shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Product Image */}
                <div className="relative h-60 w-full overflow-hidden bg-coffee-dark/60">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.popular && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-coffee-gold text-coffee-dark text-[10px] font-bold uppercase tracking-wider shadow-md">
                      Popular
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-coffee-dark/80 backdrop-blur-sm text-[11px] text-coffee-cream/90 border border-coffee-gold/20">
                    Roast: {product.roast}
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-serif text-lg font-bold text-coffee-cream group-hover:text-coffee-gold transition-colors leading-snug">
                        {product.name}
                      </h3>
                      <span className="font-serif text-lg font-bold text-coffee-gold shrink-0">
                        {product.price}
                      </span>
                    </div>

                    <p className="text-xs text-coffee-gold/80 italic mb-3">
                      {product.origin}
                    </p>

                    {/* Tasting Notes */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {product.notes.map((note, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-coffee-dark/70 text-[10px] text-coffee-cream/80 border border-coffee-gold/15"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Order Button with Micro-interaction */}
                  <OrderButton
                    onClick={() => handleOrder(product.name)}
                    label="Add to Order"
                    variant="gold"
                    className="w-full text-xs py-2.5"
                    ariaLabel={`Add ${product.name} to order`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
