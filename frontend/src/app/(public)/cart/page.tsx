"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Plus, Minus, Clock, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { formatCurrencyBDT } from "@/lib/utils/formatters";
import { placeOrderAction } from "@/lib/orders/actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotalMinor,
    totalItems,
  } = useCart();

  const router = useRouter();
  const [notes, setNotes] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<{ id: string; email?: string } | null>(null);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
    });
  }, []);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (!user) {
      router.push("/login?next=/cart");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        notes: notes.trim() || undefined,
      };

      const result = await placeOrderAction(payload);

      if (!result.success) {
        setIsSubmitting(false);
        if (result.requiresAuth) {
          router.push("/login?next=/cart");
        } else {
          setErrorMessage(result.error || "Failed to place your pickup order. Please try again.");
        }
        return;
      }

      clearCart();
      router.push(`/account/orders/${result.orderId}`);
    } catch {
      setErrorMessage("An unexpected error occurred while placing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen text-[#2C221E] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[#8A8179] font-sans"
        >
          <Link href="/" className="hover:text-[#2C221E] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#2C221E] transition-colors">
            Menu
          </Link>
          <span>/</span>
          <span className="text-[#2C221E] font-medium">Your Order Cart</span>
        </nav>

        {/* Back Link */}
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#5C4A3D] hover:text-[#2C221E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Browsing Menu</span>
          </Link>
        </div>

        <div className="flex items-center justify-between border-b border-[#D4A373]/30 pb-4">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2C221E]">
            Your Roastery Cart
          </h1>
          <span className="text-sm text-[#5C4A3D] font-sans">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="p-16 text-center rounded-xl border border-[#8A8179]/20 bg-[#F4F1EA] space-y-4">
            <ShoppingBag className="w-12 h-12 text-[#8A8179] mx-auto" />
            <div className="space-y-1">
              <h2 className="font-serif text-xl font-bold text-[#2C221E]">Your Cart is Empty</h2>
              <p className="text-xs sm:text-sm text-[#5C4A3D] max-w-md mx-auto">
                Explore our single-origin roasts, signature nitro cold brews, and fresh French pastries.
              </p>
            </div>
            <Link href="/products" className="inline-block pt-2">
              <Button as="span"
                variant="primary"
                size="md"
                className="bg-[#D4A373] text-[#1A1613] hover:bg-[#FAEDCD] font-medium tracking-wide rounded-md h-11 px-7 transition-all"
              >
                <span>Explore Full Menu</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-4 p-4 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/20"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-serif font-bold text-base text-[#2C221E] truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#5C4A3D]">
                      {formatCurrencyBDT(item.priceMinor)} each
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 rounded bg-[#FDFBF7] border border-[#8A8179]/30 hover:border-[#D4A373] text-[#2C221E]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-[#2C221E]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1.5 rounded bg-[#FDFBF7] border border-[#8A8179]/30 hover:border-[#D4A373] text-[#2C221E]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="p-1.5 rounded text-[#8A8179] hover:text-[#E07A5F] ml-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[70px]">
                    <span className="font-serif font-bold text-sm text-[#2C221E]">
                      {formatCurrencyBDT(item.priceMinor * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Special Instructions */}
              <div className="pt-2">
                <label htmlFor="order-notes" className="block text-xs font-medium text-[#5C4A3D] mb-1.5">
                  Special Brewing or Roastery Instructions (Optional)
                </label>
                <textarea
                  id="order-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter special instructions or notes..."
                  rows={2}
                  className="w-full p-3 rounded-md bg-[#F4F1EA] border border-[#8A8179]/30 text-xs text-[#2C221E] placeholder-[#8A8179] focus:outline-none focus:ring-2 focus:ring-[#D4A373]"
                />
              </div>
            </div>

            {/* Order Summary & Pickup Card (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-xl bg-[#2C221E] text-[#FDFBF7] border border-[#5C4A3D]/40 shadow-xl space-y-6">
              <h2 className="font-serif text-lg font-bold border-b border-[#5C4A3D]/40 pb-3">
                Pickup Summary
              </h2>

              <div className="space-y-3 text-xs text-[#FDFBF7]/85 font-sans">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D4A373] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-[#FDFBF7]">Atelier Counter Pickup</p>
                    <p className="text-[#8A8179]">House 14, Road 7, Banani, Dhaka</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#D4A373] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-[#FDFBF7]">Daily Hours</p>
                    <p className="text-[#8A8179]">8:00 AM – 10:00 PM (Prepared fresh on arrival)</p>
                  </div>
                </div>
              </div>

              {/* Subtotal & Total */}
              <div className="pt-4 border-t border-[#5C4A3D]/40 space-y-2">
                <div className="flex justify-between text-xs text-[#FDFBF7]/75">
                  <span>Subtotal</span>
                  <span>{formatCurrencyBDT(subtotalMinor)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#FDFBF7]/75">
                  <span>Pickup Fee</span>
                  <span className="text-[#4ADE80]">FREE</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#FDFBF7] pt-2 border-t border-[#5C4A3D]/30">
                  <span>Total Amount</span>
                  <span className="text-[#D4A373]">{formatCurrencyBDT(subtotalMinor)}</span>
                </div>
                <p className="text-[11px] text-[#8A8179]">Pay at counter upon pickup (Cash, Card, MFS)</p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded bg-red-900/40 border border-red-500/50 flex items-center gap-2 text-xs text-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full bg-[#D4A373] text-[#1A1613] hover:bg-[#FAEDCD] font-medium tracking-wide rounded-md h-12 inline-flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Confirming Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Pickup Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
