"use client";

import * as React from "react";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/cart-context";

export interface ProductDetailActionsProps {
  productId: string;
  productName: string;
  slug: string;
  priceMinor: number;
  imageUrl?: string | null;
  categoryName?: string;
  isAvailable: boolean;
}

export function ProductDetailActions({
  productId,
  productName,
  slug,
  priceMinor,
  imageUrl,
  categoryName,
  isAvailable,
}: ProductDetailActionsProps) {
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = React.useState<number>(1);
  const [added, setAdded] = React.useState<boolean>(false);

  const increment = () => setQuantity((q) => Math.min(20, q + 1));
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleOrder = () => {
    addItem(
      {
        productId,
        name: productName,
        slug,
        priceMinor,
        imageUrl,
        categoryName,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (!isAvailable) {
    return (
      <div className="p-4 rounded-lg bg-[#F87171]/10 border border-[#F87171]/25 text-[#F87171] text-xs font-medium">
        This artisanal batch is currently sold out. Check back soon for the next fresh roast!
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4 border-t border-[#8A8179]/20">
      <div className="flex items-center gap-4">
        {/* Quantity Controls */}
        <div className="inline-flex items-center border border-[#8A8179]/30 rounded-md bg-[#FDFBF7] h-12 px-2">
          <button
            type="button"
            onClick={decrement}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="p-1.5 text-[#5C4A3D] hover:text-[#2C221E] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center font-serif font-bold text-sm text-[#2C221E]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increment}
            disabled={quantity >= 20}
            aria-label="Increase quantity"
            className="p-1.5 text-[#5C4A3D] hover:text-[#2C221E] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Order Button with Cup Fill Animation */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleOrder}
          className="btn-cup-fill flex-1 h-12 bg-[#2C221E] text-[#FDFBF7] hover:text-[#1A1613] rounded-md font-medium tracking-wide inline-flex items-center justify-center gap-2"
        >
          {added ? (
            <>
              <Check className="w-4 h-4 text-[#4ADE80]" />
              <span>Added to Order Selection!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Order for Pickup ({quantity})</span>
            </>
          )}
        </Button>
      </div>

      {added && (
        <div className="flex items-center justify-between text-xs text-[#4ADE80] font-sans animate-fade-in">
          <span>✓ {quantity}x {productName} added to your selection bag.</span>
          <button
            type="button"
            onClick={openCart}
            className="underline font-semibold text-[#D4A373] hover:text-[#2C221E] transition-colors"
          >
            View Bag &amp; Checkout →
          </button>
        </div>
      )}
    </div>
  );
}
