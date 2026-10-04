"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, ShoppingBag, User, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#C89B5E]/20 bg-[#3A2215]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B5E] rounded-md"
        >
          <div className="w-10 h-10 rounded-full bg-[#C89B5E]/15 border border-[#C89B5E]/40 flex items-center justify-center text-[#C89B5E] transition-transform duration-300 group-hover:scale-105">
            <Coffee className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#F5E6D3] group-hover:text-[#C89B5E] transition-colors">
              Chocobliss
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#C89B5E] font-medium">
              Coffee Roastery
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
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
                  "text-sm font-medium transition-colors relative py-1 hover:text-[#C89B5E]",
                  isActive ? "text-[#C89B5E]" : "text-[#F5E6D3]/85"
                )}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C89B5E] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Cart & Account) */}
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="p-2.5 rounded-full text-[#F5E6D3] hover:text-[#C89B5E] hover:bg-[#6B4423]/30 transition-colors relative"
            aria-label="Order Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C89B5E]" />
          </Link>

          <Link
            href="/account"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C89B5E]/30 bg-[#6B4423]/20 text-[#F5E6D3] text-xs font-medium hover:bg-[#6B4423]/40 hover:border-[#C89B5E]/50 transition-colors"
          >
            <User className="w-3.5 h-3.5 text-[#C89B5E]" />
            <span>Account</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-[#F5E6D3] hover:bg-[#6B4423]/30 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#C89B5E]/20 bg-[#2C221E] px-4 pt-3 pb-6 space-y-3">
          {siteConfig.navigation.main.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-[#F5E6D3] hover:bg-[#6B4423]/30 hover:text-[#C89B5E]"
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#C89B5E]/10 flex flex-col gap-2">
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#F5E6D3]"
            >
              <User className="w-4 h-4 text-[#C89B5E]" />
              <span>Customer Account</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
