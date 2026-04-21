import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
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
    <div className="space-y-6 md:space-y-8">
      <section className="ptsp-card overflow-hidden">
        <div className="h-1.5 w-full bg-linear-to-r from-[#1f4bb7] via-[#2d7fff] to-[#00a2b8]" />
        <div className="p-5 sm:p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
            <Link href="/" className="hover:text-[#1f4bb7]">
              Beranda
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/layanan" className="hover:text-[#1f4bb7]">
              Layanan
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-slate-700">{service.name}</span>
          </div>

          <Link
            href="/layanan"
            className="mb-4 inline-flex min-h-9 items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-[#1f4bb7] hover:bg-blue-100"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke daftar layanan
          </Link>

          <span className="inline-flex rounded-full bg-[#e8efff] px-3 py-1 text-xs font-semibold text-[#1f4bb7]">
            Detail Unit Kerja
          </span>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
            {service.name}
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
            {service.description || "Deskripsi layanan belum diisi."}
          </p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[320px,1fr] xl:grid-cols-[360px,1fr]">
        <aside className="ptsp-card h-fit p-4 sm:p-5 lg:sticky lg:top-24">
          <div className="mb-3 flex items-center gap-2 text-slate-900">
            <LayoutList className="h-4 w-4 text-[#1f4bb7]" />
            <h2 className="text-base font-bold">Daftar Item Layanan</h2>
          </div>

          <div className="space-y-2">
            {(service.service_items ?? []).map((item: any, idx: number) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <p className="text-sm font-semibold text-slate-800">
                  {idx + 1}. {item.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.service_requirements?.length ?? 0} persyaratan •{" "}
                  {item.service_form_fields?.length ?? 0} field form
                </p>
              </div>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          {(service.service_items ?? []).map((item: any, idx: number) => (
            <Card
              key={item.id}
              className="overflow-hidden border-slate-200 p-0"
            >
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                    {idx + 1}. {item.name}
                  </h3>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    {item.service_requirements?.length ?? 0} dokumen
                  </span>
                </div>
              </div>

              <div className="px-4 py-4 sm:px-5">
                <p className="text-sm text-slate-600">
                  {item.description || "Deskripsi item layanan belum tersedia."}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <CircleDollarSign className="h-4 w-4 text-[#1f4bb7]" />
                      Biaya
                    </div>
                    <p className="text-sm text-slate-600">Sesuai ketentuan</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <Timer className="h-4 w-4 text-[#1f4bb7]" />
                      Durasi Layanan
                    </div>
                    <p className="text-sm text-slate-600">
                      Sesuai ketentuan unit kerja
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <FileText className="h-4 w-4 text-[#1f4bb7]" />
                      Form Dinamis
                    </div>
                    <p className="text-sm text-slate-600">
                      {item.service_form_fields?.length ?? 0} field
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <FolderCheck className="h-4 w-4 text-[#1f4bb7]" />
                      Persyaratan
                    </div>
                    <p className="text-sm text-slate-600">
                      {item.service_requirements?.length ?? 0} dokumen
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <div className="sticky bottom-3 z-10 rounded-2xl border border-blue-200 bg-white/95 p-3 shadow-sm backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
            <Link
              href="/dashboard/pengajuan/baru"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#1f4bb7] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#183f9a] sm:w-auto"
            >
              Ajukan Permohonan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
