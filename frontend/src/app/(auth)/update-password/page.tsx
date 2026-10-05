import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata = {
  title: "Set New Password | Chocobliss Coffee Roastery",
  description: "Establish a secure new password for your customer account.",
};

export default function UpdatePasswordPage() {
  return (
    <Card className="border border-[#C89B5E]/30 bg-[#2C221E] shadow-xl">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-serif text-[#F5E6D3]">
          Create New Password
        </CardTitle>
        <CardDescription className="text-xs text-[#F5E6D3]/70 font-sans">
          Choose a strong password with at least 10 characters, an uppercase letter, and a number.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <UpdatePasswordForm />
      </CardContent>
    </Card>
  );
}
