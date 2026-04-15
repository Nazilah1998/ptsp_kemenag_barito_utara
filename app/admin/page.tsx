import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card } from '@/components/ui/card';

export default async function AdminHomePage() {
  await requireAdmin();
  const admin = createAdminClient();

  const [{ count: serviceCount }, { count: userCount }, { data: requests }] = await Promise.all([
    admin.from('services').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('service_requests').select('status')
  ]);

  const stats = {
    submitted: requests?.filter((item) => item.status === 'submitted').length ?? 0,
    underReview: requests?.filter((item) => item.status === 'under_review').length ?? 0,
    revision: requests?.filter((item) => item.status === 'revision_required').length ?? 0,
    finished: requests?.filter((item) => ['approved', 'completed'].includes(item.status)).length ?? 0
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Admin</h1>
        <p className="mt-2 text-slate-600">Kelola layanan, pengajuan, dan dokumen hasil.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Jumlah Layanan">{serviceCount ?? 0}</Card>
        <Card title="Jumlah Pengguna">{userCount ?? 0}</Card>
        <Card title="Perlu Diproses">{stats.submitted + stats.underReview}</Card>
        <Card title="Perlu Revisi">{stats.revision}</Card>
        <Card title="Selesai">{stats.finished}</Card>
      </div>
    </div>
  );
}
