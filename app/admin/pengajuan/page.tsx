import Link from "next/link";
import { FolderKanban, Search, Filter, Eye, Inbox } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { StatusBadge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/page-header";
import { formatDate } from "@/lib/utils";

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAdmin();
  const { status = "", q = "" } = await searchParams;
  const admin = createAdminClient();

  let query = admin
    .from("service_requests")
    .select(
      `
      *,
      profiles!service_requests_user_id_fkey (full_name, email),
      services (name),
      service_items (name)
    `,
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data: rawRequests } = await query;

  const requests = (rawRequests ?? []).filter((request: any) => {
    if (!q) return true;
    const keyword = q.toLowerCase();
    return (
      String(request.request_number || "")
        .toLowerCase()
        .includes(keyword) ||
      String(request.profiles?.full_name || "")
        .toLowerCase()
        .includes(keyword)
    );
  });

  const totalCount = rawRequests?.length ?? 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Kelola Pengajuan"
        description={`Tinjau dan proses pengajuan dari pemohon. Total: ${totalCount} pengajuan.`}
        icon={FolderKanban}
      />

      {/* Search & Filter */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-3">
          <p className="text-sm font-medium text-slate-700">
            Filter & Pencarian
          </p>
        </div>
        <div className="p-4">
          <form className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Pencarian
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Nomor pengajuan atau nama pemohon..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition-all hover:border-slate-400 focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/10 outline-none"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Status
              </label>
              <select
                name="status"
                defaultValue={status}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition-all hover:border-slate-400 focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/10 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_10px_center] bg-no-repeat pr-9 outline-none"
              >
                <option value="">Semua status</option>
                <option value="submitted">Diajukan</option>
                <option value="under_review">Diproses</option>
                <option value="revision_required">Revisi</option>
                <option value="rejected">Ditolak</option>
                <option value="approved">Disetujui</option>
                <option value="completed">Selesai</option>
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-500/20 transition-all hover:shadow-md hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        {requests?.length ? (
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-3 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Menampilkan{" "}
              <span className="font-semibold text-slate-700">
                {requests.length}
              </span>{" "}
              pengajuan
              {status ? ` — status "${status}"` : ""}
              {q ? ` — pencarian "${q}"` : ""}
            </p>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-slate-50/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Nomor
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Pemohon
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Layanan
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tanggal
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(requests ?? []).map((request: any) => (
                <tr
                  key={request.id}
                  className="group transition-colors duration-150 hover:bg-blue-50/30"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs font-semibold text-[#1f4bb7] bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                      {request.request_number}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">
                        {request.profiles?.full_name || "-"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {request.profiles?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-slate-700 font-medium text-sm">
                        {request.services?.name}
                      </p>
                      {request.service_items?.name && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {request.service_items?.name}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                    {formatDate(request.created_at)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/pengajuan/${request.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#1f4bb7] bg-blue-50 border border-blue-100 transition-all duration-200 hover:bg-[#1f4bb7] hover:text-white hover:border-[#1f4bb7] hover:shadow-sm"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Tinjau
                    </Link>
                  </td>
                </tr>
              ))}

              {!requests?.length && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                        <Inbox className="h-7 w-7 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-600">
                          Tidak ada data pengajuan
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Coba ubah filter atau kata kunci pencarian.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
