import { FileText } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/admin/page-header";
import { LayananClient } from "@/components/admin/layanan/layanan-client";

export default async function AdminServicesPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const { data: services } = await admin
    .from("services")
    .select("*")
    .order("created_at", { ascending: true }); // Ordered by created_at so we can reorder

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Layanan"
        description="Manajemen data layanan utama, urutan prioritas, dan pengaturan visibilitas untuk portal PTSP."
        icon={FileText}
      />
      <LayananClient initialServices={services ?? []} />
    </div>
  );
}
