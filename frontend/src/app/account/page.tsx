import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Shield, Clock } from "lucide-react";

export const metadata = {
  title: "Account Overview | Chocobliss Coffee Roastery",
};

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-bold text-[#2C221E]">
          Account Sanctuary
        </h1>
        <p className="text-sm text-[#2C221E]/70 font-sans">
          Manage your customer profile, order history, and tasting preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="bg-white border border-[#2C221E]/10 shadow-sm">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-[#C89B5E]/10 border border-[#C89B5E]/20 flex items-center justify-center text-[#C89B5E] mb-2">
              <User className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg text-[#2C221E]">Profile Status</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[#2C221E]/75 font-sans space-y-2">
            <p>Customer Profile Active</p>
            <p className="text-xs text-[#2C221E]/60">Email verification required to place orders.</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#2C221E]/10 shadow-sm">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-[#6B4423]/10 border border-[#C89B5E]/20 flex items-center justify-center text-[#6B4423] mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <CardTitle className="text-lg text-[#2C221E]">Pickup Hours</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[#2C221E]/75 font-sans space-y-2">
            <p>Daily 8:00 AM – 10:00 PM</p>
            <p className="text-xs text-[#2C221E]/60">House 14, Road 7, Banani, Dhaka</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
