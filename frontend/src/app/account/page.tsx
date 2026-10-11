import { requireUser } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/auth/actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Clock, LogOut, CheckCircle2, Mail } from "lucide-react";

export const metadata = {
  title: "Account Overview | Chocobliss Coffee Roastery",
};

export default async function AccountPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Patron";
  const role = profile?.role || "USER";
  const emailConfirmed = !!user.email_confirmed_at;

  return (
    <div className="space-y-8">
      {/* Welcome header & Sign Out */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2C221E]/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-bold text-[#2C221E]">
              Greetings, {displayName}
            </h1>
            <Badge variant={role === "ADMIN" ? "gold" : "outline"} className="text-xs">
              {role === "ADMIN" ? "Admin Staff" : "Customer Patron"}
            </Badge>
          </div>
          <p className="text-xs text-[#2C221E]/70 font-sans">
            Authenticated via Supabase Auth ({user.email})
          </p>
        </div>

        <form action={signOutAction}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="inline-flex items-center gap-2 border-[#2C221E]/20 text-[#2C221E] hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </form>
      </div>

      {/* Account Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="bg-white border border-[#2C221E]/10 shadow-sm">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-[#C89B5E]/10 border border-[#C89B5E]/20 flex items-center justify-center text-[#C89B5E] mb-2">
              <User className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg text-[#2C221E]">Profile Credentials</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[#2C221E]/75 font-sans space-y-3">
            <div className="flex items-center justify-between text-xs py-1 border-b border-[#2C221E]/5">
              <span className="text-[#2C221E]/60">Full Name</span>
              <span className="font-semibold text-[#2C221E]">{displayName}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-[#2C221E]/5">
              <span className="text-[#2C221E]/60">Email</span>
              <span className="font-mono text-[#2C221E]">{user.email}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-[#2C221E]/60">Verification Status</span>
              {emailConfirmed ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Confirmation Pending</span>
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#2C221E]/10 shadow-sm">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-[#6B4423]/10 border border-[#C89B5E]/20 flex items-center justify-center text-[#6B4423] mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg text-[#2C221E]">Roastery Pickup Hub</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[#2C221E]/75 font-sans space-y-3">
            <div className="space-y-1">
              <p className="font-semibold text-[#2C221E]">Banani Atelier</p>
              <p className="text-xs text-[#2C221E]/70 leading-relaxed">
                House 14, Road 7, Banani, Dhaka, Bangladesh
              </p>
            </div>
            <p className="text-xs text-[#C89B5E] font-medium pt-1">
              Open Daily: 8:00 AM – 10:00 PM
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
