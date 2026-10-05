import { requireAdmin } from "@/lib/auth/guards";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export const metadata = {
  title: "Admin Atelier | Chocobliss Coffee Roastery",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side guard: Non-admins and unconfirmed users are rejected immediately
  const { user, profile } = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-[#1A1613] text-[#F5E6D3]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          email={user.email}
          displayName={profile.display_name}
        />
        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
