import { Layers } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { PageHeader } from '@/components/admin/page-header';
import { ItemLayananClient } from '@/components/admin/item-layanan/item-layanan-client';

export default async function AdminServiceItemsPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const [{ data: services }, { data: items }] = await Promise.all([
    admin.from('services').select('*').order('name'),
    admin.from('service_items').select('*, services(name)').order('id')
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Item Layanan"
        description="Kelola daftar sub-layanan, formulir, dan persyaratan untuk setiap induk layanan."
        icon={Layers}
      />
      <ItemLayananClient initialItems={items ?? []} services={services ?? []} />
    </div>
  );
}
