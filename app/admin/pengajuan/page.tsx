import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default async function AdminRequestsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAdmin();
  const { status = '', q = '' } = await searchParams;
  const admin = createAdminClient();

  let query = admin
    .from('service_requests')
    .select(`
      *,
      profiles!service_requests_user_id_fkey (full_name, email),
      services (name),
      service_items (name)
    `)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data: rawRequests } = await query;

  const requests = (rawRequests ?? []).filter((request: any) => {
    if (!q) return true;
    const keyword = q.toLowerCase();
    return (
      String(request.request_number || '').toLowerCase().includes(keyword) ||
      String(request.profiles?.full_name || '').toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Kelola Pengajuan</h1>
        <p className="mt-2 text-slate-600">Cari, filter, dan tinjau pengajuan dari pemohon.</p>
      </div>

      <Card>
        <form className="grid gap-4 md:grid-cols-[1fr,220px,auto]">
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari nomor pengajuan atau nama pemohon"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            name="status"
            defaultValue={status}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Semua status</option>
            <option value="submitted">submitted</option>
            <option value="under_review">under_review</option>
            <option value="revision_required">revision_required</option>
            <option value="rejected">rejected</option>
            <option value="approved">approved</option>
            <option value="completed">completed</option>
          </select>
          <button className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white">Filter</button>
        </form>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="pb-3">Nomor</th>
                <th className="pb-3">Pemohon</th>
                <th className="pb-3">Layanan</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Tanggal</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {(requests ?? []).map((request: any) => (
                <tr key={request.id} className="border-t border-slate-100">
                  <td className="py-3">{request.request_number}</td>
                  <td className="py-3">
                    <div>
                      <p className="font-medium">{request.profiles?.full_name || '-'}</p>
                      <p className="text-xs text-slate-500">{request.profiles?.email}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    {request.services?.name} | {request.service_items?.name}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="py-3">{formatDate(request.created_at)}</td>
                  <td className="py-3">
                    <Link href={`/admin/pengajuan/${request.id}`} className="text-green-700">
                      Tinjau
                    </Link>
                  </td>
                </tr>
              ))}
              {!requests?.length ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500">
                    Tidak ada data pengajuan.
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
