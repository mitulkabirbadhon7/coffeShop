import Link from "next/link";
import { Coffee, ShoppingBag, DollarSign, Clock, ArrowRight, ShieldCheck, FileText, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/stat-card";
import { formatCurrencyBDT, formatDate } from "@/lib/utils/formatters";
import { ORDER_STATUS_DETAILS, type OrderStatus } from "@/lib/services/order.service";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // Parallel data fetching for dashboard indicators
  const [
    { count: productsCount },
    { count: ordersCount },
    { count: pendingOrdersCount },
    { data: completedOrders },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "PENDING"),
    supabase.from("orders").select("total_minor").eq("status", "COMPLETED"),
    supabase.from("orders").select("id, status, total_minor, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const totalRevenueMinor = (completedOrders || []).reduce(
    (acc, curr) => acc + (curr.total_minor || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F5E6D3]">
            Atelier Management Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#F5E6D3]/60 font-sans">
            Real-time status of roastery catalog, counter orders, and operations.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4ADE80]/10 border border-[#4ADE80]/30 text-[#4ADE80] text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Server Role Verified (Admin)</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Active Roasts"
          value={productsCount || 0}
          subtitle="Specialty beans & treats"
          icon={Coffee}
          badge="Live Catalog"
          badgeType="accent"
        />

        <StatCard
          title="Order Queue"
          value={ordersCount || 0}
          subtitle={`${pendingOrdersCount || 0} awaiting confirmation`}
          icon={ShoppingBag}
          badge={pendingOrdersCount && pendingOrdersCount > 0 ? "Action Required" : "All Caught Up"}
          badgeType={pendingOrdersCount && pendingOrdersCount > 0 ? "warning" : "success"}
        />

        <StatCard
          title="Collected Revenue"
          value={formatCurrencyBDT(totalRevenueMinor)}
          subtitle="Completed pickup orders"
          icon={DollarSign}
          badge="BDT Taka"
          badgeType="success"
        />

        <StatCard
          title="Fulfillment"
          value="Banani Counter"
          subtitle="Road 11 • 8 AM – 10 PM"
          icon={Clock}
          badge="Dhaka Atelier"
          badgeType="neutral"
        />
      </div>

      {/* Two Column Layout: Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Queue (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#231B18] border border-[#5C4A3D]/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-serif font-bold text-base text-[#F5E6D3]">
                Recent Counter Orders
              </h2>
              <p className="text-xs text-[#8A8179]">Latest pickup reservations placed by guests</p>
            </div>

            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#D4A373] hover:text-[#C28E5C] transition-colors inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#5C4A3D]/30 pt-2">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => {
                const statusMeta = ORDER_STATUS_DETAILS[order.status as OrderStatus] || {
                  label: order.status,
                  badgeClass: "bg-[#8A8179]/15 text-[#8A8179] border-[#8A8179]/30",
                };

                return (
                  <div
                    key={order.id}
                    className="py-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono text-[#D4A373] font-medium">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-[#8A8179] ml-2">
                        {formatDate(order.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-[#F5E6D3]">
                        {formatCurrencyBDT(order.total_minor)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusMeta.badgeClass}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-[#8A8179]">
                No pickup orders recorded in database yet.
              </div>
            )}
          </div>
        </div>

        {/* Quick Management Hub (1 col) */}
        <div className="rounded-2xl bg-[#231B18] border border-[#5C4A3D]/40 p-6 space-y-4">
          <div className="space-y-0.5">
            <h2 className="font-serif font-bold text-base text-[#F5E6D3]">
              Atelier Consoles
            </h2>
            <p className="text-xs text-[#8A8179]">Quick access to operational panels</p>
          </div>

          <div className="space-y-2.5 pt-1">
            <Link
              href="/admin/products"
              className="p-3.5 rounded-xl bg-[#2C221E] border border-[#5C4A3D]/40 hover:border-[#D4A373]/60 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4A373]/10 text-[#D4A373] flex items-center justify-center">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-xs text-[#F5E6D3] group-hover:text-[#D4A373] transition-colors">
                    Products &amp; Roasts
                  </h3>
                  <p className="text-[11px] text-[#8A8179]">Update beans, pricing &amp; batches</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#8A8179] group-hover:text-[#D4A373] transition-colors" />
            </Link>

            <Link
              href="/admin/orders"
              className="p-3.5 rounded-xl bg-[#2C221E] border border-[#5C4A3D]/40 hover:border-[#D4A373]/60 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4A373]/10 text-[#D4A373] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-xs text-[#F5E6D3] group-hover:text-[#D4A373] transition-colors">
                    Orders Queue
                  </h3>
                  <p className="text-[11px] text-[#8A8179]">Confirm, prepare &amp; dispatch</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#8A8179] group-hover:text-[#D4A373] transition-colors" />
            </Link>

            <Link
              href="/admin/content"
              className="p-3.5 rounded-xl bg-[#2C221E] border border-[#5C4A3D]/40 hover:border-[#D4A373]/60 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4A373]/10 text-[#D4A373] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-xs text-[#F5E6D3] group-hover:text-[#D4A373] transition-colors">
                    Site Content
                  </h3>
                  <p className="text-[11px] text-[#8A8179]">Editorial stories &amp; announcements</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#8A8179] group-hover:text-[#D4A373] transition-colors" />
            </Link>

            <Link
              href="/admin/messages"
              className="p-3.5 rounded-xl bg-[#2C221E] border border-[#5C4A3D]/40 hover:border-[#D4A373]/60 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4A373]/10 text-[#D4A373] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-xs text-[#F5E6D3] group-hover:text-[#D4A373] transition-colors">
                    Customer Inquiries
                  </h3>
                  <p className="text-[11px] text-[#8A8179]">Contact messages from atelier guests</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#8A8179] group-hover:text-[#D4A373] transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
