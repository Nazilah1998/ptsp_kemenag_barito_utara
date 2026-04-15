import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card } from '@/components/ui/card';

export default async function DashboardHomePage() {
  const profile = await requireAuth();
  const admin = createAdminClient();

  const { data: requests } = await admin
    .from('service_requests')
    .select('status')
    .eq('user_id', profile.id);

  const stats = {
    total: requests?.length ?? 0,
    pending: requests?.filter((item) => ['submitted', 'under_review'].includes(item.status)).length ?? 0,
    revision: requests?.filter((item) => item.status === 'revision_required').length ?? 0,
    finished: requests?.filter((item) => ['approved', 'completed'].includes(item.status)).length ?? 0
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Pemohon</h1>
        <p className="mt-2 text-slate-600">Selamat datang, {profile.full_name || profile.email}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Total Pengajuan">{stats.total}</Card>
        <Card title="Menunggu Proses">{stats.pending}</Card>
        <Card title="Perlu Revisi">{stats.revision}</Card>
        <Card title="Selesai">{stats.finished}</Card>
      </div>

      <Card title="Aksi Cepat" description="Buat pengajuan baru atau lihat riwayat pengajuan Anda.">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/pengajuan/baru"
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white"
          >
            Buat Pengajuan Baru
          </Link>
          <Link href="/dashboard/pengajuan" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium">
            Lihat Riwayat
          </Link>
        </div>
      </Card>
    </div>
  );
}
