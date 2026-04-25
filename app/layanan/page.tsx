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
    <div className="w-full overflow-hidden">
      {/* Immersive Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d2d8a] via-[#1f4bb7] to-[#1a53c8] pt-12 pb-20 md:pt-16 md:pb-28">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#5eeaa5]/20 blur-[100px]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
                <BadgeCheck className="h-4 w-4 text-[#5eeaa5]" />
                Katalog Layanan PTSP
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
                Jelajahi Layanan{" "}
                <span className="bg-gradient-to-r from-[#5eeaa5] to-[#38d9a9] bg-clip-text text-transparent">
                  Kementerian Agama
                </span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-blue-100/90 sm:text-lg">
                Pilih unit kerja, lihat item layanan, cek detail persyaratan,
                lalu lanjutkan pengajuan secara online dari perangkat apa pun.
                Cepat, transparan, dan dapat dilacak.
              </p>

              <div className="mt-8">
                <Link
                  href="/dashboard/pengajuan/baru"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-[#1f4bb7] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-slate-50"
                >
                  <ArrowRight className="h-4 w-4" />
                  Mulai Pengajuan Baru
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col xl:flex-row">
              <div className="flex items-center gap-4 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md shadow-xl lg:w-48">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                    Unit Layanan
                  </p>
                  <p className="text-3xl font-black text-white">
                    {services.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md shadow-xl lg:w-48">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-[#5eeaa5]">
                  <Layers3 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                    Total Item
                  </p>
                  <p className="text-3xl font-black text-white">{totalItems}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="relative -mt-10 mb-20 px-6 sm:px-10 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="rounded-[2.5rem] bg-white p-6 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <ServicesFilter services={services} />
          </div>
        </div>
      </section>
    </div>
  );
}
