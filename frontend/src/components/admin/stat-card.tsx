import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: "success" | "warning" | "neutral" | "accent";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeType = "neutral",
}: StatCardProps) {
  const badgeClasses = {
    success: "bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/30",
    warning: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30",
    neutral: "bg-[#8A8179]/15 text-[#8A8179] border-[#8A8179]/30",
    accent: "bg-[#D4A373]/15 text-[#D4A373] border-[#D4A373]/30",
  }[badgeType];

  return (
    <div className="rounded-xl bg-[#231B18] border border-[#5C4A3D]/40 p-5 space-y-3 shadow-sm hover:border-[#D4A373]/50 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#D4A373] font-sans">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#2C221E] border border-[#5C4A3D]/50 flex items-center justify-center text-[#D4A373]">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-serif font-bold text-[#F5E6D3] tracking-tight">
          {value}
        </div>
        <div className="flex items-center justify-between gap-2">
          {subtitle && (
            <p className="text-xs text-[#8A8179] font-sans truncate">{subtitle}</p>
          )}
          {badge && (
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border",
                badgeClasses
              )}
            >
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
