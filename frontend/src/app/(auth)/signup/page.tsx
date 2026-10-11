import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SignupForm } from "@/components/auth/signup-form";

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
        <CardDescription className="text-xs text-[#F5E6D3]/70 font-sans">
          Create an account for seamless pickup orders and tasting invitations.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  );
}
