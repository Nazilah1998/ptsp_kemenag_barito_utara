import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Field } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { updateRequestStatusAction } from '@/lib/actions/admin';
import { formatDate } from '@/lib/utils';
import { GeneratePdfButton } from '@/components/admin/generate-pdf-button';
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
} from 'lucide-react';

async function getSignedUrl(bucket: string, path?: string | null) {
  if (!path) return null;
  const admin = createAdminClient();
  const { data } = await admin.storage.from(bucket).createSignedUrl(path, 3600);
  return data?.signedUrl || null;
}

export default async function AdminRequestDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const adminProfile = await requireAdmin();
  const { id } = await params;
  const admin = createAdminClient();

  const { data: request } = await admin
    .from('service_requests')
    .select(`
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
    `)
    .eq('id', id)
    .maybeSingle();

  if (!request) {
    notFound();
  }

  const docUrls = await Promise.all(
    (request.service_request_documents ?? []).map(async (doc: any) => ({
      id: doc.id,
      url: await getSignedUrl('request-documents', doc.file_path)
    }))
  );

  const generatedDoc = request.generated_documents?.[0];
  const generatedUrl = generatedDoc ? await getSignedUrl('generated-documents', generatedDoc.file_path) : null;
  const signedUrlMap = new Map(docUrls.map((item) => [item.id, item.url]));

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/pengajuan"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#1f4bb7] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar pengajuan
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-blue-200/80 font-medium">Detail Pengajuan</p>
              <h1 className="mt-1 text-xl font-bold text-white tracking-tight">
                {request.request_number}
              </h1>
            </div>
            <StatusBadge status={request.status} />
          </div>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
              <User className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Pemohon</p>
              <p className="text-sm font-semibold text-slate-900">{request.profiles?.full_name || '-'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
              <FileText className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Layanan</p>
              <p className="text-sm font-semibold text-slate-900">{request.services?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
              <Hash className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Item Layanan</p>
              <p className="text-sm font-semibold text-slate-900">{request.service_items?.name || '-'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
              <Calendar className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Tanggal</p>
              <p className="text-sm font-semibold text-slate-900">{formatDate(request.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Jawaban Form */}
        <Card title="Jawaban Form" icon={ClipboardList}>
          <div className="space-y-3">
            {(request.service_request_answers ?? []).length === 0 && (
              <p className="text-sm text-slate-400 italic">Tidak ada jawaban form.</p>
            )}
            {(request.service_request_answers ?? []).map((answer: any) => (
              <div key={answer.id} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{answer.field_name}</p>
                <p className="mt-1 text-sm font-medium text-slate-800">{answer.field_value || '-'}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Dokumen Persyaratan */}
        <Card title="Dokumen Persyaratan" icon={FileCheck}>
          <div className="space-y-3">
            {(request.service_request_documents ?? []).length === 0 && (
              <p className="text-sm text-slate-400 italic">Tidak ada dokumen.</p>
            )}
            {(request.service_request_documents ?? []).map((doc: any) => (
              <div key={doc.id} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-slate-800 truncate">{doc.service_requirements?.document_name || doc.file_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{doc.file_name}</p>
                  </div>
                  {signedUrlMap.get(doc.id) ? (
                    <a
                      href={signedUrlMap.get(doc.id)!}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 hover:bg-emerald-100 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Preview
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Aksi Review */}
      <Card title="Aksi Review" icon={MessageSquare}>
        <form action={updateRequestStatusAction} className="space-y-5">
          <input type="hidden" name="request_id" value={request.id} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Status">
              <select
                name="status"
                defaultValue={request.status}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-200 hover:border-slate-400 focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/10 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10"
              >
                <option value="under_review">Sedang Ditinjau</option>
                <option value="revision_required">Perlu Revisi</option>
                <option value="rejected">Ditolak</option>
                <option value="approved">Disetujui</option>
                <option value="completed">Selesai</option>
              </select>
            </Field>
            <Field label="Diproses oleh">
              <input
                type="text"
                disabled
                value={adminProfile.full_name || adminProfile.email}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
            </Field>
          </div>
          <Field label="Catatan Admin" hint="Dipakai untuk revisi, penolakan, atau catatan persetujuan">
            <Textarea name="notes" defaultValue={request.revision_note || request.rejection_reason || ''} />
          </Field>
          <div className="flex justify-end">
            <Button>Simpan Status</Button>
          </div>
        </form>
      </Card>

      {/* Dokumen Hasil */}
      <Card title="Dokumen Hasil" icon={Download}>
        <div className="flex flex-wrap items-center gap-4">
          <GeneratePdfButton requestId={request.id} />
          {generatedUrl ? (
            <a
              href={generatedUrl}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 hover:bg-emerald-100 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download PDF Terbaru
            </a>
          ) : (
            <p className="text-sm text-slate-400 italic">Belum ada dokumen hasil.</p>
          )}
        </div>
      </Card>

      {/* Two Column: Review History & Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Riwayat Review */}
        <Card title="Riwayat Review" icon={History}>
          <div className="space-y-3">
            {(request.service_request_reviews ?? []).length === 0 && (
              <p className="text-sm text-slate-400 italic">Belum ada riwayat review.</p>
            )}
            {(request.service_request_reviews ?? []).map((review: any) => (
              <div key={review.id} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <StatusBadge status={review.status} />
                  <p className="text-[11px] text-slate-400">{formatDate(review.created_at)}</p>
                </div>
                <p className="text-sm text-slate-600">{review.notes || '-'}</p>
                <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {review.profiles?.full_name || '-'}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Aktivitas */}
        <Card title="Log Aktivitas" icon={Activity}>
          <div className="space-y-3">
            {(request.activity_logs ?? []).length === 0 && (
              <p className="text-sm text-slate-400 italic">Belum ada log aktivitas.</p>
            )}
            {(request.activity_logs ?? []).map((log: any) => (
              <div key={log.id} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-slate-800">{log.action}</p>
                  <p className="text-[11px] text-slate-400 whitespace-nowrap">{formatDate(log.created_at)}</p>
                </div>
                <p className="text-xs text-slate-500">{log.notes || '-'}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
