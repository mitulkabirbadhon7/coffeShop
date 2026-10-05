import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/lib/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { env } from "@/lib/env";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const siteUrl = env.NEXT_PUBLIC_SITE_URL || "https://chocobliss.coffee";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chocobliss Coffee Roastery | Artisanal Coffee & Cocoa Confections",
    template: "%s | Chocobliss Coffee Roastery",
  },
  description:
    "Experience small-batch specialty coffee and handcrafted single-origin chocolate creations in Banani, Dhaka. Ethical direct-trade sourcing and fresh daily roasting.",
  keywords: [
    "specialty coffee Dhaka",
    "coffee roastery Bangladesh",
    "single origin coffee",
    "bean to bar chocolate",
    "Banani coffee shop",
    "artisan espresso",
    "Chocobliss roastery",
  ],
  authors: [{ name: "Chocobliss Coffee Roastery", url: siteUrl }],
  creator: "Chocobliss Coffee Roastery",
  publisher: "Chocobliss Coffee Roastery",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Chocobliss Coffee Roastery | Artisanal Roasts & Cacao",
    description:
      "Small-batch specialty coffee roaster and handcrafted single-origin cacao atelier in Banani, Dhaka.",
    url: siteUrl,
    siteName: "Chocobliss Coffee Roastery",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/hero-poster.jpg",
        width: 1200,
        height: 630,
        alt: "Chocobliss Coffee Roastery Atelier Dhaka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chocobliss Coffee Roastery | Dhaka",
    description:
      "Small-batch specialty coffee roaster and handcrafted chocolate atelier in Banani, Dhaka.",
    images: ["/images/hero-poster.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-[#FDFBF7] text-[#2C221E] antialiased">
        {/* Accessible Keyboard Navigation Skip Link (WCAG 2.2 AA) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#2C221E] focus:text-[#FDFBF7] focus:font-medium focus:text-sm focus:rounded-md focus:shadow-2xl focus:border focus:border-[#D4A373] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
        >
          Skip to main content
        </a>

        <SmoothScroll>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
