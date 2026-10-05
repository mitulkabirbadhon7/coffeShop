import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gold" | "outline" | "success" | "warning" | "error";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-[#6B4423]/30 text-[#F5E6D3] border-[#C89B5E]/20",
    gold: "bg-[#C89B5E]/15 text-[#C89B5E] border-[#C89B5E]/40",
    outline: "border-[#C89B5E]/40 text-[#F5E6D3] bg-transparent",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    error: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
