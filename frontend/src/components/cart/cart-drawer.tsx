"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Clock, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { formatCurrencyBDT } from "@/lib/utils/formatters";
import { placeOrderAction } from "@/lib/orders/actions";
import { createClient } from "@/lib/supabase/client";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
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

  // Check auth status on mount / when drawer opens
  React.useEffect(() => {
    if (!isOpen) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { id: data.user.id, email: data.user.email } : null);
    });
  }, [isOpen]);

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  const handleCheckout = async () => {
    if (items.length === 0) return;
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
        closeCart();
        router.push("/login?next=/account/orders");
      } else {
        setErrorMessage(result.error || "Failed to place pickup order.");
      }
      return;
    }

    // Success! Clear cart, close drawer, navigate to order receipt
    clearCart();
    setNotes("");
    setIsSubmitting(false);
    closeCart();
    router.push(`/account/orders/${result.orderId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1A1613]/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#2C221E] text-[#FDFBF7] shadow-2xl flex flex-col border-l border-[#D4A373]/20 animate-slide-in">
          {/* Header */}
          <div className="p-6 border-b border-[#D4A373]/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#D4A373]/15 flex items-center justify-center text-[#D4A373]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-[#FDFBF7]">
                  Your Order Bag
                </h2>
                <p className="text-xs text-[#8A8179]">
                  {totalItems} {totalItems === 1 ? "item" : "items"} selected
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="p-2 rounded-full text-[#8A8179] hover:text-[#FDFBF7] hover:bg-[#3D3028] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {errorMessage && (
              <div className="p-3.5 rounded-lg bg-[#F87171]/15 border border-[#F87171]/30 text-[#F87171] text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#3D3028] text-[#8A8179] mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-medium text-base text-[#FDFBF7]">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#8A8179] max-w-xs mx-auto">
                    Explore our single-origin roasts, micro-lot batches, and artisanal chocolate confections.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      closeCart();
                      router.push("/products");
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4A373] text-[#1A1613] text-xs font-semibold hover:bg-[#C28E5C] transition-colors"
                  >
                    <span>Browse Atelier Roasts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3.5 rounded-xl bg-[#231B18] border border-[#D4A373]/10 flex gap-3.5 items-center"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-[#3D3028] overflow-hidden relative shrink-0">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#D4A373]/50">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-medium text-sm text-[#FDFBF7] truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#D4A373] font-medium mt-0.5">
                        {formatCurrencyBDT(item.priceMinor)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="inline-flex items-center border border-[#D4A373]/20 rounded-md bg-[#2C221E] px-1.5 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 text-[#8A8179] hover:text-[#FDFBF7] transition-colors"
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold text-[#FDFBF7]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= 20}
                            className="p-1 text-[#8A8179] hover:text-[#FDFBF7] disabled:opacity-30 transition-colors"
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs text-[#8A8179]">
                          Total: {formatCurrencyBDT(item.priceMinor * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Remove Action */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="p-2 text-[#8A8179] hover:text-[#F87171] transition-colors self-start"
                      aria-label={`Remove ${item.name} from bag`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Pickup Notes */}
                <div className="pt-2">
                  <label
                    htmlFor="pickup-notes"
                    className="block text-xs font-medium text-[#8A8179] mb-1.5"
                  >
                    Special Roastery / Pickup Instructions (Optional)
                  </label>
                  <textarea
                    id="pickup-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={500}
                    placeholder="e.g., Whole beans please, or pickup estimated around 5:30 PM..."
                    className="w-full text-xs px-3 py-2 rounded-lg bg-[#231B18] border border-[#D4A373]/20 text-[#FDFBF7] placeholder-[#8A8179]/60 focus:outline-none focus:border-[#D4A373] resize-none"
                  />
                </div>

                {/* Atelier Pickup Guidelines */}
                <div className="p-3.5 rounded-lg bg-[#231B18]/70 border border-[#D4A373]/15 space-y-2 text-xs text-[#8A8179]">
                  <div className="flex items-center gap-2 text-[#D4A373] font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Banani Atelier Pickup</span>
                  </div>
                  <p>
                    Road 11, Banani, Dhaka. Operating daily <strong>8:00 AM – 10:00 PM</strong>.
                  </p>
                  <div className="flex items-center gap-2 pt-1 border-t border-[#D4A373]/10 text-[11px]">
                    <Clock className="w-3 h-3 text-[#D4A373]" />
                    <span>Payment is collected at the counter (Cash or Card).</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer with Subtotal & Checkout Button */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#D4A373]/15 bg-[#231B18] space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#8A8179]">
                  <span>Fulfillment</span>
                  <span className="text-[#4ADE80] font-medium">Counter Pickup (Free)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#FDFBF7] font-medium">Subtotal</span>
                  <span className="font-serif font-bold text-base text-[#D4A373]">
                    {formatCurrencyBDT(subtotalMinor)}
                  </span>
                </div>
              </div>

              {user ? (
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-[#D4A373] text-[#1A1613] font-semibold text-xs tracking-wider uppercase hover:bg-[#C28E5C] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Order to Atelier...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Confirm Pickup Order ({formatCurrencyBDT(subtotalMinor)})</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      closeCart();
                      router.push("/login?next=/account/orders");
                    }}
                    className="w-full h-12 rounded-xl bg-[#D4A373] text-[#1A1613] font-semibold text-xs tracking-wider uppercase hover:bg-[#C28E5C] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Sign in to Place Pickup Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-center text-[#8A8179]">
                    New to Chocobliss?{" "}
                    <Link
                      href="/signup"
                      onClick={closeCart}
                      className="text-[#D4A373] underline hover:text-[#C28E5C]"
                    >
                      Create an account in 30 seconds
                    </Link>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
