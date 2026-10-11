import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design Tokens from docs/DESIGN.md
        espresso: '#2C221E',
        oat: '#FDFBF7',
        latte: '#D4A373',
        cream: '#FAEDCD',
        terracotta: '#E07A5F',
        stone: '#F4F1EA',
        ash: '#8A8179',
        bark: '#5C4A3D',
        charcoal: '#1A1613',
        // UIUX.md legacy palette support
        coffee: {
          dark: '#3A2215',
          medium: '#6B4423',
          cream: '#F5E6D3',
          gold: '#C89B5E',
          accent: '#A0522D',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(44,34,30,0.06)',
        md: '0 4px 12px rgba(44,34,30,0.08)',
        lg: '0 8px 24px rgba(44,34,30,0.10)',
      },
      borderRadius: {
        sm: '2px',
        md: '4px',
        lg: '8px',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out forwards',
        float: 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
