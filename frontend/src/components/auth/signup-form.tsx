"use client";

import * as React from "react";
import Link from "next/link";
import { signUpAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleAuthButton } from "./google-auth-button";
import { AlertCircle, CheckCircle2, Mail, Eye, EyeOff } from "lucide-react";

export function SignupForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successInfo, setSuccessInfo] = React.useState<{
    needsConfirmation: boolean;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [marketingAccepted, setMarketingAccepted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await signUpAction({ 
        name, 
        email, 
        password,
        termsAccepted,
        marketingAccepted
      });
      if (result.error) {
        setErrorMessage(result.error);
      } else if (result.success) {
        setSuccessInfo({
          needsConfirmation: !!result.needsConfirmation,
          message:
            result.message ||
            "Account registered successfully. Please check your inbox for verification.",
        });
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successInfo) {
    return (
      <div className="p-8 rounded-xl bg-[#2C221E] border border-[#C89B5E]/30 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-full bg-[#C89B5E]/15 border border-[#C89B5E]/40 flex items-center justify-center text-[#C89B5E] mx-auto">
          <Mail className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-2xl font-bold text-[#F5E6D3]">
            Verify Your Email
          </h3>
          <p className="text-sm text-[#F5E6D3]/75 font-sans leading-relaxed">
            {successInfo.message}
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
      {errorMessage && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-start gap-3 text-sm text-rose-300">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-[#F5E6D3]/75 font-medium">
            Full Name
          </label>
          <Input
            placeholder="e.g. Nusrat Jahan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-[#F5E6D3]/75 font-medium">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-[#F5E6D3]/75 font-medium">
            Password (min. 6 characters)
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5E6D3]/50 hover:text-[#C89B5E] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-3">
            <input 
              type="checkbox" 
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-[#C89B5E]/30 bg-[#1A1613] text-[#C89B5E] focus:ring-[#C89B5E] focus:ring-offset-[#2C221E]" 
            />
            <span className="text-xs text-[#F5E6D3]/70 font-sans leading-relaxed">
              I accept the <Link href="/terms" className="text-[#C89B5E] hover:underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-[#C89B5E] hover:underline">Privacy Policy</Link>.
            </span>
          </label>
          
          <label className="flex items-start gap-3">
            <input 
              type="checkbox" 
              checked={marketingAccepted}
              onChange={(e) => setMarketingAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-[#C89B5E]/30 bg-[#1A1613] text-[#C89B5E] focus:ring-[#C89B5E] focus:ring-offset-[#2C221E]" 
            />
            <span className="text-xs text-[#F5E6D3]/70 font-sans leading-relaxed">
              I would like to receive order updates and promotional offers via email or SMS.
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          <span>Create Account</span>
        </Button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#C89B5E]/20 w-full" />
        <span className="bg-[#2C221E] px-3 text-[11px] uppercase tracking-wider text-[#F5E6D3]/50 absolute font-sans">
          Or register with
        </span>
      </div>

      <GoogleAuthButton mode="signup" />
    </div>
  );
}
