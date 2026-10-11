"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, ShoppingBag, User, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils/cn";
import { useCart } from "@/lib/cart/cart-context";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { openCart, totalItems } = useCart();

  // Close mobile drawer on Escape key (WCAG 2.2 AA)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#5C4A3D]/40 bg-[#1A1613]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373] rounded-md"
        >
          <div className="w-10 h-10 rounded-full bg-[#D4A373]/15 border border-[#D4A373]/40 flex items-center justify-center text-[#D4A373] transition-transform duration-300 group-hover:scale-105">
            <Coffee className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#FDFBF7] group-hover:text-[#D4A373] transition-colors">
              Chocobliss
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#D4A373] font-medium">
              Coffee Roastery
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
          {siteConfig.navigation.main.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors relative py-1 hover:text-[#D4A373]",
                  isActive ? "text-[#D4A373]" : "text-[#FDFBF7]/85"
                )}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4A373] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Cart & Account) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCart}
            className="p-2.5 rounded-full text-[#FDFBF7] hover:text-[#D4A373] hover:bg-[#2C221E] transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
            aria-label={`Order Cart (${totalItems} items)`}
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D4A373] text-[#1A1613] text-[10px] font-bold flex items-center justify-center border-2 border-[#1A1613] animate-fade-in">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          <Link
            href="/account"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4A373]/30 bg-[#2C221E]/60 text-[#FDFBF7] text-xs font-medium hover:bg-[#2C221E] hover:border-[#D4A373]/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
          >
            <User className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>Account</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-[#FDFBF7] hover:bg-[#2C221E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          role="navigation"
          aria-label="Mobile Navigation"
          className="md:hidden border-b border-[#5C4A3D]/40 bg-[#1A1613] px-4 pt-3 pb-6 space-y-3"
        >
          {siteConfig.navigation.main.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-[#FDFBF7] hover:bg-[#2C221E] hover:text-[#D4A373]"
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#5C4A3D]/30 flex flex-col gap-2">
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#FDFBF7] hover:text-[#D4A373]"
            >
              <User className="w-4 h-4 text-[#D4A373]" />
              <span>Customer Account</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
