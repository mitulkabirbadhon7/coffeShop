import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Coffee, ShoppingBag, ShieldCheck, Database } from "lucide-react";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-bold text-[#F5E6D3]">
          Dashboard Overview
        </h1>
        <p className="text-sm text-[#F5E6D3]/70 font-sans">
          Central management console for Chocobliss roasts, orders, and content.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#2C221E] border border-[#5C4A3D]/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-[#D4A373]">
              Active Roasts
            </CardTitle>
            <Coffee className="w-4 h-4 text-[#D4A373]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-[#F5E6D3]">22</div>
            <p className="text-xs text-[#F5E6D3]/60 font-sans mt-1">5 Categories Active</p>
          </CardContent>
        </Card>

        <Card className="bg-[#2C221E] border border-[#5C4A3D]/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-[#D4A373]">
              Order Queue
            </CardTitle>
            <ShoppingBag className="w-4 h-4 text-[#D4A373]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-[#F5E6D3]">0</div>
            <p className="text-xs text-[#F5E6D3]/60 font-sans mt-1">Pending Confirmation</p>
          </CardContent>
        </Card>

        <Card className="bg-[#2C221E] border border-[#5C4A3D]/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-[#D4A373]">
              RLS Security
            </CardTitle>
            <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-[#4ADE80]">Active</div>
            <p className="text-xs text-[#F5E6D3]/60 font-sans mt-1">11 Tables Enforced</p>
          </CardContent>
        </Card>

        <Card className="bg-[#2C221E] border border-[#5C4A3D]/40">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-[#D4A373]">
              Database Status
            </CardTitle>
            <Database className="w-4 h-4 text-[#D4A373]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-[#F5E6D3]">Connected</div>
            <p className="text-xs text-[#F5E6D3]/60 font-sans mt-1">Supabase Remote</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
