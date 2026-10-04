"use client";

import * as React from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { sendContactMessageAction } from "@/lib/contact/actions";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
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
      const res = await sendContactMessageAction({
        name,
        email,
        subject,
        message,
        hp_field: honeypot,
      });

      setResult(res);
      if (res.success) {
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      }
    } catch {
      setResult({
        success: false,
        error: "Something went wrong sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 sm:p-10 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/20 shadow-sm space-y-6"
      noValidate
    >
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-bold text-[#2C221E]">
          Send Us a Direct Note
        </h2>
        <p className="text-xs text-[#5C4A3D] font-sans">
          We typically reply within 24 business hours during Dhaka roasting days.
        </p>
      </div>

      {/* Honeypot field (hidden from genuine users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact_hp">Leave empty</label>
        <input
          id="contact_hp"
          type="text"
          name="hp_field"
          tabIndex={-1}
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
        />
      </div>

      {/* Name & Email inputs in 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 text-left">
          <label
            htmlFor="contact-name"
            className="block text-xs font-medium text-[#2C221E] uppercase tracking-wider"
          >
            Your Full Name *
          </label>
          <input
            id="contact-name"
            type="text"
            required
            placeholder="e.g. Maya Chowdhury"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            className="w-full h-11 px-3.5 rounded-md bg-[#FDFBF7] border border-[#8A8179]/30 text-sm text-[#2C221E] placeholder-[#8A8179] focus:outline-none focus:ring-2 focus:ring-[#D4A373] focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-1.5 text-left">
          <label
            htmlFor="contact-email"
            className="block text-xs font-medium text-[#2C221E] uppercase tracking-wider"
          >
            Email Address *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            placeholder="maya@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="w-full h-11 px-3.5 rounded-md bg-[#FDFBF7] border border-[#8A8179]/30 text-sm text-[#2C221E] placeholder-[#8A8179] focus:outline-none focus:ring-2 focus:ring-[#D4A373] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Subject input */}
      <div className="space-y-1.5 text-left">
        <label
          htmlFor="contact-subject"
          className="block text-xs font-medium text-[#2C221E] uppercase tracking-wider"
        >
          Subject or Inquiry Topic *
        </label>
        <input
          id="contact-subject"
          type="text"
          required
          placeholder="e.g. Private Cupping Session or Whole Bean Order"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={isSubmitting}
          className="w-full h-11 px-3.5 rounded-md bg-[#FDFBF7] border border-[#8A8179]/30 text-sm text-[#2C221E] placeholder-[#8A8179] focus:outline-none focus:ring-2 focus:ring-[#D4A373] focus:border-transparent transition-all"
        />
      </div>

      {/* Message textarea */}
      <div className="space-y-1.5 text-left">
        <div className="flex items-center justify-between">
          <label
            htmlFor="contact-message"
            className="block text-xs font-medium text-[#2C221E] uppercase tracking-wider"
          >
            Your Message *
          </label>
          <span className="text-[11px] text-[#8A8179]">
            {message.length}/2000
          </span>
        </div>
        <textarea
          id="contact-message"
          rows={5}
          required
          placeholder="Share your inquiry, question, or catering details..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSubmitting}
          className="w-full p-3.5 rounded-md bg-[#FDFBF7] border border-[#8A8179]/30 text-sm text-[#2C221E] placeholder-[#8A8179] focus:outline-none focus:ring-2 focus:ring-[#D4A373] focus:border-transparent transition-all resize-y"
        />
      </div>

      {/* Feedback Alerts */}
      {result?.success && (
        <div
          role="alert"
          className="p-4 rounded-md bg-[#4ADE80]/15 border border-[#4ADE80]/30 text-[#4ADE80] text-xs flex items-center gap-3 animate-fade-in"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{result.message}</span>
        </div>
      )}

      {result?.error && (
        <div
          role="alert"
          className="p-4 rounded-md bg-[#F87171]/15 border border-[#F87171]/30 text-[#F87171] text-xs flex items-center gap-3 animate-fade-in"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      {/* Submit CTA */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        className="btn-cup-fill w-full h-12 bg-[#2C221E] text-[#FDFBF7] hover:text-[#1A1613] font-medium tracking-wide rounded-md inline-flex items-center justify-center gap-2"
      >
        <span>Send Message</span>
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
