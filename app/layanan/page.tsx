import Link from "next/link";
import { Building2, ArrowRight, Layers3, ListTree } from "lucide-react";
import { getPublicServices } from "@/lib/queries";

export default async function ServicesPage() {
  const services = await getPublicServices();
  const totalItems = services.reduce(
    (acc: number, service: any) => acc + (service.service_items?.length ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      <section className="ptsp-card p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-[1fr,auto] md:items-end">
          <div>
            <span className="inline-flex rounded-full bg-[#e8efff] px-3 py-1 text-xs font-semibold text-[#1f4bb7]">
              Unit Kerja
            </span>
            <h1 className="ptsp-title mt-3">Jenis Layanan PTSP</h1>
            <p className="ptsp-subtitle mt-2">
              Berikut jenis layanan yang ada di unit kerja Kantor Kementerian
              Agama secara online.
            </p>
          </div>
          <div className="grid gap-2 md:min-w-60">
            <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-[#1f4bb7]">
              <Building2 className="h-4 w-4" />
              Unit layanan: {services.length}
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
              <Layers3 className="h-4 w-4" />
              Total item: {totalItems}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {services.map((service: any, idx: number) => (
          <div key={service.id} className="ptsp-card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 bg-blue-50 px-4 py-3">
              <h2 className="text-base font-bold text-[#0f3f9e] md:text-lg">
                {idx + 1}. {service.name}
              </h2>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                {service.service_items?.length ?? 0} item
              </span>
            </div>

            <div className="space-y-2 p-4">
              {(service.service_items ?? []).length ? (
                (service.service_items ?? []).map((item: any) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5"
                  >
                    <div className="flex items-start gap-2">
                      <ListTree className="mt-0.5 h-4 w-4 text-[#1f4bb7]" />
                      <p className="text-sm font-medium text-slate-800">
                        {item.name}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                  Belum ada item layanan pada unit ini.
                </p>
              )}

              <div className="pt-2">
                <Link
                  href={`/layanan/${service.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#1f4bb7]"
                >
                  Lihat detail layanan <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
