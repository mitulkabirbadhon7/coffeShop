"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleAuthButton } from "./google-auth-button";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || undefined;
  const initialError = searchParams.get("error");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(
    initialError ? "Authentication was not completed. Please try again." : null
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await signInAction({ email, password }, returnUrl);
      if (result?.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      // In Next.js, redirect() throws an internal redirection error which should bubble up
      const isRedirect =
        typeof err === "object" &&
        err !== null &&
        "digest" in err &&
        typeof (err as { digest: string }).digest === "string" &&
        (err as { digest: string }).digest.startsWith("NEXT_REDIRECT");

      if (isRedirect) {
        throw err;
      }

      setErrorMessage(
        err instanceof Error ? err.message : "Unable to sign in. Please try again."
      );
      setIsLoading(false);
    }
  };

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
            Email Address
          </label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-wider text-[#F5E6D3]/75 font-medium">
              Password
            </label>
            <Link
              href="/reset-password"
              className="text-xs text-[#C89B5E] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          <span>Sign In to Roastery</span>
        </Button>
      </form>

      {/* Quick Demo Access Buttons */}
      <div className="pt-2 border-t border-[#C89B5E]/15 text-center space-y-2">
        <p className="text-[11px] text-[#F5E6D3]/50">Quick demo login:</p>
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => {
              setEmail("admin@chocobliss.com");
              setPassword("roaster123");
            }}
            className="text-xs px-3 py-1.5 rounded-md bg-[#1A1613] text-[#D4A373] border border-[#D4A373]/30 hover:bg-[#3D3028] transition-colors"
          >
            Admin Demo
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail("patron@chocobliss.com");
              setPassword("patron123");
            }}
            className="text-xs px-3 py-1.5 rounded-md bg-[#1A1613] text-[#F5E6D3]/80 border border-[#8A8179]/30 hover:bg-[#3D3028] transition-colors"
          >
            Customer Demo
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#C89B5E]/20 w-full" />
        <span className="bg-[#2C221E] px-3 text-[11px] uppercase tracking-wider text-[#F5E6D3]/50 absolute font-sans">
          Or continue with
        </span>
      </div>

      <GoogleAuthButton mode="signin" />
    </div>
  );
}
