import Link from 'next/link';
import VideoBackground from '@/components/ui/VideoBackground';
import OrderButton from '@/components/ui/OrderButton';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden">
      {/* 404 Coffee Spill Video Background */}
      <VideoBackground
        srcWebm="/videos/coffee-spill.webm"
        srcMp4="/videos/coffee-spill.mp4"
        poster="/images/spill-poster.png"
        overlayClassName="bg-gradient-to-t from-coffee-dark via-coffee-dark/80 to-coffee-dark/60"
      />

      <div className="relative z-10 max-w-xl mx-auto text-center py-20 px-6 sm:px-10 rounded-3xl bg-coffee-dark/60 backdrop-blur-xl border border-coffee-gold/25 shadow-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-coffee-gold/15 text-coffee-gold border border-coffee-gold/30 mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-coffee-gold mb-2">
          Error 404
        </p>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-coffee-cream mb-4">
          A Little Spill on the Counter
        </h1>

        <p className="text-coffee-cream/80 text-base sm:text-lg leading-relaxed mb-8">
          The page or brew you are searching for has disappeared like steam in the morning breeze. Let us brew you something fresh instead.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <OrderButton
            href="/"
            label="Return to Café Home"
            variant="gold"
            ariaLabel="Return to Café Home Page"
          />
          <Link
            href="/products"
            aria-label="Browse Coffee Menu"
            className="px-6 py-3.5 rounded-full border border-coffee-gold/40 text-coffee-gold hover:bg-coffee-gold/10 transition-colors text-sm font-semibold tracking-wide"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
