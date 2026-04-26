import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { DokumenHasilClient } from "@/components/admin/dokumen-hasil/dokumen-hasil-client";
import { getDrivePreviewUrl } from "@/lib/google-drive";

async function getSignedUrl(path?: string | null) {
  if (!path) return null;

  // Handle Google Drive links
  if (path.startsWith("gdrive:")) {
    const fileId = path.replace("gdrive:", "");
    return getDrivePreviewUrl(fileId);
  }

  const admin = createAdminClient();
  const { data } = await admin.storage
    .from("generated-documents")
    .createSignedUrl(path, 3600);
  return data?.signedUrl || null;
}

export default async function AdminGeneratedDocumentsPage() {
  await requireAdmin();
  const admin = createAdminClient();

  // Fetch requests along with profiles, services, and generated_documents
  const { data: requests } = await admin
    .from("service_requests")
    .select(
      `
      id,
      request_number,
      status,
      profiles!service_requests_user_id_fkey (full_name),
      services (id, name),
      generated_documents (*)
    `,
    )
    .order("created_at", { ascending: false });

  // Fetch list of services for the filter dropdown
  const { data: services } = await admin
    .from("services")
    .select("id, name")
    .order("name");

  // Generate signed URLs for existing documents
  const urlEntries = await Promise.all(
    (requests ?? []).map(async (request: any) => ({
      id: request.id,
      url: await getSignedUrl(request.generated_documents?.[0]?.file_path),
    })),
  );

  const urlMap = Object.fromEntries(
    urlEntries.map((item) => [item.id, item.url]),
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#0f2563] to-[#1f4bb7] px-5 py-6 shadow-md shadow-blue-900/20">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Dokumen Hasil
        </h1>
        <p className="mt-2 text-sm sm:text-base text-blue-100/90 font-medium max-w-2xl">
          Kelola dokumen PDF hasil layanan. Anda dapat mencari, membuat ulang,
          dan mengunduh dokumen resmi yang telah diterbitkan untuk pemohon.
        </p>
      </div>

      <DokumenHasilClient
        requests={requests || []}
        urlMap={urlMap}
        services={services || []}
      />
    </div>
  );
}
