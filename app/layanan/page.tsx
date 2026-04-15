import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { getPublicServices } from '@/lib/queries';

export default async function ServicesPage() {
  const services = await getPublicServices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Daftar Layanan</h1>
        <p className="mt-2 text-slate-600">Pilih layanan yang ingin Anda ajukan.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service: any) => (
          <Card key={service.id} title={service.name} description={service.description || ''}>
            <p className="text-sm text-slate-600">
              {service.service_items?.length ?? 0} item layanan tersedia.
            </p>
            <Link href={`/layanan/${service.slug}`} className="mt-4 inline-flex text-sm font-semibold text-green-700">
              Lihat detail layanan
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
