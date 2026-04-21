import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card } from '@/components/ui/card';
import { GeneratePdfButton } from '@/components/admin/generate-pdf-button';
import { formatDate } from '@/lib/utils';

async function getSignedUrl(path?: string | null) {
  if (!path) return null;
  const admin = createAdminClient();
  const { data } = await admin.storage.from('generated-documents').createSignedUrl(path, 3600);
  return data?.signedUrl || null;
}

export default async function AdminGeneratedDocumentsPage() {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: requests } = await admin
    .from('service_requests')
    .select(`
      id,
      request_number,
      status,
      profiles!service_requests_user_id_fkey (full_name),
      generated_documents (*)
    `)
    .order('created_at', { ascending: false });

  const urlEntries = await Promise.all(
    (requests ?? []).map(async (request: any) => ({
      id: request.id,
      url: await getSignedUrl(request.generated_documents?.[0]?.file_path)
    }))
  );
  const urlMap = new Map(urlEntries.map((item) => [item.id, item.url]));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#0f2563] to-[#1f4bb7] px-5 py-4 shadow-md shadow-blue-900/20">
        <h1 className="text-3xl font-bold text-white">Dokumen Hasil</h1>
        <p className="mt-2 text-blue-100/80">Generate ulang dan download dokumen PDF hasil layanan.</p>
      </div>

      <Card>
        <div className="space-y-4">
          {(requests ?? []).map((request: any) => (
            <div key={request.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-[1.4fr,auto,auto] md:items-center">
              <div>
                <p className="font-medium text-slate-900">{request.request_number}</p>
                <p className="text-sm text-slate-500">{request.profiles?.full_name || '-'}</p>
                {request.generated_documents?.[0] ? (
                  <p className="text-xs text-slate-400">
                    Dibuat: {formatDate(request.generated_documents[0].generated_at)}
                  </p>
                ) : null}
              </div>
              <GeneratePdfButton requestId={request.id} />
              {urlMap.get(request.id) ? (
                <a href={urlMap.get(request.id)!} target="_blank" className="text-sm font-medium text-green-700">
                  Download PDF
                </a>
              ) : (
                <span className="text-sm text-slate-400">Belum ada file</span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
