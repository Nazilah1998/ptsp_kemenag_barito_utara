import Link from "next/link";
import {
  Search,
  FileClock,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  FileCheck,
  Download,
  History,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const admin = createAdminClient();

  let result: any = null;
  let generatedUrl: string | null = null;

  async function getSignedUrl(bucket: string, path?: string | null) {
    if (!path) return null;
    if (path === "EXPIRED") return "EXPIRED";
    const { data } = await admin.storage
      .from(bucket)
      .createSignedUrl(path, 3600);
    return data?.signedUrl || null;
  }

  if (q.trim()) {
    const { data } = await admin
      .from("service_requests")
      .select(
        `
        id,
        request_number,
        status,
        created_at,
        submitted_at,
        approved_at,
        completed_at,
        rejection_reason,
        revision_note,
        services (name),
        service_items (name),
        generated_documents (*),
        activity_logs (*)
      `,
      )
      .eq("request_number", q.trim())
      .maybeSingle();

    result = data;

    if (
      result &&
      result.generated_documents &&
      result.generated_documents.length > 0
    ) {
      const doc = result.generated_documents[0];
      generatedUrl = await getSignedUrl("generated-documents", doc.file_path);
    }
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Immersive Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d2d8a] via-[#1f4bb7] to-[#1a53c8] pt-12 pb-24 md:pt-16 md:pb-32">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#f0c040]/20 blur-[100px]" />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-10 lg:px-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md mb-4">
            Pelacakan Permohonan
          </span>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl drop-shadow-sm">
            Lacak Status Pengajuan
          </h1>
          <p className="mt-4 text-base leading-relaxed text-blue-100/90 sm:text-lg max-w-2xl mx-auto">
            Masukkan nomor pengajuan Anda untuk melihat status terbaru, catatan
            revisi, dan mengunduh hasil layanan secara real-time.
          </p>

          <form className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Contoh: PTSP-2026-0001"
                className="w-full h-14 rounded-2xl border-0 bg-white py-3 pl-12 pr-5 text-base text-slate-900 shadow-xl placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/20"
                autoComplete="off"
              />
            </div>
            <button className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#5eeaa5] px-8 text-base font-bold text-[#0a1e5e] shadow-xl transition-all hover:-translate-y-0.5 hover:bg-[#38d9a9] hover:shadow-2xl">
              Cari Sekarang
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="relative -mt-16 mb-24 px-6 sm:px-10 lg:px-12">
        <div className="mx-auto w-full max-w-5xl">
          {q.trim() ? (
            result ? (
              <div className="space-y-6">
                {/* Status Card */}
                <div className="rounded-[2rem] bg-white p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Nomor Pengajuan
                      </p>
                      <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                        {result.request_number}
                      </h2>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 inline-flex">
                        <span className="text-[#1f4bb7]">
                          {result.services?.name}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                        <span>{result.service_items?.name}</span>
                      </div>
                    </div>
                    <div className="shrink-0 scale-110 origin-left sm:origin-right">
                      <StatusBadge status={result.status} />
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 rounded-2xl bg-slate-50/80 p-5 border border-slate-100 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Tanggal Pengajuan
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {formatDate(result.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Diterima Sistem
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {result.submitted_at
                          ? formatDate(result.submitted_at)
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Disetujui
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {result.approved_at
                          ? formatDate(result.approved_at)
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Selesai
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {result.completed_at
                          ? formatDate(result.completed_at)
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {result.revision_note && (
                    <div className="mt-5 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
                      <div className="mt-0.5 shrink-0">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-bold text-amber-800">
                          Catatan Revisi dari Petugas
                        </p>
                        <p className="mt-1 text-sm">{result.revision_note}</p>
                      </div>
                    </div>
                  )}

                  {result.rejection_reason && (
                    <div className="mt-5 flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900">
                      <div className="mt-0.5 shrink-0">
                        <AlertCircle className="h-5 w-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-bold text-rose-800">
                          Alasan Penolakan
                        </p>
                        <p className="mt-1 text-sm">
                          {result.rejection_reason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Hasil Layanan Section */}
                  {(result.status === "completed" ||
                    result.status === "COMPLETED" ||
                    generatedUrl) && (
                    <div className="mt-8 border-t border-slate-100 pt-8">
                      <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-[#0f8a54]" />
                        Dokumen Hasil Layanan
                      </h3>
                      {generatedUrl === "EXPIRED" ? (
                        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900">
                          <AlertCircle className="h-8 w-8 text-rose-600" />
                          <div>
                            <p className="font-bold text-rose-800">
                              File Telah Kadaluarsa
                            </p>
                            <p className="mt-0.5 text-sm">
                              Dokumen ini telah dihapus dari sistem untuk
                              menghemat ruang penyimpanan karena sudah melewati
                              batas waktu 3 hari.
                            </p>
                          </div>
                        </div>
                      ) : generatedUrl ? (
                        <a
                          href={generatedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-center justify-between rounded-2xl border border-[#1f4bb7]/20 bg-[#1f4bb7]/5 p-5 transition-colors hover:bg-[#1f4bb7]/10"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1f4bb7] text-white shadow-md">
                              <Download className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                Unduh Dokumen Hasil
                              </p>
                              <p className="text-sm text-slate-600">
                                Klik untuk mengunduh berkas resmi hasil
                                permohonan Anda.
                              </p>
                            </div>
                          </div>
                          <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-white text-[#1f4bb7] shadow-sm transition-transform group-hover:scale-110 sm:flex">
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        </a>
                      ) : (
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center text-sm text-slate-500">
                          Dokumen hasil belum diunggah oleh petugas.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Activity Logs */}
                {result.activity_logs && result.activity_logs.length > 0 && (
                  <div className="rounded-[2rem] bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
                    <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <History className="h-5 w-5 text-[#1f4bb7]" />
                        Riwayat Aktivitas
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {result.activity_logs.length} entri
                      </span>
                    </h3>
                    <div className="relative max-h-[400px] overflow-y-auto pr-2 border-l-2 border-slate-100 ml-3 space-y-6 scrollbar-thin">
                      {result.activity_logs
                        .sort(
                          (a: any, b: any) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime(),
                        )
                        .map((log: any, idx: number) => (
                          <div key={log.id} className="relative pl-6">
                            <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-[#1f4bb7] shadow-sm" />
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {log.action}
                              </p>
                              <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                                {formatDate(log.created_at)}
                              </p>
                              {log.notes && (
                                <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                  {log.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-[2rem] bg-white p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Pengajuan Tidak Ditemukan
                </h3>
                <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                  Maaf, kami tidak dapat menemukan pengajuan dengan nomor{" "}
                  <span className="font-bold text-slate-700">"{q}"</span>.
                  Pastikan Anda memasukkan nomor pengajuan dengan benar.
                </p>
              </div>
            )
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1f4bb7]">
                  <FileClock className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Status Real-time
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Pantau progres permohonan Anda detik demi detik secara
                  langsung tanpa perlu repot datang ke kantor Kemenag.
                </p>
              </div>
              <div className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  100% Transparan
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Setiap perubahan status dan riwayat tindakan dicatat dengan
                  transparan sehingga Anda selalu mendapat kepastian layanan.
                </p>
              </div>
              <div className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <ArrowRight className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Butuh Bantuan?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Jika Anda mengalami kendala saat mengajukan atau melacak
                  permohonan, tim bantuan kami siap membantu Anda.
                </p>
                <Link
                  href="/kontak"
                  className="mt-4 inline-flex font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Hubungi CS Kami
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
