"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "dark";
export type ButtonSize = "sm" | "md" | "lg";

export const buttonVariants = ({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B5E] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[#C89B5E] text-[#3A2215] hover:bg-[#F5E6D3] active:scale-[0.98] shadow-sm",
    secondary:
      "bg-[#6B4423]/25 text-[#F5E6D3] hover:bg-[#6B4423]/40 border border-[#C89B5E]/20 active:scale-[0.98]",
    outline:
      "border border-[#C89B5E] text-[#C89B5E] hover:bg-[#C89B5E] hover:text-[#3A2215] active:scale-[0.98]",
    ghost:
      "text-[#F5E6D3] hover:bg-[#F5E6D3]/10 hover:text-[#C89B5E]",
    dark:
      "bg-[#3A2215] text-[#F5E6D3] hover:bg-[#6B4423] border border-[#C89B5E]/30 active:scale-[0.98]",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "h-9 px-4 text-xs tracking-wider uppercase",
    md: "h-11 px-6 text-sm",
    lg: "h-13 px-8 text-base",
  };

  return cn(baseStyles, variants[variant], sizes[size], className);
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  as?: "button" | "span";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      as = "button",
      ...props
    },
    ref
  ) => {
    const Comp = (as || "button") as any;

    return (
      <Comp
        ref={ref}
        type={Comp === "button" ? (props.type || "button") : undefined}
        disabled={Comp === "button" ? (disabled || isLoading ? true : undefined) : undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";
