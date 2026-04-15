import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default async function UserRequestsPage() {
  const profile = await requireAuth();
  const admin = createAdminClient();

  const { data: requests } = await admin
    .from('service_requests')
    .select(`
      *,
      services (name),
      service_items (name)
    `)
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Riwayat Pengajuan</h1>
          <p className="mt-2 text-slate-600">Pantau semua pengajuan layanan Anda.</p>
        </div>
        <Link href="/dashboard/pengajuan/baru" className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white">
          Buat Pengajuan
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="pb-3">Nomor</th>
                <th className="pb-3">Layanan</th>
                <th className="pb-3">Item</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Tanggal</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {(requests ?? []).map((request: any) => (
                <tr key={request.id} className="border-t border-slate-100">
                  <td className="py-3">{request.request_number}</td>
                  <td className="py-3">{request.services?.name}</td>
                  <td className="py-3">{request.service_items?.name}</td>
                  <td className="py-3">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="py-3">{formatDate(request.created_at)}</td>
                  <td className="py-3">
                    <Link href={`/dashboard/pengajuan/${request.id}`} className="text-green-700">
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
              {!requests?.length ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500">
                    Belum ada pengajuan.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
