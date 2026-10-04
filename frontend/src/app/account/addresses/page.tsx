import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { AddressManager } from "@/components/account/address-manager";

export const metadata: Metadata = {
  title: "Saved Addresses | Chocobliss Coffee Roastery",
  description: "Manage your saved pickup addresses and default contacts.",
};

export default async function AccountAddressesPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: addresses, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching addresses:", error);
  }

  return (
    <div className="space-y-6">
      <AddressManager initialAddresses={addresses || []} />
    </div>
  );
}
