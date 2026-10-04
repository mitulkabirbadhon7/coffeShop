import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getCurrentUser } from "@/lib/auth/guards";
import { User, ShoppingBag, MapPin, Shield } from "lucide-react";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2C221E]">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Account Navigation Sidebar */}
          <aside className="space-y-3 md:col-span-1">
            <div className="p-3 rounded-lg bg-[#F4F1EA] border border-[#8A8179]/20 space-y-1">
              <Link
                href="/account"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-medium text-[#2C221E] hover:bg-[#FAEDCD] transition-colors"
              >
                <User className="w-4 h-4 text-[#D4A373]" />
                <span>Profile Overview</span>
              </Link>
              <Link
                href="/account/addresses"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-medium text-[#2C221E] hover:bg-[#FAEDCD] transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#D4A373]" />
                <span>Saved Addresses</span>
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-medium text-[#2C221E] hover:bg-[#FAEDCD] transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4A373]" />
                <span>Pickup Orders</span>
              </Link>
              {isAdmin && (
                <div className="pt-2 border-t border-[#8A8179]/20 mt-2">
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-semibold text-[#D4A373] bg-[#2C221E] hover:bg-[#1A1613] transition-colors"
                  >
                    <Shield className="w-4 h-4 text-[#D4A373]" />
                    <span>Admin Dashboard</span>
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* Account Main Content */}
          <div className="md:col-span-3">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
