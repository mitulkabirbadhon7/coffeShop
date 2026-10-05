"use client";

import * as React from "react";
import Link from "next/link";
import { resetPasswordAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export function ResetPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [submittedMessage, setSubmittedMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await resetPasswordAction({ email });
      if (result.error) {
        setErrorMessage(result.error);
      } else {
        setSubmittedMessage(
          result.message ||
            "If an account exists for that email, a password reset link has been dispatched."
        );
      }
    } catch {
      setErrorMessage("Unable to process request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submittedMessage) {
    return (
      <div className="p-8 rounded-xl bg-[#2C221E] border border-[#C89B5E]/30 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-full bg-[#C89B5E]/15 border border-[#C89B5E]/40 flex items-center justify-center text-[#C89B5E] mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-2xl font-bold text-[#F5E6D3]">
            Link Dispatched
          </h3>
          <p className="text-sm text-[#F5E6D3]/75 font-sans leading-relaxed">
            {submittedMessage}
          </p>
        </div>
        <div className="pt-2">
          <Link href="/login">
            <Button variant="primary">Return to Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-[#F5E6D3]/75 font-medium">
            Account Email Address
          </label>
          <Input
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            error={errorMessage || undefined}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          <span>Send Reset Link</span>
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-[#F5E6D3]/70 border-t border-[#C89B5E]/15 font-sans">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-[#C89B5E] font-medium hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
