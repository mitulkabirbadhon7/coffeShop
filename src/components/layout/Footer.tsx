'use client';

import React from 'react';
import Link from 'next/link';
import { Coffee, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import OrderButton from '@/components/ui/OrderButton';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#26150c] text-coffee-cream border-t border-coffee-gold/20 overflow-hidden">
      {/* Subtle decorative glow overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-coffee-gold/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coffee-gold to-coffee-accent flex items-center justify-center">
                <Coffee className="w-5 h-5 text-coffee-dark" />
              </div>
              <div>
                <span className="font-serif font-bold text-xl tracking-wider text-coffee-cream">
                  CHOCOBLISS
                </span>
                <p className="text-[10px] tracking-[0.25em] text-coffee-gold/90 uppercase font-sans">
                  Coffee Roastery
                </p>
              </div>
            </div>
            <p className="text-sm text-coffee-cream/75 leading-relaxed">
              Curating micro-lot single origin beans, slow-roasted to sweet perfection. Handcrafted lattes, velvety chocolate blends, and warmth in every pour.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Chocobliss on Instagram"
                className="w-9 h-9 rounded-full bg-coffee-dark/80 border border-coffee-gold/30 flex items-center justify-center text-coffee-gold hover:bg-coffee-gold hover:text-coffee-dark transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Chocobliss on Facebook"
                className="w-9 h-9 rounded-full bg-coffee-dark/80 border border-coffee-gold/30 flex items-center justify-center text-coffee-gold hover:bg-coffee-gold hover:text-coffee-dark transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Chocobliss on Twitter"
                className="w-9 h-9 rounded-full bg-coffee-dark/80 border border-coffee-gold/30 flex items-center justify-center text-coffee-gold hover:bg-coffee-gold hover:text-coffee-dark transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-coffee-gold tracking-wide">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-coffee-cream/75">
              <li>
                <Link
                  href="/"
                  className="hover:text-coffee-gold transition-colors inline-block"
                >
                  Home & Tasting Notes
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-coffee-gold transition-colors inline-block"
                >
                  Our Roasting Heritage
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-coffee-gold transition-colors inline-block"
                >
                  Artisanal Espresso & Brews
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-coffee-gold transition-colors inline-block"
                >
                  Café Lounge & Reservations
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-coffee-gold tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-coffee-gold" />
              Café Hours
            </h3>
            <ul className="space-y-2 text-sm text-coffee-cream/75">
              <li className="flex justify-between border-b border-coffee-gold/10 pb-1">
                <span>Mon – Fri:</span>
                <span className="text-coffee-cream font-medium">6:30 AM – 8:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-coffee-gold/10 pb-1">
                <span>Saturday:</span>
                <span className="text-coffee-cream font-medium">7:00 AM – 9:00 PM</span>
              </li>
              <li className="flex justify-between pb-1">
                <span>Sunday:</span>
                <span className="text-coffee-cream font-medium">7:30 AM – 7:00 PM</span>
              </li>
            </ul>
            <p className="text-xs text-coffee-gold/80 italic pt-1">
              Fresh croissants & pastries served daily until sold out.
            </p>
          </div>

          {/* Location & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-coffee-gold tracking-wide">
              Roastery Lounge
            </h3>
            <div className="space-y-2 text-sm text-coffee-cream/75">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-coffee-gold shrink-0 mt-0.5" />
                <span>428 Artisan Way, Cocoa Square, Seattle, WA</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-coffee-gold shrink-0" />
                <span>+1 (555) 246-2654</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-coffee-gold shrink-0" />
                <span>hello@chocoblisscoffee.com</span>
              </div>
            </div>
            <div className="pt-2">
              <OrderButton href="/contact" label="Reserve a Table" variant="outline" className="w-full text-xs py-2.5" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-coffee-gold/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-coffee-cream/60">
          <p>© {new Date().getFullYear()} Chocobliss Coffee Roastery. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-coffee-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-coffee-gold transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-coffee-gold transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
