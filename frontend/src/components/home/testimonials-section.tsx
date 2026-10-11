import * as React from "react";
import Link from "next/link";
import { Star, Quote, Award } from "lucide-react";
import { getPublishedTestimonials } from "@/lib/data/content.data";

export async function TestimonialsSection() {
  const testimonials = await getPublishedTestimonials();

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#FDFBF7] text-[#2C221E] border-t border-[#8A8179]/15">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAEDCD] text-[#5C4A3D] text-xs font-medium tracking-widest uppercase">
            <Award className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>Patron Experiences</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#2C221E]">
            Words From Our Guests
          </h2>

          <p className="text-sm sm:text-base text-[#5C4A3D] font-sans leading-relaxed">
            Honest reflections from Dhaka&apos;s coffee connoisseurs, daily regulars,
            and chocolate devotees.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => {
            const stars = Array.from({ length: 5 });

            return (
              <div
                key={testimonial.id}
                className="flex flex-col justify-between rounded-lg border border-[#8A8179]/20 bg-[#F4F1EA] p-7 shadow-sm hover:border-[#D4A373]/50 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#E07A5F]">
                      {stars.map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-current text-[#D4A373]"
                        />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 text-[#8A8179]/40" />
                  </div>

                  {/* Feedback text */}
                  <p className="font-serif text-sm sm:text-base text-[#2C221E] leading-relaxed italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-6 mt-6 border-t border-[#8A8179]/15">
                  <p className="font-serif font-bold text-sm text-[#2C221E]">
                    {testimonial.name}
                  </p>
                  {testimonial.role_or_context && (
                    <p className="text-xs text-[#5C4A3D] font-sans">
                      {testimonial.role_or_context}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link
            href="/reviews"
            className="px-6 py-2.5 rounded-md bg-[#2C221E] text-[#FDFBF7] text-sm font-medium hover:bg-[#3A2D26] transition-colors"
          >
            See All Reviews
          </Link>
          <Link
            href="/login?returnUrl=/reviews/new"
            className="px-6 py-2.5 rounded-md border border-[#2C221E] text-[#2C221E] text-sm font-medium hover:bg-[#2C221E] hover:text-[#FDFBF7] transition-colors"
          >
            Give Review
          </Link>
        </div>
      </div>
    </section>
  );
}
