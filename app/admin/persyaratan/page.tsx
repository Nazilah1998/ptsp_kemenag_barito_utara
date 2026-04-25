import { FileText } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { PageHeader } from '@/components/admin/page-header';
import { PersyaratanClient } from '@/components/admin/persyaratan/persyaratan-client';

export default async function AdminRequirementsPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const [{ data: items }, { data: requirements }] = await Promise.all([
    admin.from('service_items').select('id, name').order('name'),
    admin
      .from('service_requirements')
      .select('*, service_items(name)')
      .order('service_item_id')
      .order('id')
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Persyaratan"
        description="Atur dokumen persyaratan yang harus diunggah untuk tiap item layanan."
        icon={FileText}
      />
      <PersyaratanClient initialRequirements={requirements ?? []} items={items ?? []} />
    </div>
  );
}
