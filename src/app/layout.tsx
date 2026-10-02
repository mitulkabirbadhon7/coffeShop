import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3A2215',
};

export const metadata: Metadata = {
  title: 'Chocobliss Coffee | Premium Handcrafted Roastery & Artisan Café',
  description:
    'Experience the opulent harmony of single-origin espresso and rich artisanal chocolate notes at Chocobliss Coffee Roastery.',
  keywords: [
    'coffee',
    'specialty coffee',
    'espresso',
    'chocobliss',
    'roastery',
    'latte art',
    'cold brew',
    'artisan coffee',
  ],
  authors: [{ name: 'Chocobliss Coffee Roastery' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="font-sans bg-coffee-dark text-coffee-cream antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
