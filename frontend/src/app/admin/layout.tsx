import { AdminSidebar } from "@/components/layout/admin-sidebar";

export const metadata = {
  title: "Admin Atelier | Chocobliss Coffee Roastery",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#1A1613] text-[#F5E6D3]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-[#5C4A3D]/40 px-8 flex items-center justify-between bg-[#1A1613]/90 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#D4A373]">
            <span>Staff Portal</span>
            <span>•</span>
            <span className="text-[#F5E6D3]/60">Role Protected (Server Enforced)</span>
          </div>
        </header>
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
