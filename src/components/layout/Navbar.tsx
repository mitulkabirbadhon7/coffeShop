'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Coffee, ShoppingBag } from 'lucide-react';
import OrderButton from '@/components/ui/OrderButton';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Our Story', href: '/about' },
  { name: 'Artisan Menu', href: '/products' },
  { name: 'Contact & Lounge', href: '/contact' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-coffee-dark/90 backdrop-blur-md border-b border-coffee-gold/20 shadow-xl shadow-black/20 py-3'
          : 'bg-coffee-dark/70 backdrop-blur-sm border-b border-coffee-gold/10 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            aria-label="Chocobliss Coffee Home"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-coffee-gold rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coffee-gold to-coffee-accent flex items-center justify-center shadow-md shadow-coffee-gold/20 group-hover:scale-105 transition-transform duration-300">
              <Coffee className="w-5 h-5 text-coffee-dark" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl sm:text-2xl text-coffee-cream tracking-wider group-hover:text-coffee-gold transition-colors">
                CHOCOBLISS
              </span>
              <span className="text-[10px] tracking-[0.25em] text-coffee-gold/80 uppercase font-sans -mt-1">
                Coffee Roastery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-8"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide font-medium transition-colors relative py-1 ${
                    isActive
                      ? 'text-coffee-gold'
                      : 'text-coffee-cream/80 hover:text-coffee-gold'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-coffee-gold rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/products"
              aria-label="View Cart / Selection"
              className="p-2 text-coffee-cream/80 hover:text-coffee-gold transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-coffee-accent rounded-full animate-pulse" />
            </Link>
            <OrderButton href="/products" label="Reserve Order" variant="gold" />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              className="p-2 rounded-lg text-coffee-cream hover:text-coffee-gold focus:outline-none focus:ring-2 focus:ring-coffee-gold"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-coffee-gold/15 bg-coffee-dark/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl space-y-4">
            <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-base font-medium tracking-wide transition-colors ${
                      isActive
                        ? 'bg-coffee-gold/15 text-coffee-gold font-semibold'
                        : 'text-coffee-cream/85 hover:bg-coffee-medium/40 hover:text-coffee-gold'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            <div className="pt-2 flex flex-col gap-3">
              <OrderButton
                href="/products"
                label="Reserve Your Cup"
                variant="gold"
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
