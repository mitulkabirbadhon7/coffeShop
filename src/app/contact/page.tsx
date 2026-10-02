'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Coffee, Sparkles } from 'lucide-react';
import VideoBackground from '@/components/ui/VideoBackground';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Table Reservation',
    guests: '2',
    date: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle steam/coffee video loop in background */}
      <VideoBackground
        srcWebm="/videos/steam-cup.webm"
        srcMp4="/videos/steam-cup.mp4"
        poster="/images/contact-poster.png"
        overlayClassName="bg-gradient-to-b from-coffee-dark/90 via-coffee-dark/85 to-coffee-dark/95"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coffee-gold/15 border border-coffee-gold/30 text-coffee-gold text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Lounge & Private Reservations
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-coffee-cream leading-tight mb-4">
            Visit Our Artisan Roastery
          </h1>
          <p className="text-base sm:text-lg text-coffee-cream/80 max-w-2xl mx-auto font-light">
            Reserve an intimate table in our sunlit lounge, inquire about private coffee tasting cuppings, or send our baristas a note.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Roastery Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 rounded-3xl bg-coffee-dark/75 backdrop-blur-xl border border-coffee-gold/25 p-8 sm:p-10 shadow-2xl space-y-8"
          >
            <div>
              <h2 className="font-serif text-2xl font-bold text-coffee-gold mb-2">
                Chocobliss Sanctuary
              </h2>
              <p className="text-sm text-coffee-cream/80 leading-relaxed">
                Step into the warmth of fresh grinds and velvety dark chocolate aromas. Free high-speed Wi-Fi, acoustic playlist, and curated espresso bar.
              </p>
            </div>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-coffee-gold/15 border border-coffee-gold/30 flex items-center justify-center text-coffee-gold shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-coffee-cream">Our Location</h3>
                  <p className="text-coffee-cream/70 text-xs mt-0.5">
                    428 Artisan Way, Cocoa Square, Seattle, WA 98101
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-coffee-gold/15 border border-coffee-gold/30 flex items-center justify-center text-coffee-gold shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-coffee-cream">Direct Phone</h3>
                  <p className="text-coffee-cream/70 text-xs mt-0.5">
                    +1 (555) 246-2654
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-coffee-gold/15 border border-coffee-gold/30 flex items-center justify-center text-coffee-gold shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-coffee-cream">Email</h3>
                  <p className="text-coffee-cream/70 text-xs mt-0.5">
                    reservations@chocoblisscoffee.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-coffee-gold/15 border border-coffee-gold/30 flex items-center justify-center text-coffee-gold shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-coffee-cream">Service Hours</h3>
                  <p className="text-coffee-cream/70 text-xs mt-0.5">
                    Mon - Fri: 6:30 AM – 8:00 PM <br />
                    Sat - Sun: 7:00 AM – 9:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-coffee-medium/20 border border-coffee-gold/15">
              <span className="text-xs font-semibold text-coffee-gold uppercase tracking-wider block mb-1">
                Coffee Cupping Sessions
              </span>
              <p className="text-xs text-coffee-cream/70 leading-relaxed">
                Join our Saturday 11 AM blind sensory cupping to sample 6 micro-lot origins side-by-side with our Q-grader.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Reservation / Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 rounded-3xl bg-coffee-dark/85 backdrop-blur-xl border border-coffee-gold/25 p-8 sm:p-12 shadow-2xl"
          >
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-coffee-gold/20 text-coffee-gold border border-coffee-gold/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-coffee-cream">
                  Your Table is Noted!
                </h3>
                <p className="text-coffee-cream/80 max-w-md mx-auto text-sm leading-relaxed">
                  Thank you, <span className="text-coffee-gold font-semibold">{formData.name}</span>. Our café concierge will confirm your reservation within an hour via email or text.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      inquiryType: 'Table Reservation',
                      guests: '2',
                      date: '',
                      message: '',
                    });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full bg-coffee-gold text-coffee-dark font-semibold text-sm hover:bg-[#d6a96e] transition-colors"
                >
                  Make Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-coffee-cream">
                  Reserve a Table or Reach Out
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold uppercase tracking-wider text-coffee-gold mb-2"
                    >
                      Your Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jordan Wells"
                      className="w-full px-4 py-3 rounded-xl bg-coffee-medium/20 border border-coffee-gold/30 text-coffee-cream placeholder-coffee-cream/40 focus:outline-none focus:ring-2 focus:ring-coffee-gold text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold uppercase tracking-wider text-coffee-gold mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jordan@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-coffee-medium/20 border border-coffee-gold/30 text-coffee-cream placeholder-coffee-cream/40 focus:outline-none focus:ring-2 focus:ring-coffee-gold text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs font-semibold uppercase tracking-wider text-coffee-gold mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-coffee-medium/20 border border-coffee-gold/30 text-coffee-cream placeholder-coffee-cream/40 focus:outline-none focus:ring-2 focus:ring-coffee-gold text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-inquiry"
                      className="block text-xs font-semibold uppercase tracking-wider text-coffee-gold mb-2"
                    >
                      Request Type
                    </label>
                    <select
                      id="contact-inquiry"
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-coffee-dark border border-coffee-gold/30 text-coffee-cream focus:outline-none focus:ring-2 focus:ring-coffee-gold text-sm transition-all"
                    >
                      <option value="Table Reservation">Table Reservation</option>
                      <option value="Private Cupping Event">Private Cupping Event</option>
                      <option value="Catering & Pop-up">Catering & Pop-up</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-guests"
                      className="block text-xs font-semibold uppercase tracking-wider text-coffee-gold mb-2"
                    >
                      Guests
                    </label>
                    <select
                      id="contact-guests"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-coffee-dark border border-coffee-gold/30 text-coffee-cream focus:outline-none focus:ring-2 focus:ring-coffee-gold text-sm transition-all"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3-4">3 - 4 People</option>
                      <option value="5-8">5 - 8 People</option>
                      <option value="8+">8+ Group</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-date"
                    className="block text-xs font-semibold uppercase tracking-wider text-coffee-gold mb-2"
                  >
                    Preferred Date & Time
                  </label>
                  <input
                    id="contact-date"
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. This Saturday at 10:30 AM"
                    className="w-full px-4 py-3 rounded-xl bg-coffee-medium/20 border border-coffee-gold/30 text-coffee-cream placeholder-coffee-cream/40 focus:outline-none focus:ring-2 focus:ring-coffee-gold text-sm transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold uppercase tracking-wider text-coffee-gold mb-2"
                  >
                    Special Notes / Dietary Preferences
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us if you prefer oat/almond milk, window seating, or celebration notes..."
                    className="w-full px-4 py-3 rounded-xl bg-coffee-medium/20 border border-coffee-gold/30 text-coffee-cream placeholder-coffee-cream/40 focus:outline-none focus:ring-2 focus:ring-coffee-gold text-sm transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Submit table reservation or inquiry"
                  className="w-full py-4 rounded-full bg-coffee-gold hover:bg-[#d6a96e] text-coffee-dark font-bold text-sm tracking-wide shadow-lg shadow-coffee-gold/25 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <span>Send Reservation Request</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
