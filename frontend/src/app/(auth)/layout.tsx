import Link from "next/link";
import { Coffee } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#3A2215] text-[#F5E6D3] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Top Header */}
      <div className="flex justify-center">
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
      <div className="flex items-center justify-center my-8">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[#F5E6D3]/50 font-sans">
        <p>Protected by Supabase Auth & Cloudflare Turnstile</p>
      </div>
    </div>
  );
}
