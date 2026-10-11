import Link from "next/link";
import Image from "next/image";
import { Coffee } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/posters/coffee-pour.jpg"
          alt="Coffee pour background"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#1A1613]/80 backdrop-blur-sm" />
      </div>

      {/* Brand Top Header */}
      <div className="flex justify-center relative z-10">
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-10 h-10 rounded-full bg-[#C89B5E]/20 border border-[#C89B5E]/40 flex items-center justify-center text-[#C89B5E] group-hover:scale-105 transition-transform">
            <Coffee className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#F5E6D3]">
              Chocobliss
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#C89B5E] font-medium">
              Coffee Roastery
            </span>
          </div>
        </Link>
      </div>

      {/* Auth Card Container */}
      <div className="flex items-center justify-center my-8 relative z-10">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[#F5E6D3]/50 font-sans relative z-10">
        <p>Protected by Supabase Auth & Cloudflare Turnstile</p>
      </div>
    </div>
  );
}
