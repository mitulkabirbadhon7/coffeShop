import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Verify Email | Chocobliss Coffee Roastery",
  description: "Check your email to verify your Chocobliss customer account.",
};

export default function VerifyEmailPage() {
  return (
    <Card className="border border-[#C89B5E]/30 bg-[#2C221E] shadow-xl text-center">
      <CardHeader className="space-y-3">
        <div className="w-14 h-14 rounded-full bg-[#C89B5E]/15 border border-[#C89B5E]/40 flex items-center justify-center text-[#C89B5E] mx-auto">
          <Mail className="w-7 h-7" />
        </div>
        <CardTitle className="text-2xl font-serif text-[#F5E6D3]">
          Check Your Inbox
        </CardTitle>
        <CardDescription className="text-xs text-[#F5E6D3]/75 font-sans leading-relaxed">
          We have dispatched a verification link to your email address. Please click the link to confirm your account and unlock pickup ordering.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <Link href="/login">
          <Button variant="primary" className="w-full">
            <span>Proceed to Sign In</span>
          </Button>
        </Link>

        <div className="pt-2 text-center text-xs text-[#F5E6D3]/60 font-sans">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[#C89B5E] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
