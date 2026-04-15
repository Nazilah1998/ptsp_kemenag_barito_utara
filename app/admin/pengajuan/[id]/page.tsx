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
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{request.request_number}</h1>
            <p className="mt-1 text-slate-600">
              {request.profiles?.full_name || '-'} | {request.profiles?.email}
            </p>
          </div>
          <StatusBadge status={request.status} />
        </div>
      </div>

      <Card title="Ringkasan Pengajuan">
        <dl className="grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">Layanan</dt>
            <dd className="font-medium">{request.services?.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Item Layanan</dt>
            <dd className="font-medium">{request.service_items?.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Tanggal Pengajuan</dt>
            <dd className="font-medium">{formatDate(request.created_at)}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Diproses oleh</dt>
            <dd className="font-medium">{adminProfile.full_name || adminProfile.email}</dd>
          </div>
        </dl>
      </Card>

      <Card title="Jawaban Form">
        <div className="space-y-3">
          {(request.service_request_answers ?? []).map((answer: any) => (
            <div key={answer.id} className="rounded-xl border border-slate-200 p-3">
              <p className="text-sm text-slate-500">{answer.field_name}</p>
              <p className="font-medium">{answer.field_value || '-'}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Dokumen Persyaratan">
        <div className="space-y-3">
          {(request.service_request_documents ?? []).map((doc: any) => (
            <div key={doc.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{doc.service_requirements?.document_name || doc.file_name}</p>
                  <p className="text-sm text-slate-500">{doc.file_name}</p>
                </div>
                {signedUrlMap.get(doc.id) ? (
                  <a href={signedUrlMap.get(doc.id)!} target="_blank" className="text-sm font-medium text-green-700">
                    Preview Dokumen
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Aksi Review">
        <form action={updateRequestStatusAction} className="space-y-4">
          <input type="hidden" name="request_id" value={request.id} />
          <Field label="Status">
            <select name="status" defaultValue={request.status} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="under_review">under_review</option>
              <option value="revision_required">revision_required</option>
              <option value="rejected">rejected</option>
              <option value="approved">approved</option>
              <option value="completed">completed</option>
            </select>
          </Field>
          <Field label="Catatan Admin" hint="Dipakai untuk revisi, penolakan, atau catatan persetujuan">
            <Textarea name="notes" defaultValue={request.revision_note || request.rejection_reason || ''} />
          </Field>
          <Button>Simpan Status</Button>
        </form>
      </Card>

      <Card title="Dokumen Hasil">
        <div className="flex flex-wrap items-center gap-4">
          <GeneratePdfButton requestId={request.id} />
          {generatedUrl ? (
            <a href={generatedUrl} target="_blank" className="text-sm font-medium text-green-700">
              Download PDF Terbaru
            </a>
          ) : (
            <p className="text-sm text-slate-500">Belum ada dokumen hasil.</p>
          )}
        </div>
      </Card>

      <Card title="Riwayat Review">
        <div className="space-y-3">
          {(request.service_request_reviews ?? []).map((review: any) => (
            <div key={review.id} className="rounded-xl border border-slate-200 p-3">
              <p className="font-medium text-slate-900">{review.status}</p>
              <p className="text-sm text-slate-500">{review.notes || '-'}</p>
              <p className="mt-1 text-xs text-slate-400">
                {review.profiles?.full_name || '-'} | {formatDate(review.created_at)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Aktivitas">
        <div className="space-y-3">
          {(request.activity_logs ?? []).map((log: any) => (
            <div key={log.id} className="rounded-xl border border-slate-200 p-3">
              <p className="font-medium">{log.action}</p>
              <p className="text-sm text-slate-500">{log.notes || '-'}</p>
              <p className="mt-1 text-xs text-slate-400">{formatDate(log.created_at)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
