import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/auth/actions";
import { ProfileEditForm } from "@/components/account/profile-edit-form";
import { Button } from "@/components/ui/button";
import {
  User,
  Shield,
  Clock,
  LogOut,
  CheckCircle2,
  Mail,
  MapPin,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils/formatters";

export const metadata: Metadata = {
  title: "Account Overview | Chocobliss Coffee Roastery",
  description: "View and edit your Chocobliss patron profile and preferences.",
};

export default async function AccountPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const [{ data: profile }, { count: addressCount }, { count: orderCount }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("addresses")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

  const displayName =
    profile?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Patron";
  const role = profile?.role || "USER";
  const emailConfirmed = !!user.email_confirmed_at;

  return (
    <div className="space-y-8">
      {/* Welcome header & Sign Out */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#8A8179]/20 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-bold text-[#2C221E]">
              Greetings, {displayName}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
                role === "ADMIN"
                  ? "bg-[#D4A373] text-[#1A1613]"
                  : "bg-[#FAEDCD] text-[#5C4A3D] border border-[#8A8179]/20"
              }`}
            >
              {role === "ADMIN" ? "Admin Staff" : "Customer Patron"}
            </span>
          </div>
          <p className="text-xs text-[#5C4A3D] font-sans">
            Member of the Chocobliss Roastery community
          </p>
        </div>

        <form action={signOutAction}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="inline-flex items-center gap-2 border-[#8A8179]/30 text-[#2C221E] hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-300 rounded-md text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Button>
        </form>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5C4A3D]">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#D4A373]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#2C221E]">
            {orderCount || 0}
          </p>
          <Link
            href="/account/orders"
            className="text-[11px] text-[#D4A373] hover:underline font-medium inline-flex items-center gap-1 pt-1"
          >
            <span>View pickup history</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5C4A3D]">Saved Locations</span>
            <MapPin className="w-4 h-4 text-[#D4A373]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#2C221E]">
            {addressCount || 0}
          </p>
          <Link
            href="/account/addresses"
            className="text-[11px] text-[#D4A373] hover:underline font-medium inline-flex items-center gap-1 pt-1"
          >
            <span>Manage addresses</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5C4A3D]">Member Since</span>
            <Clock className="w-4 h-4 text-[#D4A373]" />
          </div>
          <p className="font-serif text-lg font-bold text-[#2C221E] truncate">
            {formatDate(user.created_at)}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-[#4ADE80] font-medium pt-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active Account</span>
          </div>
        </div>
      </div>

      {/* Profile Edit & Verification Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/20 space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#D4A373]" />
            <h2 className="font-serif text-lg font-bold text-[#2C221E]">
              Profile Preferences
            </h2>
          </div>
          <ProfileEditForm
            initialDisplayName={profile?.display_name || displayName}
            email={user.email || ""}
          />
        </div>

        <div className="p-6 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/20 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#D4A373]" />
              <h2 className="font-serif text-lg font-bold text-[#2C221E]">
                Security &amp; Verification
              </h2>
            </div>

            <div className="space-y-3 text-xs text-[#5C4A3D] font-sans">
              <div className="flex items-center justify-between py-2 border-b border-[#8A8179]/15">
                <span>Email Verification</span>
                {emailConfirmed ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Confirmation Pending</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#8A8179]/15">
                <span>Account Role</span>
                <span className="font-mono font-medium text-[#2C221E]">{role}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span>Session Type</span>
                <span className="font-mono font-medium text-[#2C221E]">
                  Supabase SSR Cookie
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#8A8179]/15">
            <Link href="/update-password">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-[#8A8179]/30 text-[#2C221E] hover:bg-[#2C221E] hover:text-[#FDFBF7] rounded-md text-xs font-medium h-10"
              >
                <span>Change Account Password</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
