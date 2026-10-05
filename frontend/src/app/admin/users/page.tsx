import { requireAdmin } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { AdminUserTable } from "@/components/admin/users/admin-user-table";

export const metadata = {
  title: "Users & Roles | Chocobliss Admin Atelier",
};

export default async function AdminUsersPage() {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F5E6D3]">
          Staff &amp; User Directory
        </h1>
        <p className="text-xs sm:text-sm text-[#F5E6D3]/60 font-sans">
          Manage registered customer profiles and assign administrative Atelier privileges with audit logging.
        </p>
      </div>

      <AdminUserTable
        profiles={profiles || []}
        currentUserId={user.id}
      />
    </div>
  );
}
