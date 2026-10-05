"use client";

import Link from "next/link";
import { Shield, ExternalLink, User } from "lucide-react";

export interface AdminHeaderProps {
  email?: string;
  displayName?: string | null;
}

export function AdminHeader({ email, displayName }: AdminHeaderProps) {
  return (
    <header className="h-20 border-b border-[#5C4A3D]/40 px-6 sm:px-8 flex items-center justify-between bg-[#1A1613]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#D4A373]/10 border border-[#D4A373]/30 text-xs text-[#D4A373] font-medium font-sans">
          <Shield className="w-3.5 h-3.5" />
          <span>Staff Atelier Console</span>
        </div>
        <span className="hidden sm:inline text-xs text-[#F5E6D3]/40">•</span>
        <span className="hidden sm:inline text-xs text-[#F5E6D3]/60 font-sans">
          Authorized Session
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Admin profile preview */}
        <div className="flex items-center gap-2.5 text-xs text-[#F5E6D3]">
          <div className="w-7 h-7 rounded-full bg-[#3D3028] border border-[#D4A373]/40 flex items-center justify-center text-[#D4A373]">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="hidden md:flex flex-col text-right">
            <span className="font-medium text-[#F5E6D3]">{displayName || "Administrator"}</span>
            <span className="text-[10px] text-[#8A8179] truncate max-w-[140px]">{email}</span>
          </div>
        </div>

        {/* Store link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#5C4A3D]/60 bg-[#2C221E]/60 text-xs font-medium text-[#F5E6D3] hover:bg-[#3D3028] hover:text-[#D4A373] transition-colors"
        >
          <span>View Store</span>
          <ExternalLink className="w-3 h-3 text-[#D4A373]" />
        </Link>
      </div>
    </header>
  );
}
