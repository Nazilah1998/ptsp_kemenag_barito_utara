import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateRequestStatusAction } from "@/lib/actions/admin";
import { DeleteRequestButton } from "@/components/admin/delete-request-button";
import { formatDate } from "@/lib/utils";
import { getDrivePreviewUrl } from "@/lib/google-drive";
import { UploadResultButton } from "@/components/admin/upload-result-button";
import {
  ArrowLeft,
  ClipboardList,
  FileCheck,
  FileText,
  MessageSquare,
  History,
  Activity,
  Download,
  ExternalLink,
  User,
  Calendar,
  Hash,
  AlertCircle,
  CheckCircle2,
  Eye,
} from "lucide-react";

async function getSignedUrl(bucket: string, path?: string | null) {
  if (!path) return null;

  // Handle Google Drive links
  if (path.startsWith("gdrive:")) {
    const fileId = path.replace("gdrive:", "");
    return getDrivePreviewUrl(fileId);
  }

  const admin = createAdminClient();
  const { data } = await admin.storage.from(bucket).createSignedUrl(path, 3600);
  return data?.signedUrl || null;
}

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const adminProfile = await requireAdmin();
  const { id } = await params;
  const admin = createAdminClient();

  const { data: request } = await admin
    .from("service_requests")
    .select(
      `
      *,
      profiles!service_requests_user_id_fkey (*),
      services (name),
      service_items (name),
      service_request_answers (*),
      service_request_documents (
        *,
        service_requirements (*)
      ),
      service_request_reviews (
        *,
        profiles!service_request_reviews_reviewer_id_fkey (full_name)
      ),
      generated_documents (*),
      activity_logs (*)
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (!request) {
    notFound();
  }

  const docUrls = await Promise.all(
    (request.service_request_documents ?? []).map(async (doc: any) => ({
      id: doc.id,
      url: await getSignedUrl("request-documents", doc.file_path),
    })),
  );

  // Find the manually-uploaded Google Drive document (file_path starts with 'gdrive:')
  const rawGeneratedDocs = request.generated_documents;
  const allGeneratedDocs: any[] = Array.isArray(rawGeneratedDocs)
    ? rawGeneratedDocs
    : rawGeneratedDocs
      ? [rawGeneratedDocs]
      : [];
  const generatedDoc =
    allGeneratedDocs.find(
      (d: any) =>
        typeof d.file_path === "string" && d.file_path.startsWith("gdrive:"),
    ) ?? null;

  // Build the preview URL directly — no Supabase involved
  const driveFileId = generatedDoc?.file_path?.replace("gdrive:", "") ?? null;
  const generatedUrl = driveFileId ? getDrivePreviewUrl(driveFileId) : null;
  const signedUrlMap = new Map(docUrls.map((item) => [item.id, item.url]));

  return (
    <div className="space-y-6 pb-12">
      {/* Back link */}
      <Link
        href="/admin/pengajuan"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1f4bb7] transition-all hover:-translate-x-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar pengajuan
      </Link>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-200/50 bg-gradient-to-br from-[#1f4bb7] to-[#143481] shadow-xl shadow-blue-900/10 p-8 sm:p-10">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-white/10 text-blue-100 text-[11px] font-black tracking-widest uppercase backdrop-blur-md border border-white/10">
                Detail Pengajuan
              </span>
              <StatusBadge status={request.status} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {request.request_number}
            </h1>
            <p className="text-blue-200 font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 opacity-70" />
              Diajukan pada {formatDate(request.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Info Grid - Modern Glassy Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 -mt-4 relative z-20 px-4 sm:px-8">
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1f4bb7]">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pemohon
              </p>
              <p className="text-sm font-black text-slate-900 mt-0.5 line-clamp-1">
                {request.profiles?.full_name || "-"}
              </p>
              <p className="text-[11px] text-slate-500">
                {request.profiles?.email}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Layanan
              </p>
              <p className="text-sm font-black text-slate-900 mt-0.5 line-clamp-1">
                {request.services?.name}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Hash className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Item Layanan
              </p>
              <p className="text-sm font-black text-slate-900 mt-0.5 line-clamp-1">
                {request.service_items?.name || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid gap-6 lg:grid-cols-12 mt-6">
        {/* Left Column - Forms & Documents */}
        <div className="space-y-6 lg:col-span-7">
          {/* Jawaban Form */}
          <Card title="Data Isian Form" icon={ClipboardList}>
            <div className="space-y-4">
              {(request.service_request_answers ?? []).length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <ClipboardList className="h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500 font-semibold">
                    Tidak ada isian form.
                  </p>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {(request.service_request_answers ?? []).map((answer: any) => (
                  <div
                    key={answer.id}
                    className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-[#1f4bb7]/30 hover:bg-blue-50/20 transition-colors group"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#1f4bb7]/20 rounded-l-2xl group-hover:bg-[#1f4bb7] transition-colors" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
                      {answer.field_name}
                    </p>
                    <p className="mt-1.5 text-sm font-bold text-slate-800 pl-2 break-words">
                      {answer.field_value || "-"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Dokumen Persyaratan */}
          <Card title="Dokumen Persyaratan" icon={FileCheck}>
            <div className="space-y-3">
              {(request.service_request_documents ?? []).length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <FileCheck className="h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500 font-semibold">
                    Tidak ada dokumen persyaratan.
                  </p>
                </div>
              )}
              {(request.service_request_documents ?? []).map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 shadow-sm">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-800 truncate">
                        {doc.service_requirements?.document_name ||
                          doc.file_name}
                      </p>
                      <p className="text-xs font-medium text-slate-400 mt-0.5 truncate">
                        {doc.file_name}
                      </p>
                    </div>
                  </div>
                  {doc.file_path === "EXPIRED" ? (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200">
                      <AlertCircle className="h-3 w-3" />
                      Kadaluarsa
                    </span>
                  ) : signedUrlMap.get(doc.id) ? (
                    <a
                      href={signedUrlMap.get(doc.id)!}
                      target="_blank"
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-[#1f4bb7] bg-blue-50 border border-blue-100 hover:bg-[#1f4bb7] hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Lihat File
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>

          {/* Dokumen Hasil */}
          <Card title="Dokumen Hasil" icon={Download}>
            <div className="flex flex-col sm:flex-row items-start gap-4 bg-slate-50 rounded-2xl border border-slate-200/80 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <FileCheck className="h-6 w-6" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-sm font-bold text-slate-800">
                  Berkas Hasil Layanan
                </h4>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Dokumen ini akan diterbitkan kepada pemohon.
                </p>
                {generatedDoc ? (
                  <p className="mt-1.5 text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                    <FileCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate max-w-[260px]">
                      {generatedDoc.file_name}
                    </span>
                  </p>
                ) : (
                  <p className="mt-1.5 text-[11px] text-slate-400 italic">
                    Belum ada berkas yang diunggah.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 self-center sm:self-auto">
                <UploadResultButton
                  requestId={request.id}
                  hasFile={!!generatedDoc}
                />
                {generatedUrl && (
                  <a
                    href={generatedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 h-[38px]"
                  >
                    <Eye className="h-4 w-4" />
                    Lihat File
                  </a>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Actions & Logs */}
        <div className="space-y-6 lg:col-span-5">
          {/* Aksi Review */}
          <Card title="Aksi Review" icon={MessageSquare}>
            <form action={updateRequestStatusAction} className="space-y-5">
              <input type="hidden" name="request_id" value={request.id} />
              <div className="space-y-4">
                <Field label="Status Keputusan">
                  <div className="relative">
                    <select
                      name="status"
                      defaultValue={request.status}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/20 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_16px_center] bg-no-repeat pr-12 outline-none cursor-pointer"
                    >
                      <option value="under_review">🔄 Sedang Ditinjau</option>
                      <option value="revision_required">⚠️ Perlu Revisi</option>
                      <option value="rejected">❌ Ditolak</option>
                      <option value="approved">✅ Disetujui</option>
                      <option value="completed">🎉 Selesai</option>
                    </select>
                  </div>
                </Field>
                <Field label="Diproses oleh">
                  <div className="relative flex items-center">
                    <User className="absolute left-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      disabled
                      value={adminProfile.full_name || adminProfile.email}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm font-bold text-slate-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </Field>
                <Field
                  label="Catatan Admin (Opsional)"
                  hint="Alasan penolakan atau catatan tambahan"
                >
                  <Textarea
                    name="notes"
                    defaultValue={
                      request.revision_note || request.rejection_reason || ""
                    }
                    className="min-h-[100px] rounded-xl border-slate-300 focus:border-[#1f4bb7] focus:ring-[#1f4bb7]/20 text-sm shadow-sm"
                    placeholder="Tuliskan catatan di sini..."
                  />
                </Field>
              </div>
              <Button className="w-full h-12 rounded-xl text-sm font-bold bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.98]">
                <MessageSquare className="h-4 w-4 mr-2" />
                Simpan Keputusan
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                Zona Bahaya
              </p>
              <DeleteRequestButton requestId={request.id} />
            </div>
          </Card>

          {/* Riwayat Review & Aktivitas (Combined Timeline) */}
          <Card title="Riwayat & Aktivitas" icon={History}>
            <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <div className="relative pl-6 border-l-2 border-slate-100 space-y-6 before:absolute before:top-0 before:-left-[2px] before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-slate-200 before:to-transparent pb-4">
                {/* Combine and sort logs and reviews */}
                {(() => {
                  const combined = [
                    ...(request.service_request_reviews || []).map(
                      (r: any) => ({ ...r, type: "review" }),
                    ),
                    ...(request.activity_logs || []).map((l: any) => ({
                      ...l,
                      type: "log",
                    })),
                  ].sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime(),
                  );

                  if (combined.length === 0) {
                    return (
                      <p className="text-sm text-slate-400 italic">
                        Belum ada riwayat.
                      </p>
                    );
                  }

                  return combined.map((item: any, idx: number) => (
                    <div key={`${item.type}-${item.id}`} className="relative">
                      <div
                        className={`absolute -left-[35px] flex h-6 w-6 items-center justify-center rounded-full border-4 border-white shadow-sm ${
                          item.type === "review"
                            ? "bg-[#1f4bb7] text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {item.type === "review" ? (
                          <MessageSquare className="h-2.5 w-2.5" />
                        ) : (
                          <Activity className="h-2.5 w-2.5" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl border p-4 shadow-sm ${
                          item.type === "review"
                            ? "bg-blue-50/30 border-blue-100"
                            : "bg-white border-slate-100"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          {item.type === "review" ? (
                            <StatusBadge status={item.status} />
                          ) : (
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              Aktivitas
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-slate-400">
                            {formatDate(item.created_at)}
                          </span>
                        </div>

                        {item.type === "review" ? (
                          <>
                            <p className="text-sm font-medium text-slate-700">
                              {item.notes || (
                                <span className="italic text-slate-400">
                                  Tidak ada catatan
                                </span>
                              )}
                            </p>
                            <p className="mt-2 text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                              <User className="h-3 w-3" />
                              Oleh: {item.profiles?.full_name || "-"}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-bold text-slate-800">
                              {item.action}
                            </p>
                            {item.notes && (
                              <p className="text-xs text-slate-500 mt-1 font-medium">
                                {item.notes}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
