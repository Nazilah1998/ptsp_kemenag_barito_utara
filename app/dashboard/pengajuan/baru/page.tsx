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
      <section className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1f4bb7] to-[#0f8a54]"></div>

        <div className="relative grid gap-6 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#1f4bb7]">
              ✨ Pengajuan Layanan
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Buat Pengajuan Baru
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base max-w-xl">
              Pilih unit layanan, tentukan item layanan, lengkapi form, lalu
              unggah dokumen persyaratan Anda dengan mudah dalam satu alur.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col justify-center rounded-xl border border-slate-100 bg-slate-50 px-6 py-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Unit Layanan
              </p>
              <p className="text-3xl font-black text-[#1f4bb7]">
                {catalog.length}
              </p>
            </div>
            <div className="flex flex-col justify-center rounded-xl border border-slate-100 bg-slate-50 px-6 py-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Item Layanan
              </p>
              <p className="text-3xl font-black text-[#1f4bb7]">{totalItems}</p>
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
