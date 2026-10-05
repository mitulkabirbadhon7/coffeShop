import { Suspense } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AuthTabs } from "@/components/auth/auth-tabs";

export const metadata = {
  title: "Sign In | Chocobliss Coffee Roastery",
  description: "Access your customer orders and roastery account.",
};

export default function LoginPage() {
  return (
    <Card className="border border-[#C89B5E]/30 bg-[#2C221E] shadow-xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-serif text-[#F5E6D3]">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-xs text-[#F5E6D3]/70 font-sans">
          Sign in to view your order history and saved preferences.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<div className="text-center py-6 text-xs text-[#F5E6D3]/60">Loading form...</div>}>
          <AuthTabs />
        </Suspense>
      </CardContent>
    </Card>
  );
}
