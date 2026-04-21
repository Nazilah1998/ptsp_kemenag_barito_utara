import { ArrowRight, BadgeCheck, Building2, Layers3 } from "lucide-react";
import Link from "next/link";
import { ServicesFilter } from "@/components/services/services-filter";
import { getPublicServices } from "@/lib/queries";

export default async function ServicesPage() {
  const services = await getPublicServices();
  const totalItems = services.reduce(
    (acc: number, service: any) => acc + (service.service_items?.length ?? 0),
    0,
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="ptsp-hero-gradient ptsp-grid-bg relative overflow-hidden rounded-3xl px-4 py-6 text-white sm:px-6 sm:py-8 md:px-8 md:py-10">
        <div className="absolute -left-20 -top-20 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-[#9f8437]/40 blur-3xl" />

        <div className="relative grid gap-5 lg:grid-cols-[1.1fr,0.9fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
              <BadgeCheck className="h-3.5 w-3.5" />
              Katalog Layanan PTSP
            </span>
            <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              Jelajahi Layanan Kementerian Agama Secara Cepat & Transparan
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-blue-50 sm:text-base">
              Pilih unit kerja, lihat item layanan, cek detail persyaratan, lalu
              lanjutkan pengajuan secara online dari perangkat apa pun.
            </p>

            <div className="mt-4">
              <Link
                href="/dashboard/pengajuan/baru"
                className="inline-flex min-h-10 items-center rounded-xl border border-white/50 bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-black/10 backdrop-blur transition hover:bg-white/20"
              >
                <ArrowRight className="mr-1.5 h-4 w-4" />
                Ajukan Layanan
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-blue-100">Unit Layanan</p>
              <div className="mt-1 flex items-center gap-2 text-xl font-bold sm:text-2xl">
                <Building2 className="h-5 w-5" />
                {services.length}
              </div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs text-blue-100">Total Item Layanan</p>
              <div className="mt-1 flex items-center gap-2 text-xl font-bold sm:text-2xl">
                <Layers3 className="h-5 w-5" />
                {totalItems}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesFilter services={services} />
    </div>
  );
}
