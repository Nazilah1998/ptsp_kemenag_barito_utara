import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { getDrivePreviewUrl } from "@/lib/google-drive";
import { UploadRevisionForm } from "@/components/forms/upload-revision-form";
import { EditAnswersDialog } from "@/components/dashboard/edit-answers-dialog";
import { DeleteRequestButton } from "@/components/dashboard/delete-request-button";

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

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireAuth();
  const { id } = await params;
  const admin = createAdminClient();

  const { data: request } = await admin
    .from("service_requests")
    .select(
      `
      *,
      services (name),
      service_items (name),
      service_request_answers (*),
      service_request_documents (
        *,
        service_requirements (*)
      ),
      generated_documents (*),
      activity_logs (*)
    `,
    )
    .eq("id", id)
    .eq("user_id", profile.id)
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

  const generatedDoc = request.generated_documents?.[0];
  const generatedUrl = generatedDoc
    ? await getSignedUrl("generated-documents", generatedDoc.file_path)
    : null;

  const signedUrlMap = new Map(docUrls.map((item) => [item.id, item.url]));

  const { data: requirements } = await admin
    .from("service_requirements")
    .select("*")
    .eq("service_item_id", request.service_item_id)
    .order("id");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {request.request_number}
            </h1>
            <p className="mt-1 text-slate-600">
              {request.services?.name} | {request.service_items?.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <DeleteRequestButton
              requestId={request.id}
              status={request.status}
            />
            <StatusBadge status={request.status} />
          </div>
        </div>
      </div>

      <Card title="Detail Pengajuan">
        <dl className="grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">Tanggal Pengajuan</dt>
            <dd className="font-medium">{formatDate(request.created_at)}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Tanggal Disetujui</dt>
            <dd className="font-medium">{formatDate(request.approved_at)}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Catatan Revisi</dt>
            <dd className="font-medium">{request.revision_note || "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500">Alasan Penolakan</dt>
            <dd className="font-medium">{request.rejection_reason || "-"}</dd>
          </div>
        </dl>
      </Card>

      <Card title="Jawaban Form">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Berikut adalah data yang Anda isikan pada formulir pengajuan.
          </p>
          <EditAnswersDialog
            requestId={request.id}
            answers={request.service_request_answers ?? []}
            documents={request.service_request_documents ?? []}
            disabled={
              !["submitted", "under_review", "revision_required"].includes(
                request.status,
              )
            }
          />
        </div>
        <div className="space-y-3">
          {(request.service_request_answers ?? []).map((answer: any) => (
            <div
              key={answer.id}
              className="rounded-xl border border-slate-200 p-3"
            >
              <p className="text-sm text-slate-500">{answer.field_name}</p>
              <p className="font-medium text-slate-900">
                {answer.field_value || "-"}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Dokumen Persyaratan">
        <div className="space-y-4">
          {(request.service_request_documents ?? []).map((doc: any) => (
            <div
              key={doc.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {doc.service_requirements?.document_name || doc.file_name}
                  </p>
                  <p className="text-sm text-slate-500">{doc.file_name}</p>
                </div>
                {signedUrlMap.get(doc.id) ? (
                  <a
                    href={signedUrlMap.get(doc.id)!}
                    target="_blank"
                    className="text-sm font-medium text-green-700"
                  >
                    Preview Dokumen
                  </a>
                ) : null}
              </div>
            </div>
          ))}

          {!request.service_request_documents?.length ? (
            <p className="text-sm text-slate-500">
              Belum ada dokumen terupload.
            </p>
          ) : null}
        </div>
      </Card>

      {request.status === "revision_required" ? (
        <Card title="Upload Revisi">
          <div className="grid gap-4 md:grid-cols-2">
            {(requirements ?? []).map((requirement: any) => (
              <UploadRevisionForm
                key={requirement.id}
                requestId={request.id}
                requirement={requirement}
              />
            ))}
          </div>
        </Card>
      ) : null}

      <Card title="Dokumen Hasil">
        {generatedUrl ? (
          <a
            href={generatedUrl}
            target="_blank"
            className="inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white"
          >
            Download Hasil PDF
          </a>
        ) : (
          <p className="text-sm text-slate-500">
            Dokumen hasil belum tersedia. Dokumen akan muncul setelah admin
            menyetujui dan generate PDF.
          </p>
        )}
      </Card>

      <Card title="Riwayat Aktivitas">
        <div className="space-y-3">
          {(request.activity_logs ?? []).map((log: any) => (
            <div
              key={log.id}
              className="rounded-xl border border-slate-200 p-3"
            >
              <p className="font-medium text-slate-900">{log.action}</p>
              <p className="text-sm text-slate-500">{log.notes || "-"}</p>
              <p className="mt-1 text-xs text-slate-400">
                {formatDate(log.created_at)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Link
        href="/dashboard/pengajuan"
        className="text-sm font-medium text-green-700"
      >
        Kembali ke daftar pengajuan
      </Link>
    </div>
  );
}
