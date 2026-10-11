"use client";

import * as React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log safe error telemetry without exposing secrets
    console.error("Application boundary caught error:", error.message);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-xl border border-rose-500/20 bg-[#3A2215]/90 space-y-6 shadow-xl backdrop-blur-sm">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-[#F5E6D3]">
            Something Went Awry
          </h2>
          <p className="text-sm text-[#F5E6D3]/70 font-sans leading-relaxed">
            We encountered an unexpected condition while serving this page. Please attempt to refresh or return to the main roastery.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            variant="primary"
            className="w-full sm:w-auto inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              className="w-full sm:w-auto inline-flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Back Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
