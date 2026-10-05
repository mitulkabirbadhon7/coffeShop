import Link from "next/link";
import { Coffee, MapPin, Clock, Phone, Mail } from "lucide-react";
import { siteConfig } from "@/config/site.config";

export function Footer() {
  return (
    <footer className="w-full bg-[#1A1613] text-[#FDFBF7] border-t border-[#5C4A3D]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#D4A373]/15 border border-[#D4A373]/40 flex items-center justify-center text-[#D4A373]">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#FDFBF7]">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-sm text-[#FDFBF7]/75 font-sans leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2C221E] border border-[#5C4A3D]/40 text-xs text-[#D4A373]">
              <span>Pickup Order Only in V1</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-[#D4A373] tracking-wider uppercase text-xs">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm font-sans">
              {siteConfig.navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-[#FDFBF7]/75 hover:text-[#D4A373] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/login"
                  className="text-[#FDFBF7]/75 hover:text-[#D4A373] transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-[#8A8179] hover:text-[#D4A373] transition-colors text-xs"
                >
                  Staff / Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Roastery Hours & Location */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-[#D4A373] tracking-wider uppercase text-xs">
              Roastery Hours
            </h4>
            <div className="space-y-3 text-sm text-[#FDFBF7]/75 font-sans">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4A373] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[#FDFBF7]">Open Daily</p>
                  <p className="text-xs text-[#8A8179]">{siteConfig.operatingHours}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4A373] mt-0.5 shrink-0" />
                <p className="text-xs text-[#FDFBF7]/75">{siteConfig.contact.address}</p>
              </div>
            </div>
          </div>

          {/* Direct Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-[#D4A373] tracking-wider uppercase text-xs">
              Inquiries &amp; Orders
            </h4>
            <div className="space-y-2.5 text-sm text-[#FDFBF7]/75 font-sans">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span className="text-xs">{siteConfig.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span className="text-xs">{siteConfig.contact.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#5C4A3D]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A8179] font-sans gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
            <Link href="/privacy" className="hover:text-[#D4A373] transition-colors">Privacy Policy</Link>
          </div>
          <div className="flex items-center gap-6">
            <span>Dhaka, Bangladesh</span>
            <span>Small-Batch Artisanal Coffee &amp; Cocoa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
