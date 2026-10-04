import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Create Account | Chocobliss Coffee Roastery",
  description: "Join Chocobliss for artisanal coffee ordering and tasting perks.",
};

export default function SignupPage() {
  return (
    <Card className="border border-[#C89B5E]/30 bg-[#2C221E] shadow-xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-serif text-[#F5E6D3]">
          Join the Roastery
        </CardTitle>
        <CardDescription className="text-xs text-[#F5E6D3]/70">
          Create an account for seamless pickup orders and tasting invitations.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#F5E6D3]/70 font-medium">
              Full Name
            </label>
            <Input placeholder="e.g. Nusrat Jahan" required />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#F5E6D3]/70 font-medium">
              Email Address
            </label>
            <Input type="email" placeholder="you@domain.com" required />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#F5E6D3]/70 font-medium">
              Password (min. 10 chars)
            </label>
            <Input type="password" placeholder="••••••••••" required />
          </div>

          <Button type="button" variant="primary" className="w-full mt-2">
            <span>Create Account</span>
          </Button>
        </form>

        <div className="pt-4 text-center text-xs text-[#F5E6D3]/70 border-t border-[#C89B5E]/15">
          <span>Already registered? </span>
          <Link href="/login" className="text-[#C89B5E] font-medium hover:underline">
            Sign In Instead
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
