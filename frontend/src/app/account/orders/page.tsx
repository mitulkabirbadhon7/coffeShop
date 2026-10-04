import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Order History | Chocobliss Coffee Roastery",
};

export default function AccountOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-bold text-[#2C221E]">
          Pickup Orders
        </h1>
        <p className="text-sm text-[#2C221E]/70 font-sans">
          Review your current brews in preparation and past pickup orders.
        </p>
      </div>

      <Card className="bg-white border border-[#2C221E]/10 p-12 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#6B4423]/10 border border-[#C89B5E]/30 flex items-center justify-center text-[#6B4423] mx-auto">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <CardTitle className="text-xl text-[#2C221E]">No Orders Placed Yet</CardTitle>
          <p className="text-xs text-[#2C221E]/70 font-sans leading-relaxed">
            When you place a pickup order from our menu, you can track preparation status and view receipts here.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/products">
            <Button variant="primary" className="inline-flex items-center gap-2">
              <span>Browse Coffee Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
