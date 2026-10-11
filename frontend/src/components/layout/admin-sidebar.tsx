"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Coffee,
  ShoppingBag,
  FileText,
  MessageSquare,
  ArrowLeft,
  Shield,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const adminNavItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Coffee },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Site Content", href: "/admin/content", icon: FileText },
  { name: "Testimonials", href: "/admin/testimonials", icon: Star },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1A1613] text-[#F5E6D3] border-r border-[#5C4A3D]/40 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand header */}
        <div className="h-20 px-6 flex items-center gap-3 border-b border-[#5C4A3D]/40">
          <div className="w-9 h-9 rounded-lg bg-[#D4A373]/20 border border-[#D4A373]/40 flex items-center justify-center text-[#D4A373]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-base font-bold text-[#F5E6D3]">
              Chocobliss
            </h2>
            <p className="text-[10px] tracking-wider uppercase text-[#D4A373]">
              Admin Atelier
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1.5 font-sans">
          {adminNavItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#D4A373] text-[#1A1613] font-semibold"
                    : "text-[#F5E6D3]/75 hover:bg-[#2C221E] hover:text-[#F5E6D3]"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-[#1A1613]" : "text-[#D4A373]")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to website */}
      <div className="p-4 border-t border-[#5C4A3D]/40">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#F5E6D3]/70 hover:text-[#D4A373] transition-colors rounded-md hover:bg-[#2C221E]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Public Store</span>
        </Link>
      </div>
    </aside>
  );
}
