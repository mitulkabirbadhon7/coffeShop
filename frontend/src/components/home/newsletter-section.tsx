"use client";

import * as React from "react";
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { subscribeNewsletterAction } from "@/lib/newsletter/actions";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const [email, setEmail] = React.useState("");
  const [honeypot, setHoneypot] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<{
    success?: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await subscribeNewsletterAction({
        email,
        hp_field: honeypot,
      });

      setResult(res);
      if (res.success) {
        setEmail("");
      }
    } catch {
      setResult({
        success: false,
        error: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 text-[#FDFBF7] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/posters/coffee-pour.jpg")' }}
      >
        <div className="absolute inset-0 bg-[#2C221E]/90 backdrop-blur-sm" />
      </div>
      {/* Subtle Roastery Background Glow Accent */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#D4A373]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#E07A5F]/10 blur-3xl pointer-events-none z-10"
        aria-hidden="true"
      />

      <div className="relative z-20 max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4A373]/30 bg-[#3A2D26]/40 text-[#D4A373] text-xs font-medium tracking-widest uppercase">
          <Mail className="w-3.5 h-3.5" />
          <span>The Roaster&apos;s Dispatch</span>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FDFBF7] leading-tight">
            Reserve Your Place at the Tasting Table
          </h2>
          <p className="text-sm sm:text-base text-[#FDFBF7]/80 leading-relaxed font-sans">
            Receive private notifications for limited single-origin micro-lots,
            seasonal chocolate confections, and weekend cupping sessions in Dhaka.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto space-y-4"
          noValidate
        >
          {/* Honeypot field (hidden from real users) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="newsletter_hp">Leave this empty</label>
            <input
              id="newsletter_hp"
              type="text"
              name="hp_field"
              tabIndex={-1}
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <input
                id="newsletter-email"
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-12 px-4 rounded-md bg-[#1A1613] border border-[#5C4A3D] text-[#FDFBF7] placeholder-[#8A8179] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A373] focus:border-transparent transition-all"
                aria-label="Email address for roastery dispatch newsletter"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="w-full sm:w-auto h-12 px-6 shrink-0 bg-[#D4A373] text-[#1A1613] hover:bg-[#FAEDCD] font-medium tracking-wide transition-all inline-flex items-center justify-center gap-2 rounded-md"
            >
              <span>Subscribe</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Feedback alerts */}
          {result?.success && (
            <div
              role="alert"
              className="p-3 rounded-md bg-[#4ADE80]/15 border border-[#4ADE80]/30 text-[#4ADE80] text-xs flex items-center justify-center gap-2 animate-fade-in"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{result.message}</span>
            </div>
          )}

          {result?.error && (
            <div
              role="alert"
              className="p-3 rounded-md bg-[#F87171]/15 border border-[#F87171]/30 text-[#F87171] text-xs flex items-center justify-center gap-2 animate-fade-in"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{result.error}</span>
            </div>
          )}

          <p className="text-[11px] text-[#8A8179] tracking-wide font-sans">
            Strict privacy. Zero spam. Unsubscribe at any time with one click.
          </p>
        </form>
      </div>
    </section>
  );
}
