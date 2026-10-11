import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { formatBdt, formatDate, getOrderStatusMeta } from "@/lib/utils/formatters";
import { ShoppingBag, ArrowRight, Clock, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pickup Orders | Chocobliss Coffee Roastery",
  description: "Track your past and active specialty coffee pickup orders.",
};

export default async function AccountOrdersPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  const userOrders = orders || [];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-bold text-[#2C221E]">
          Pickup Orders
        </h1>
        <p className="text-xs sm:text-sm text-[#5C4A3D] font-sans">
          Track preparation status and view receipts for your Dhaka roastery pickup orders.
        </p>
      </div>

      {userOrders.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/20 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#FAEDCD] border border-[#D4A373]/30 flex items-center justify-center text-[#D4A373] mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h2 className="font-serif text-xl font-bold text-[#2C221E]">
              No Orders Placed Yet
            </h2>
            <p className="text-xs text-[#5C4A3D] font-sans leading-relaxed">
              When you reserve a specialty brew or pastry from our menu, you can track its preparation status right here.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/products">
              <Button
                variant="primary"
                size="md"
                className="bg-[#2C221E] text-[#FDFBF7] hover:text-[#1A1613] rounded-md text-xs font-medium h-10 px-5 inline-flex items-center gap-2"
              >
                <span>Browse Roastery Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => {
            const statusMeta = getOrderStatusMeta(order.status);
            const itemsCount = order.order_items?.length || 0;

            return (
              <div
                key={order.id}
                className="p-6 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/20 hover:border-[#D4A373]/50 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#8A8179]/15 pb-4">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono text-[#8A8179] uppercase">
                      Order #{order.id.slice(0, 8)}
                    </span>
                    <p className="text-xs text-[#5C4A3D] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                      <span>{formatDate(order.created_at)}</span>
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusMeta.badgeClass}`}
                  >
                    {statusMeta.label}
                  </span>
                </div>

                {/* Items preview */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#5C4A3D]">
                    <Coffee className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>
                      {itemsCount} {itemsCount === 1 ? "item" : "items"} in pickup batch
                    </span>
                  </div>

                  {order.notes && (
                    <p className="text-xs text-[#8A8179] italic">
                      Special note: &ldquo;{order.notes}&rdquo;
                    </p>
                  )}
                </div>

                {/* Total & Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#8A8179]/15">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs uppercase tracking-wider text-[#8A8179]">
                      Total (Pickup Counter):
                    </span>
                    <span className="font-serif text-lg font-bold text-[#2C221E]">
                      {formatBdt(order.total_minor)}
                    </span>
                  </div>

                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4A373] hover:text-[#2C221E] transition-colors"
                  >
                    <span>View Receipt &amp; Status</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
