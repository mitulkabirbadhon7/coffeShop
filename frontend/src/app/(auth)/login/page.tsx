import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        <CardDescription className="text-xs text-[#F5E6D3]/70">
          Sign in to view your order history and saved preferences.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#F5E6D3]/70 font-medium">
              Email Address
            </label>
            <Input type="email" placeholder="you@domain.com" required />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-[#F5E6D3]/70 font-medium">
                Password
              </label>
              <Link
                href="/login"
                className="text-xs text-[#C89B5E] hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <Input type="password" placeholder="••••••••" required />
          </div>

          <Button type="button" variant="primary" className="w-full mt-2">
            <span>Sign In</span>
          </Button>
        </form>

        <div className="pt-4 text-center text-xs text-[#F5E6D3]/70 border-t border-[#C89B5E]/15">
          <span>New to Chocobliss? </span>
          <Link href="/signup" className="text-[#C89B5E] font-medium hover:underline">
            Create an Account
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
