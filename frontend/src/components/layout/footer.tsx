import Link from "next/link";
import { Coffee, MapPin, Clock, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/config/site.config";

export function Footer() {
  return (
    <footer className="w-full bg-[#2C221E] text-[#F5E6D3] border-t border-[#C89B5E]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#C89B5E]/20 border border-[#C89B5E]/40 flex items-center justify-center text-[#C89B5E]">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#F5E6D3]">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-sm text-[#F5E6D3]/70 font-sans leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6B4423]/30 border border-[#C89B5E]/20 text-xs text-[#C89B5E]">
              <span>Pickup Order Only in V1</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-[#C89B5E] tracking-wider uppercase text-xs">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm font-sans">
              {siteConfig.navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[#F5E6D3]/75 hover:text-[#C89B5E] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/account"
                  className="text-[#F5E6D3]/75 hover:text-[#C89B5E] transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-[#F5E6D3]/50 hover:text-[#C89B5E] transition-colors text-xs"
                >
                  Staff / Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Roastery Hours & Location */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-[#C89B5E] tracking-wider uppercase text-xs">
              Roastery Hours
            </h4>
            <div className="space-y-3 text-sm text-[#F5E6D3]/75 font-sans">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C89B5E] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[#F5E6D3]">Open Daily</p>
                  <p className="text-xs text-[#F5E6D3]/60">{siteConfig.operatingHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C89B5E] mt-0.5 shrink-0" />
                <p className="text-xs text-[#F5E6D3]/70">{siteConfig.contact.address}</p>
              </div>
            </div>
          </div>

          {/* Direct Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-[#C89B5E] tracking-wider uppercase text-xs">
              Inquiries & Orders
            </h4>
            <div className="space-y-2.5 text-sm text-[#F5E6D3]/75 font-sans">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C89B5E] shrink-0" />
                <span className="text-xs">{siteConfig.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C89B5E] shrink-0" />
                <span className="text-xs">{siteConfig.contact.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#C89B5E]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F5E6D3]/60 font-sans gap-4">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Dhaka, Bangladesh</span>
            <span>Handcrafted Specialty Beans</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
