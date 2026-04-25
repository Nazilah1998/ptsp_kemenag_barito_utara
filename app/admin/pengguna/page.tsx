import { Users } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { PageHeader } from '@/components/admin/page-header';
import { PenggunaClient } from '@/components/admin/pengguna/pengguna-client';

export default async function AdminUsersPage() {
  const profile = await requireAdmin();
  const admin = createAdminClient();

  const { data: rawUsers } = await admin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Petugas & Pengguna"
        description="Kelola role dan akses pengguna sistem PTSP Kemenag Barito Utara."
        icon={Users}
      />
      <PenggunaClient initialUsers={rawUsers ?? []} currentEmail={profile.email} />
    </div>
  );
}
