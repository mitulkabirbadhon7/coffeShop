import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import { ContactForm } from "@/components/contact/contact-form";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Coffee,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Roastery Location | Chocobliss Coffee Roastery",
  description:
    "Get in touch with the Chocobliss roastery team in Dhaka. Visit our counter for fresh pickups, inquiry on whole bean orders, or join private tasting cuppings.",
  openGraph: {
    title: "Contact & Roastery Atelier | Chocobliss Dhaka",
    description: "Road 11, Banani, Dhaka. Open daily 8:00 AM – 10:00 PM.",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-[#8A8179]/20 pb-8 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAEDCD] text-[#5C4A3D] text-xs font-medium tracking-widest uppercase">
            <Coffee className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>Connect &amp; Inquire</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2C221E]">
            Visit Our Dhaka Roastery Atelier
          </h1>

          <p className="text-sm sm:text-base text-[#5C4A3D] font-sans leading-relaxed">
            Whether you wish to coordinate a bulk whole bean order, explore custom
            chocolate pairings, or simply ask about today&apos;s single-origin roast curves,
            we are delighted to connect.
          </p>
        </div>

        {/* Asymmetric 5/7 Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Roastery Info Card (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-lg bg-[#2C221E] text-[#FDFBF7] border border-[#5C4A3D]/40 shadow-md space-y-6">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#D4A373] font-medium font-sans">
                  The Physical Atelier
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#FDFBF7]">
                  Chocobliss Roasters
                </h2>
              </div>

              {/* Direct Details List */}
              <div className="space-y-5 text-xs sm:text-sm font-sans text-[#FDFBF7]/85 border-y border-[#5C4A3D]/40 py-5">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[#FDFBF7] block">Location</span>
                    <span className="text-[#8A8179] leading-relaxed block mt-0.5">
                      {siteConfig.contact.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[#FDFBF7] block">Operating Hours</span>
                    <span className="text-[#8A8179] block mt-0.5">
                      Open Daily: {siteConfig.operatingHours}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[#FDFBF7] block">Phone &amp; WhatsApp</span>
                    <span className="text-[#8A8179] block mt-0.5">
                      {siteConfig.contact.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[#FDFBF7] block">Direct Inquiries</span>
                    <span className="text-[#8A8179] block mt-0.5">
                      {siteConfig.contact.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pickup model highlight */}
              <div className="p-4 rounded-md bg-[#1A1613] border border-[#5C4A3D]/40 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#D4A373]">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Pickup Model Only (v1)</span>
                </div>
                <p className="text-[11px] text-[#8A8179] leading-relaxed">
                  All online orders are prepared fresh for counter pickup. We do not
                  deliver in order to maintain peak extraction and beverage temperature fidelity.
                </p>
              </div>
            </div>

            {/* Cupping Sessions Note */}
            <div className="p-6 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#E07A5F] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Weekly Public Cuppings</span>
              </div>
              <p className="text-xs text-[#5C4A3D] leading-relaxed">
                Join our head roaster every Saturday at 11:00 AM for guided sensory
                cuppings comparing origin terroirs and roast profiles. Free with reservation.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
