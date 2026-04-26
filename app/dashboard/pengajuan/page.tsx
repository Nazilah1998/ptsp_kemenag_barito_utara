import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { EditAnswersDialog } from "@/components/dashboard/edit-answers-dialog";
import { DeleteRequestButton } from "@/components/dashboard/delete-request-button";

export default async function UserRequestsPage() {
  const profile = await requireAuth();
  const admin = createAdminClient();

  const { data: requests } = await admin
    .from("service_requests")
    .select(
      `
      *,
      services (name),
      service_items (name),
      service_request_answers (*),
      service_request_documents (*)
    `,
    )
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-5 md:space-y-7">
      <section className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1f4bb7] to-[#0f8a54]"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#1f4bb7]">
              📋 Riwayat Layanan
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Daftar Pengajuan Saya
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base max-w-xl">
              Pantau semua pengajuan layanan Anda beserta status progres
              terkininya di sini.
            </p>
          </div>
          <div>
            <Link
              href="/dashboard/pengajuan/baru"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-[#1f4bb7] text-white font-bold text-sm hover:bg-[#1a3fa3] hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              + Buat Pengajuan Baru
            </Link>
          </div>
        </div>
      </section>

      <Card className="border-slate-200 p-0 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-left">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Nomor Pengajuan</th>
                <th className="px-6 py-4">Layanan</th>
                <th className="px-6 py-4">Item Layanan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tanggal Masuk</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(requests ?? []).map((request: any) => (
                <tr
                  key={request.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 font-mono text-slate-700 font-medium">
                    {request.request_number}
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-medium">
                    {request.services?.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {request.service_items?.name}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {formatDate(request.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <EditAnswersDialog
                        requestId={request.id}
                        answers={request.service_request_answers ?? []}
                        documents={request.service_request_documents ?? []}
                        disabled={
                          ![
                            "submitted",
                            "under_review",
                            "revision_required",
                          ].includes(request.status)
                        }
                      />
                      <DeleteRequestButton
                        requestId={request.id}
                        status={request.status}
                      />
                      <Link
                        href={`/dashboard/pengajuan/${request.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold rounded-xl bg-blue-50 text-[#1f4bb7] hover:bg-[#1f4bb7] hover:text-white transition-colors"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {!requests?.length ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <div className="h-16 w-16 mb-4 rounded-full bg-slate-50 flex items-center justify-center">
                        <span className="text-2xl">📭</span>
                      </div>
                      <p className="font-medium text-slate-600">
                        Belum Ada Pengajuan
                      </p>
                      <p className="text-xs mt-1">
                        Anda belum pernah membuat pengajuan layanan.
                      </p>
                    </div>
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
