import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CircleDollarSign,
  FileText,
  FolderCheck,
  LayoutList,
  Timer,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { getServiceBySlug } from "@/lib/queries";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

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
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#f0c040]/20 blur-[100px]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-200">
            <Link href="/" className="hover:text-white transition-colors">
              Beranda
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href="/layanan"
              className="hover:text-white transition-colors"
            >
              Layanan
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{service.name}</span>
          </div>

          <div className="max-w-3xl">
            <Link
              href="/layanan"
              className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/20"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Katalog
            </Link>

            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
              {service.name}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-blue-100/90 sm:text-lg">
              {service.description || "Deskripsi unit kerja belum tersedia."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="relative -mt-10 mb-20 px-6 sm:px-10 lg:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[320px,1fr] xl:grid-cols-[380px,1fr]">
            {/* Sidebar */}
            <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 lg:sticky lg:top-28">
              <div className="mb-4 flex items-center gap-2 text-slate-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f4bb7]/10">
                  <LayoutList className="h-5 w-5 text-[#1f4bb7]" />
                </div>
                <h2 className="text-lg font-black">Daftar Item Layanan</h2>
              </div>

              <div className="space-y-2">
                {(service.service_items ?? []).map((item: any, idx: number) => (
                  <div
                    key={item.id}
                    className="group flex flex-col gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-[#1f4bb7]/20 hover:bg-[#1f4bb7]/5"
                  >
                    <p className="text-sm font-bold text-slate-800 transition-colors group-hover:text-[#1f4bb7]">
                      {idx + 1}. {item.name}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {item.service_requirements?.length ?? 0} Dokumen •{" "}
                      {item.service_form_fields?.length ?? 0} Formulir
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <Link
                  href="/dashboard/pengajuan/baru"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0f8a54] to-[#0d7a4b] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-900/30"
                >
                  Ajukan Permohonan <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>

            {/* Content list */}
            <div className="space-y-5">
              {(service.service_items ?? []).map((item: any, idx: number) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                >
                  <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-xl font-black text-slate-900">
                        <span className="text-slate-400 mr-2">
                          {String(idx + 1).padStart(2, "0")}.
                        </span>
                        {item.name}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1f4bb7]/20 bg-[#1f4bb7]/5 px-3 py-1.5 text-[11px] font-bold text-[#1f4bb7]">
                        <FolderCheck className="h-3.5 w-3.5" />
                        {item.service_requirements?.length ?? 0} Dokumen Syarat
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <p className="text-sm leading-relaxed text-slate-600 mb-6">
                      {item.description ||
                        "Deskripsi rinci mengenai item layanan ini belum tersedia."}
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/50">
                          <CircleDollarSign className="h-5 w-5 text-amber-600" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Biaya
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-slate-800">
                          Sesuai Ketentuan
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100/50">
                          <Timer className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Durasi
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-slate-800">
                          Sesuai Unit Kerja
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100/50">
                          <FileText className="h-5 w-5 text-emerald-600" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Formulir
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-slate-800">
                          {item.service_form_fields?.length ?? 0} Kolom Input
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100/50">
                          <FolderCheck className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Persyaratan
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-slate-800">
                          {item.service_requirements?.length ?? 0} File Upload
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
