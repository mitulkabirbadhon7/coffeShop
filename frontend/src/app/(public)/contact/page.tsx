import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Contact & Roastery Location | Chocobliss Coffee Roastery",
  description: "Get in touch with the Chocobliss team or find our Banani atelier.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#C89B5E] font-medium font-sans">
          Connect With Us
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C221E] tracking-tight">
          Visit or Inquire
        </h1>
        <p className="text-base text-[#2C221E]/75 font-sans leading-relaxed">
          Questions regarding private tasting sessions, whole bean orders, or our roasting schedule? We welcome your message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Contact Info Card */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#3A2215] text-[#F5E6D3] space-y-8 shadow-sm">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#F5E6D3]">
              The Roastery Atelier
            </h2>
            <p className="text-sm text-[#F5E6D3]/70 font-sans mt-1">
              Stop by for a freshly pulled espresso and pastry.
            </p>
          </div>

          <div className="space-y-6 text-sm font-sans">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#C89B5E] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#F5E6D3] block">Address</span>
                <span className="text-[#F5E6D3]/70 text-xs">{siteConfig.contact.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#C89B5E] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#F5E6D3] block">Operating Hours</span>
                <span className="text-[#F5E6D3]/70 text-xs">{siteConfig.operatingHours}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#C89B5E] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#F5E6D3] block">Direct Phone</span>
                <span className="text-[#F5E6D3]/70 text-xs">{siteConfig.contact.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#C89B5E] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#F5E6D3] block">Concierge Email</span>
                <span className="text-[#F5E6D3]/70 text-xs">{siteConfig.contact.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form Shell */}
        <div className="p-8 rounded-2xl bg-white border border-[#2C221E]/10 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-bold text-[#2C221E]">
              Send a Note
            </h3>
            <p className="text-xs text-[#2C221E]/60 font-sans">
              Our team responds within 24 operational hours.
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2C221E]/70 font-sans">
                Your Name
              </label>
              <Input placeholder="e.g. Tahmidur Rahman" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2C221E]/70 font-sans">
                Email Address
              </label>
              <Input type="email" placeholder="you@domain.com" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2C221E]/70 font-sans">
                Subject
              </label>
              <Input placeholder="Inquiry about specialty beans" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2C221E]/70 font-sans">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Share your thoughts or inquiry..."
                className="w-full rounded-md border border-[#C89B5E]/30 bg-[#2C221E]/5 p-3 text-sm text-[#2C221E] placeholder:text-[#2C221E]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B5E]"
              />
            </div>

            <Button variant="primary" className="w-full">
              <span>Send Message</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
