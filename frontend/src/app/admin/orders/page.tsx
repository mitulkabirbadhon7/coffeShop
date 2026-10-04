import { createClient } from "@/lib/supabase/server";
import { AdminOrderTable, type AdminOrderRecord } from "@/components/admin/orders/admin-order-table";

export const metadata = {
  title: "Order Queue & Fulfillment | Chocobliss Admin Atelier",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, profiles(display_name), order_items(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F5E6D3]">
          Order Fulfillment Queue
        </h1>
        <p className="text-xs sm:text-sm text-[#F5E6D3]/60 font-sans">
          Review incoming pickup reservations, trigger state transitions, and inspect immutable item snapshots.
        </p>
      </div>

      <AdminOrderTable initialOrders={(orders || []) as AdminOrderRecord[]} />
    </div>
  );
}
