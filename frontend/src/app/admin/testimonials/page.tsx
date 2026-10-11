import { createClient } from "@/lib/supabase/server";
import { AdminTestimonialsManager } from "@/components/admin/testimonials/admin-testimonials-manager";
import { requireAdmin } from "@/lib/auth/guards";

export const metadata = {
  title: "Testimonials | Chocobliss Admin Atelier",
};

export default async function AdminTestimonialsPage() {
  await requireAdmin();

  const supabase = await createClient();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, name, quote, role_or_context, image_path, is_published, sort_order, created_at, updated_at")
    .order("sort_order", { ascending: true });

  return <AdminTestimonialsManager initialTestimonials={testimonials || []} />;
}
