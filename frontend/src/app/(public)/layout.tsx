import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2C221E]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
