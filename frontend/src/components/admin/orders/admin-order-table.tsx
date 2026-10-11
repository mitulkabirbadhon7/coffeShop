"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Clock,
  Coffee,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  AlertCircle,
  Play,
  PackageCheck,
  X,
} from "lucide-react";
import { formatCurrencyBDT, formatDate } from "@/lib/utils/formatters";
import {
  ORDER_STATUS_DETAILS,
  type OrderStatus,
} from "@/lib/services/order.service";
import { updateAdminOrderStatusAction } from "@/lib/orders/admin-order-actions";
import type { Database } from "@/types/database.types";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];

export type AdminOrderRecord = OrderRow & {
  profiles?: { display_name: string | null } | null;
  order_items?: OrderItemRow[] | null;
};

export function AdminOrderTable({
  initialOrders,
}: {
  initialOrders: AdminOrderRecord[];
}) {
  const router = useRouter();
  const [search, setSearch] = React.useState<string>("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("ALL");
  const [loadingOrderId, setLoadingOrderId] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [viewingOrder, setViewingOrder] = React.useState<AdminOrderRecord | null>(null);

  const statuses: ("ALL" | OrderStatus)[] = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "COMPLETED",
    "CANCELLED",
  ];

  const filteredOrders = React.useMemo(() => {
    return initialOrders.filter((order) => {
      if (selectedStatus !== "ALL" && order.status !== selectedStatus) {
        return false;
      }

      if (search.trim()) {
        const query = search.toLowerCase();
        const customerName = order.profiles?.display_name?.toLowerCase() || "";
        const idMatch = order.id.toLowerCase().includes(query);
        const notesMatch = order.notes?.toLowerCase().includes(query) || false;
        return idMatch || customerName.includes(query) || notesMatch;
      }

      return true;
    });
  }, [initialOrders, selectedStatus, search]);

  const handleStatusTransition = async (orderId: string, nextStatus: OrderStatus) => {
    setLoadingOrderId(orderId);
    setErrorMessage(null);

    const res = await updateAdminOrderStatusAction(orderId, nextStatus);
    setLoadingOrderId(null);

    if (!res.success) {
      setErrorMessage(res.error || "Failed to update order status.");
    } else {
      router.refresh();
      if (viewingOrder && viewingOrder.id === orderId) {
        setViewingOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }
    }
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-[#F87171]/15 border border-[#F87171]/30 text-[#F87171] text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8179]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer, or notes..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#231B18] border border-[#5C4A3D]/40 text-xs text-[#F5E6D3] placeholder-[#8A8179]/60 focus:outline-none focus:border-[#D4A373]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#231B18] p-1.5 rounded-xl border border-[#5C4A3D]/40">
          {statuses.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedStatus === st
                  ? "bg-[#D4A373] text-[#1A1613] font-semibold"
                  : "text-[#8A8179] hover:text-[#F5E6D3] hover:bg-[#2C221E]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-[#5C4A3D]/40 bg-[#231B18] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#1A1613] text-[#D4A373] text-[11px] uppercase tracking-wider border-b border-[#5C4A3D]/40">
              <tr>
                <th className="px-5 py-4">Order ID &amp; Customer</th>
                <th className="px-4 py-4">Time (Dhaka)</th>
                <th className="px-4 py-4">Items</th>
                <th className="px-4 py-4">Total</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-5 py-4 text-right">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5C4A3D]/30 text-[#F5E6D3]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isLoading = loadingOrderId === order.id;
                  const currentStatus = order.status as OrderStatus;
                  const statusMeta = ORDER_STATUS_DETAILS[currentStatus] || {
                    label: order.status,
                    badgeClass: "bg-[#8A8179]/15 text-[#8A8179] border-[#8A8179]/30",
                  };
                  const itemsCount = order.order_items?.length || 0;

                  return (
                    <tr key={order.id} className="hover:bg-[#2C221E]/60 transition-colors">
                      {/* ID and Customer */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-[#D4A373] font-bold text-xs block">
                            #{order.id.slice(0, 8)}
                          </span>
                          <span className="text-[#F5E6D3] text-xs">
                            {order.profiles?.display_name || "Guest Customer"}
                          </span>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="px-4 py-4 text-[#8A8179]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="px-4 py-4 text-[#F5E6D3]">
                        <div className="flex items-center gap-1.5">
                          <Coffee className="w-3.5 h-3.5 text-[#D4A373]" />
                          <span>{itemsCount} {itemsCount === 1 ? "line item" : "line items"}</span>
                        </div>
                      </td>

                      {/* Total BDT */}
                      <td className="px-4 py-4 font-serif font-bold text-sm text-[#F5E6D3]">
                        {formatCurrencyBDT(order.total_minor)}
                      </td>

                      {/* Current Status Pill */}
                      <td className="px-4 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${statusMeta.badgeClass}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>

                      {/* State Machine Transition Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#D4A373]" />
                          ) : (
                            <>
                              {/* Step 1: PENDING -> CONFIRMED */}
                              {currentStatus === "PENDING" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleStatusTransition(order.id, "CONFIRMED")}
                                    className="px-2.5 py-1 rounded bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 hover:bg-[#38BDF8]/25 text-[10px] font-semibold inline-flex items-center gap-1"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Confirm</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStatusTransition(order.id, "CANCELLED")}
                                    className="px-2 py-1 rounded bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30 hover:bg-[#F87171]/25 text-[10px] font-semibold inline-flex items-center gap-1"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    <span>Reject</span>
                                  </button>
                                </>
                              )}

                              {/* Step 2: CONFIRMED -> PREPARING */}
                              {currentStatus === "CONFIRMED" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleStatusTransition(order.id, "PREPARING")}
                                    className="px-2.5 py-1 rounded bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 hover:bg-[#F59E0B]/25 text-[10px] font-semibold inline-flex items-center gap-1"
                                  >
                                    <Play className="w-3 h-3" />
                                    <span>Start Brew</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStatusTransition(order.id, "CANCELLED")}
                                    className="px-2 py-1 rounded bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30 hover:bg-[#F87171]/25 text-[10px] font-semibold"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}

                              {/* Step 3: PREPARING -> READY */}
                              {currentStatus === "PREPARING" && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusTransition(order.id, "READY")}
                                  className="px-2.5 py-1 rounded bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/30 hover:bg-[#4ADE80]/25 text-[10px] font-semibold inline-flex items-center gap-1"
                                >
                                  <PackageCheck className="w-3 h-3" />
                                  <span>Mark Ready</span>
                                </button>
                              )}

                              {/* Step 4: READY -> COMPLETED */}
                              {currentStatus === "READY" && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusTransition(order.id, "COMPLETED")}
                                  className="px-2.5 py-1 rounded bg-[#D4A373] text-[#1A1613] hover:bg-[#C28E5C] text-[10px] font-semibold inline-flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Complete Pickup</span>
                                </button>
                              )}

                              {/* Terminal status marker */}
                              {(currentStatus === "COMPLETED" || currentStatus === "CANCELLED") && (
                                <span className="text-[10px] text-[#8A8179] italic">
                                  Archived
                                </span>
                              )}

                              {/* View Details Modal Trigger */}
                              <button
                                type="button"
                                onClick={() => setViewingOrder(order)}
                                className="p-1.5 rounded-lg text-[#8A8179] hover:text-[#D4A373] hover:bg-[#3D3028] transition-colors"
                                aria-label="View Order Receipt"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8A8179]">
                    No orders match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Order Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1613]/80 backdrop-blur-sm transition-opacity"
            onClick={() => setViewingOrder(null)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-xl rounded-2xl bg-[#2C221E] border border-[#5C4A3D]/60 p-6 text-[#F5E6D3] shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#5C4A3D]/40 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#F5E6D3]">
                    Order #{viewingOrder.id.slice(0, 8)}
                  </h3>
                  <p className="text-xs text-[#8A8179]">
                    Customer: {viewingOrder.profiles?.display_name || "Guest Customer"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setViewingOrder(null)}
                  className="p-1.5 rounded-lg text-[#8A8179] hover:text-[#F5E6D3] hover:bg-[#3D3028]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items Snapshot */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4A373]">
                  Items Snapshot (Immutable)
                </h4>
                <div className="divide-y divide-[#5C4A3D]/30 bg-[#231B18] rounded-xl border border-[#5C4A3D]/40 p-4">
                  {viewingOrder.order_items && viewingOrder.order_items.length > 0 ? (
                    viewingOrder.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="py-2.5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-medium text-[#F5E6D3] block">
                            {item.product_name_snapshot}
                          </span>
                          <span className="text-[10px] text-[#8A8179]">
                            {formatCurrencyBDT(item.unit_price_minor)} × {item.quantity}
                          </span>
                        </div>
                        <span className="font-serif font-bold text-[#F5E6D3]">
                          {formatCurrencyBDT(item.line_total_minor)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-[#8A8179] py-2">No items listed.</div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {viewingOrder.notes && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#D4A373]">
                    Special Instructions
                  </span>
                  <p className="text-xs text-[#F5E6D3] bg-[#231B18] p-3 rounded-lg border border-[#5C4A3D]/40 italic">
                    &ldquo;{viewingOrder.notes}&rdquo;
                  </p>
                </div>
              )}

              {/* Footer Total */}
              <div className="pt-3 border-t border-[#5C4A3D]/40 flex items-center justify-between text-xs">
                <span className="text-[#8A8179]">Counter Collection Total:</span>
                <span className="font-serif font-bold text-lg text-[#D4A373]">
                  {formatCurrencyBDT(viewingOrder.total_minor)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
