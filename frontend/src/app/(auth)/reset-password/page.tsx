import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Reset Password | Chocobliss Coffee Roastery",
  description: "Request a password reset link for your customer account.",
};

export default function ResetPasswordPage() {
  return (
    <Card className="border border-[#C89B5E]/30 bg-[#2C221E] shadow-xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-serif text-[#F5E6D3]">
          Reset Password
        </CardTitle>
        <CardDescription className="text-xs text-[#F5E6D3]/70 font-sans">
          Enter your registered email address to receive password reset instructions.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
}
