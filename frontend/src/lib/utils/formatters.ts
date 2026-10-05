/**
 * Format currency from integer minor units to human-readable format.
 * Defaults to BDT (Bangladeshi Taka).
 * Example: 25000 -> "৳250"
 */
export function formatCurrency(
  minorUnits: number,
  currency: string = "BDT",
  options: { showDecimals?: boolean } = {}
): string {
  const amount = minorUnits / 100;
  const showDecimals = options.showDecimals ?? amount % 1 !== 0;

  if (currency === "BDT") {
    return showDecimals ? `৳${amount.toFixed(2)}` : `৳${amount.toFixed(0)}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Convenience helper to format minor units into BDT with taka sign (৳).
 */
export function formatBdt(
  minorUnits: number,
  options?: { showDecimals?: boolean }
): string {
  return formatCurrency(minorUnits, "BDT", options);
}

/**
 * Format date string into editorial human-readable date.
 * Example: "2026-10-04T12:00:00Z" -> "October 4, 2026"
 */
export function formatDate(
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return "Invalid Date";
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

/**
 * Returns color classes and human label for order status badges.
 */
export function getOrderStatusMeta(status: string): {
  label: string;
  badgeClass: string;
} {
  switch (status.toUpperCase()) {
    case "PENDING":
      return {
        label: "Pending Confirmation",
        badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      };
    case "CONFIRMED":
      return {
        label: "Confirmed",
        badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      };
    case "PREPARING":
      return {
        label: "Brewing / Preparing",
        badgeClass: "bg-[#C89B5E]/15 text-[#C89B5E] border-[#C89B5E]/30",
      };
    case "READY":
      return {
        label: "Ready for Pickup",
        badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        badgeClass: "bg-stone-500/10 text-stone-400 border-stone-500/20",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      };
    default:
      return {
        label: status,
        badgeClass: "bg-stone-500/10 text-stone-400 border-stone-500/20",
      };
  }
}
