import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd, getRoasteryJsonLd } from "@/components/seo/json-ld";
import { env } from "@/lib/env";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL || "https://chocobliss.coffee";

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2C221E]">
      {/* Schema.org/CoffeeShop Structured Data */}
      <JsonLd data={getRoasteryJsonLd(siteUrl)} />

      <Header />
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
