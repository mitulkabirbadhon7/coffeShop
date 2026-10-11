"use client";

import * as React from "react";
import { User, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProfileAction } from "@/lib/account/actions";
import { Button } from "@/components/ui/button";

export interface ProfileEditFormProps {
  initialDisplayName: string;
  email: string;
}

export function ProfileEditForm({
  initialDisplayName,
  email,
}: ProfileEditFormProps) {
  const [displayName, setDisplayName] = React.useState(initialDisplayName);
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
      const res = await updateProfileAction({ display_name: displayName });
      setResult(res);
    } catch {
      setResult({ success: false, error: "Failed to update profile." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5 text-left">
        <label
          htmlFor="display-name"
          className="block text-xs font-medium text-[#2C221E] uppercase tracking-wider"
        >
          Full Display Name
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-[#8A8179] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="display-name"
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isSubmitting}
            className="w-full h-11 pl-10 pr-4 rounded-md bg-[#FDFBF7] border border-[#8A8179]/30 text-sm text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#D4A373] focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="space-y-1.5 text-left">
        <label className="block text-xs font-medium text-[#8A8179] uppercase tracking-wider">
          Email Address (Managed via Supabase Auth)
        </label>
        <input
          type="email"
          disabled
          value={email}
          className="w-full h-11 px-3.5 rounded-md bg-[#F4F1EA] border border-[#8A8179]/20 text-sm text-[#8A8179] cursor-not-allowed"
        />
      </div>

      {result?.success && (
        <div
          role="alert"
          className="p-3 rounded-md bg-[#4ADE80]/15 border border-[#4ADE80]/30 text-[#4ADE80] text-xs flex items-center gap-2 animate-fade-in"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{result.message}</span>
        </div>
      )}

      {result?.error && (
        <div
          role="alert"
          className="p-3 rounded-md bg-[#F87171]/15 border border-[#F87171]/30 text-[#F87171] text-xs flex items-center gap-2 animate-fade-in"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{result.error}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="sm"
        isLoading={isSubmitting}
        className="btn-cup-fill bg-[#2C221E] text-[#FDFBF7] hover:text-[#1A1613] rounded-md h-10 px-5 text-xs font-medium"
      >
        <span>Save Profile Changes</span>
      </Button>
    </form>
  );
}
