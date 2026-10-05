import { createClient } from "@/lib/supabase/server";
import { AdminContentEditor } from "@/components/admin/content/admin-content-editor";
import { requireAdmin } from "@/lib/auth/guards";

export const metadata = {
  title: "Site Content | Chocobliss Admin Atelier",
};

export default async function AdminContentPage() {
  await requireAdmin();

  const supabase = await createClient();

  const { data: contentRows } = await supabase
    .from("site_content")
    .select("id, content_key, content, published, updated_by, created_at, updated_at")
    .order("content_key", { ascending: true });

  return <AdminContentEditor initialContent={contentRows || []} />;
}
