'use client';

import React from 'react';
import Link from 'next/link';

interface OrderButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  variant?: 'primary' | 'gold' | 'outline';
}

export const OrderButton: React.FC<OrderButtonProps> = ({
  label = 'Order Now',
  href,
  onClick,
  className = '',
  ariaLabel,
  variant = 'gold',
}) => {
  const effectiveAriaLabel = ariaLabel || label;

  const baseStyles =
    'group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full font-medium tracking-wide text-sm transition-all duration-300 shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-coffee-gold focus:ring-offset-2 focus:ring-offset-coffee-dark';

  const variants = {
    gold: 'bg-coffee-gold hover:bg-[#d6a96e] text-coffee-dark shadow-coffee-gold/20 hover:shadow-coffee-gold/40 hover:-translate-y-0.5',
    primary: 'bg-coffee-accent hover:bg-[#b05b32] text-coffee-cream shadow-coffee-accent/20 hover:shadow-coffee-accent/40 hover:-translate-y-0.5',
    outline: 'border border-coffee-gold/60 text-coffee-gold hover:bg-coffee-gold hover:text-coffee-dark shadow-transparent hover:-translate-y-0.5',
  };

  const buttonContent = (
    <>
      <span className="relative z-10 font-semibold">{label}</span>

      {/* Interactive Filling Coffee Cup Icon */}
      <span
        className="relative flex items-center justify-center w-5 h-5"
        aria-hidden="true"
      >
        {/* Steam particles visible on group-hover */}
        <span className="absolute -top-2 left-1.5 w-0.5 h-1.5 bg-coffee-cream/80 rounded-full opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-500 ease-out" />
        <span className="absolute -top-2.5 left-2.5 w-0.5 h-2 bg-coffee-cream/80 rounded-full opacity-0 group-hover:opacity-100 group-hover:-translate-y-1.5 transition-all duration-700 ease-out delay-75" />

        {/* Cup Outline SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 relative z-10 transition-colors duration-300"
        >
          {/* Cup outline */}
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>

        {/* Masked liquid filling up from bottom to top */}
        <span className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <span className="relative w-3.5 h-3.5 rounded-b-sm overflow-hidden mb-0.5 mr-0.5">
            <span className="absolute inset-0 bg-coffee-dark group-hover:bg-[#4a2e1c] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-b-sm" />
          </span>
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={effectiveAriaLabel}
        className={`${baseStyles} ${variants[variant]} ${className}`}
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={effectiveAriaLabel}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {buttonContent}
    </button>
  );
};

export default OrderButton;
