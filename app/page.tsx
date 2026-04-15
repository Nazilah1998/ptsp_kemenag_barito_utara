import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileCheck2, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPublicServices } from '@/lib/queries';

export default async function HomePage() {
  const services = await getPublicServices();

  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-3xl bg-gradient-to-r from-green-800 to-green-700 px-8 py-12 text-white md:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm">
            Portal PTSP Kemenag Barito Utara
          </span>
          <h1 className="text-4xl font-bold leading-tight">
            Layanan digital PTSP yang rapi, cepat, dan transparan.
          </h1>
          <p className="max-w-2xl text-green-50">
            Ajukan layanan, upload dokumen, pantau status, terima revisi, dan download hasil
            layanan dalam satu portal.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register">
              <Button>Daftar Sekarang</Button>
            </Link>
            <Link href="/layanan">
              <Button variant="outline" className="border-white bg-transparent text-white hover:bg-white/10">
                Lihat Layanan
              </Button>
            </Link>
          </div>
        </div>

        <Card className="bg-white/95 text-slate-900">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-green-700" />
              <div>
                <h3 className="font-semibold">Registrasi dan login</h3>
                <p className="text-sm text-slate-600">Buat akun lalu masuk ke dashboard pemohon.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileCheck2 className="mt-1 h-5 w-5 text-green-700" />
              <div>
                <h3 className="font-semibold">Pengajuan layanan</h3>
                <p className="text-sm text-slate-600">
                  Isi form dinamis dan upload dokumen persyaratan langsung ke sistem.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 text-green-700" />
              <div>
                <h3 className="font-semibold">Verifikasi admin</h3>
                <p className="text-sm text-slate-600">
                  Status pengajuan jelas. Ada revisi, tolakan, persetujuan, dan hasil PDF.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Daftar layanan aktif</h2>
            <p className="text-slate-600">Layanan yang tersedia untuk diajukan saat ini.</p>
          </div>
          <Link href="/layanan" className="inline-flex items-center gap-2 text-sm font-medium text-green-700">
            Semua layanan <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service: any) => (
            <Card key={service.id} title={service.name} description={service.description || ''}>
              <p className="text-sm text-slate-600">
                {service.service_items?.length ?? 0} item layanan tersedia.
              </p>
              <Link href={`/layanan/${service.slug}`} className="mt-4 inline-flex text-sm font-semibold text-green-700">
                Lihat detail
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
