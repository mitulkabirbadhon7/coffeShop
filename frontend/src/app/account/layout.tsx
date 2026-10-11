import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { User, ShoppingBag, MapPin, ArrowRight } from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2C221E]">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Account Navigation Sidebar */}
          <aside className="space-y-2 md:col-span-1">
            <div className="p-4 rounded-xl bg-white border border-[#2C221E]/10 space-y-1">
              <Link
                href="/account"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2C221E] hover:bg-[#FDFBF7] transition-colors"
              >
                <User className="w-4 h-4 text-[#C89B5E]" />
                <span>Profile Overview</span>
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2C221E] hover:bg-[#FDFBF7] transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-[#C89B5E]" />
                <span>Pickup Orders</span>
              </Link>
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
