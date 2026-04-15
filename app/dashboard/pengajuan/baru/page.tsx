import { Card } from '@/components/ui/card';
import { NewRequestForm } from '@/components/forms/new-request-form';
import { getServiceCatalog } from '@/lib/queries';
import { requireAuth } from '@/lib/auth';

export default async function NewRequestPage() {
  await requireAuth();
  const catalog = await getServiceCatalog();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Buat Pengajuan Baru</h1>
        <p className="mt-2 text-slate-600">
          Pilih layanan, isi form, lalu upload dokumen persyaratan.
        </p>
      </div>

      <Card>
        <NewRequestForm catalog={catalog} />
      </Card>
    </div>
  );
}
