import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Chocobliss Coffee Roastery",
  description: "Privacy policy and terms of service for Chocobliss.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#1A1613] text-[#FDFBF7] py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-[#D4A373]">
          Privacy Policy
        </h1>
        
        <div className="space-y-8 font-sans text-sm md:text-base leading-relaxed text-[#FDFBF7]/80">
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#FDFBF7]">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#FDFBF7]">2. How We Use Your Information</h2>
            <p>
              We may use the information we collect about you to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services, including, for example, to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support, develop safety features, authenticate users, and send product updates and administrative messages.</li>
              <li>Perform internal operations, including, for example, to prevent fraud and abuse of our services; to troubleshoot software bugs and operational problems; to conduct data analysis, testing, and research; and to monitor and analyze usage and activity trends.</li>
              <li>Send you communications we think will be of interest to you, including information about products, services, promotions, news, and events of Chocobliss, where permissible and according to local applicable laws.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#FDFBF7]">3. Data Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#FDFBF7]">4. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:contact@chocoblisscoffee.com" className="text-[#D4A373] hover:underline">contact@chocoblisscoffee.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
