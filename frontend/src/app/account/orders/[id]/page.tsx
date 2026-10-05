import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Coffee, CheckCircle2, AlertCircle } from "lucide-react";
import { requireUser } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { formatCurrencyBDT } from "@/lib/utils/formatters";
import {
  ORDER_STATUS_DETAILS,
  ORDER_FULFILLMENT_STEPS,
  canUserCancelOrder,
  type OrderStatus,
} from "@/lib/services/order.service";
import { CancelOrderButton } from "@/components/orders/cancel-order-button";

export const metadata: Metadata = {
  title: "Order Details & Receipt | Chocobliss",
  description: "View your pickup order details, items snapshot, and fulfillment status.",
};

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const user = await requireUser();
  const supabase = await createClient();

  // Anti-IDOR: verify order belongs to current user
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, status, currency, subtotal_minor, total_minor, notes, created_at")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    notFound();
  }

  // Fetch ordered item snapshots
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("id, product_name_snapshot, unit_price_minor, quantity, line_total_minor")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  const orderStatus = order.status as OrderStatus;
  const statusMeta = ORDER_STATUS_DETAILS[orderStatus] || {
    label: orderStatus,
    description: "",
    badgeClass: "bg-[#8A8179]/15 text-[#8A8179] border-[#8A8179]/30",
  };

  const isCancelled = orderStatus === "CANCELLED";
  const currentStepIndex = ORDER_FULFILLMENT_STEPS.indexOf(orderStatus);
  const allowCancel = canUserCancelOrder(orderStatus);

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(new Date(order.created_at));

  return (
    <div className="space-y-8">
      {/* Navigation & Header */}
      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8A8179] hover:text-[#2C221E] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2C221E]">
                Order #{order.id.slice(0, 8)}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${statusMeta.badgeClass}`}
              >
                {statusMeta.label}
              </span>
            </div>
            <p className="text-xs text-[#8A8179] mt-1 font-sans">
              Placed on {formattedDate} (Dhaka Time)
            </p>
          </div>

          {allowCancel && (
            <div>
              <CancelOrderButton orderId={order.id} />
            </div>
          )}
        </div>
      </div>

      {/* Fulfillment Status Banner / Stepper */}
      {isCancelled ? (
        <div className="p-4 rounded-xl bg-[#F87171]/10 border border-[#F87171]/25 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#F87171] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold text-[#F87171]">Order Cancelled</h2>
            <p className="text-xs text-[#8A8179]">
              This order was cancelled. Reserved roastery items have been released. If this was a mistake, you can place a new order anytime.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-[#2C221E] text-[#FDFBF7] border border-[#D4A373]/20 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif font-bold text-base text-[#FDFBF7]">
              Atelier Pickup Status
            </h2>
            <p className="text-xs text-[#8A8179]">{statusMeta.description}</p>
          </div>

          {/* Stepper Steps */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {ORDER_FULFILLMENT_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const stepMeta = ORDER_STATUS_DETAILS[step];

              return (
                <div
                  key={step}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    isCurrent
                      ? "bg-[#D4A373]/20 border-[#D4A373] text-[#FDFBF7]"
                      : isPast
                      ? "bg-[#231B18] border-[#4ADE80]/30 text-[#4ADE80]"
                      : "bg-[#231B18]/50 border-white/5 text-[#8A8179]"
                  }`}
                >
                  <div className="flex justify-center mb-1.5">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                    ) : (
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                          isCurrent
                            ? "border-[#D4A373] text-[#D4A373]"
                            : "border-current opacity-60"
                        }`}
                      >
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium block truncate">
                    {stepMeta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Item Snapshots */}
      <div className="rounded-2xl border border-[#8A8179]/20 bg-[#F4F1EA] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#8A8179]/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Coffee className="w-5 h-5 text-[#D4A373]" />
            <h2 className="font-serif font-bold text-base text-[#2C221E]">
              Order Items Snapshot
            </h2>
          </div>
          <span className="text-xs text-[#8A8179]">
            {items?.length || 0} line {items?.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="divide-y divide-[#8A8179]/15">
          {items && items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#2C221E]">
                    {item.product_name_snapshot}
                  </h3>
                  <p className="text-xs text-[#8A8179] mt-0.5">
                    Unit Price: {formatCurrencyBDT(item.unit_price_minor)} × {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-serif font-bold text-base text-[#2C221E]">
                    {formatCurrencyBDT(item.line_total_minor)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-[#8A8179]">
              No items recorded for this order.
            </div>
          )}
        </div>

        {/* Pricing Summary */}
        <div className="p-6 bg-[#EBE7DF] border-t border-[#8A8179]/20 space-y-3">
          <div className="flex justify-between text-xs text-[#5C4A3D]">
            <span>Fulfillment Type</span>
            <span className="font-medium text-[#2C221E]">Banani Counter Pickup (Free)</span>
          </div>

          <div className="flex justify-between text-xs text-[#5C4A3D]">
            <span>Payment Method</span>
            <span className="font-medium text-[#2C221E]">Cash or Card on Collection</span>
          </div>

          {order.notes && (
            <div className="pt-2 border-t border-[#8A8179]/15 text-xs">
              <span className="text-[#8A8179] block mb-1">Your Roastery Instructions:</span>
              <p className="text-[#2C221E] italic bg-[#FDFBF7] p-2.5 rounded-lg border border-[#8A8179]/20">
                &ldquo;{order.notes}&rdquo;
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-[#8A8179]/20 flex justify-between items-baseline">
            <span className="font-serif font-bold text-sm text-[#2C221E]">Total Due at Counter</span>
            <span className="font-serif font-bold text-xl text-[#2C221E]">
              {formatCurrencyBDT(order.total_minor)}
            </span>
          </div>
        </div>
      </div>

      {/* Pickup Atelier Information */}
      <div className="rounded-2xl border border-[#8A8179]/20 bg-[#F4F1EA] p-6 space-y-3">
        <h2 className="font-serif font-bold text-base text-[#2C221E] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#D4A373]" />
          <span>Atelier Pickup Instructions</span>
        </h2>
        <p className="text-xs text-[#5C4A3D] leading-relaxed">
          Please present your Order ID (<strong>#{order.id.slice(0, 8)}</strong>) to our head barista or cashier upon arrival at our Banani coffee bar.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#8A8179]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4A373] shrink-0" />
            <span>Counter Hours: Daily 8:00 AM – 10:00 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4A373] shrink-0" />
            <span>Chocobliss Atelier, Road 11, Banani, Dhaka</span>
          </div>
        </div>
      </div>
    </div>
  );
}
