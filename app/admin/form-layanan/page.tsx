import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/admin/page-header";
import { FormInput } from "lucide-react";
import { FormLayananClient } from "@/components/admin/form-layanan/form-layanan-client";

export default async function AdminFormFieldsPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const [{ data: items }, { data: fields }] = await Promise.all([
    admin.from("service_items").select("id, name").order("name"),
    admin
      .from("service_form_fields")
      .select("*, service_items(name)")
      .order("service_item_id")
      .order("sort_order"),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Form Layanan"
        description="Atur field form dinamis yang digunakan oleh tiap item layanan."
        icon={FormInput}
      />
      <FormLayananClient initialFields={fields ?? []} items={items ?? []} />
    </div>
  );
}
