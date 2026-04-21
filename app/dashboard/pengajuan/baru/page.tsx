import { Card } from "@/components/ui/card";
import { NewRequestForm } from "@/components/forms/new-request-form";
import { getServiceCatalog } from "@/lib/queries";
import { requireAuth } from "@/lib/auth";

export default async function NewRequestPage() {
  await requireAuth();
  const catalog = await getServiceCatalog();
  const totalItems = catalog.reduce(
    (acc: number, service: any) => acc + (service.service_items?.length ?? 0),
    0,
  );

  return (
    <div className="space-y-5 md:space-y-7">
      <section className="ptsp-hero-gradient ptsp-grid-bg overflow-hidden rounded-2xl p-4 text-white sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1.2fr,0.8fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
              Pengajuan Layanan
            </span>
            <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
              Buat Pengajuan Baru dengan Alur yang Lebih Cepat
            </h1>
            <p className="mt-2 text-sm text-blue-50 sm:text-base">
              Pilih unit layanan, tentukan item layanan, isi data pemohon, lalu
              unggah dokumen persyaratan dalam satu halaman.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur">
              <p className="text-[11px] text-blue-100">Unit Layanan</p>
              <p className="mt-1 text-xl font-bold">{catalog.length}</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur">
              <p className="text-[11px] text-blue-100">Item Layanan</p>
              <p className="mt-1 text-xl font-bold">{totalItems}</p>
            </div>
          </div>
        </div>
      </section>

      <Card className="border-slate-200 p-3 sm:p-5">
        <NewRequestForm catalog={catalog} />
      </Card>
    </div>
  );
}
