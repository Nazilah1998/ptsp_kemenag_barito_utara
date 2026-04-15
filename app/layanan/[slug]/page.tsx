import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { getServiceBySlug } from '@/lib/queries';

export default async function ServiceDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-3xl font-bold text-slate-900">{service.name}</h1>
        <p className="mt-3 max-w-3xl text-slate-600">{service.description || 'Deskripsi belum diisi.'}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">Item layanan</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(service.service_items ?? []).map((item: any) => (
            <Card key={item.id} title={item.name} description={item.description || ''}>
              <p className="text-sm text-slate-600">
                {item.service_form_fields?.length ?? 0} field form dan{' '}
                {item.service_requirements?.length ?? 0} dokumen persyaratan.
              </p>
            </Card>
          ))}
        </div>
      </div>

      <Link
        href="/dashboard/pengajuan/baru"
        className="inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
      >
        Ajukan layanan ini
      </Link>
    </div>
  );
}
