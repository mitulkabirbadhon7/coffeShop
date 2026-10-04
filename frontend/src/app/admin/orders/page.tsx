import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-bold text-[#F5E6D3]">
          Order Management Queue
        </h1>
        <p className="text-sm text-[#F5E6D3]/70 font-sans">
          Review incoming pickup orders and transition statuses according to state machine rules.
        </p>
      </div>

      <Card className="bg-[#2C221E] border border-[#5C4A3D]/40 p-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#1A1613] border border-[#D4A373]/30 flex items-center justify-center text-[#D4A373] mx-auto">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="font-serif text-xl font-bold text-[#F5E6D3]">
            No Orders In Queue
          </h3>
          <p className="text-xs text-[#F5E6D3]/60 font-sans leading-relaxed">
            New pickup orders placed through the public menu will appear here for barista confirmation and status updates.
          </p>
        </div>
      </Card>
    </div>
  );
}
