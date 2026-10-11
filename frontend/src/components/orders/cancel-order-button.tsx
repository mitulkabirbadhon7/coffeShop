"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { cancelCustomerOrderAction } from "@/lib/orders/actions";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCancel = async () => {
    setIsSubmitting(true);
    setError(null);
    const result = await cancelCustomerOrderAction({ orderId });

    if (!result.success) {
      setError(result.error || "Failed to cancel order.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-lg border border-[#F87171]/40 text-[#F87171] hover:bg-[#F87171]/10 text-xs font-semibold transition-colors inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F87171]"
      >
        <XCircle className="w-4 h-4" />
        <span>Cancel Pickup Order</span>
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1613]/70 backdrop-blur-sm transition-opacity"
            onClick={() => !isSubmitting && setIsOpen(false)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-[#2C221E] border border-[#D4A373]/20 p-6 text-[#FDFBF7] shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-[#F87171]">
                <div className="w-10 h-10 rounded-full bg-[#F87171]/15 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#FDFBF7]">
                    Cancel Pickup Order?
                  </h3>
                  <p className="text-xs text-[#8A8179]">
                    Are you sure you want to cancel this order?
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#8A8179] leading-relaxed">
                This will release the reserved items back into the roastery inventory. This action cannot be undone.
              </p>

              {error && (
                <div className="p-3 rounded-lg bg-[#F87171]/15 border border-[#F87171]/30 text-[#F87171] text-xs">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#8A8179] hover:text-[#FDFBF7] hover:bg-[#3D3028] transition-colors"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg bg-[#F87171] text-[#1A1613] text-xs font-semibold hover:bg-[#EF4444] disabled:opacity-50 transition-colors inline-flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <span>Yes, Cancel Order</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
