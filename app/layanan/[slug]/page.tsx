import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  FolderCheck,
  Timer,
  CircleDollarSign,
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
    <div className="space-y-6">
      <section className="ptsp-card p-6 md:p-8">
        <Link
          href="/layanan"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1f4bb7]"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke daftar layanan
        </Link>
        <span className="inline-flex rounded-full bg-[#e8efff] px-3 py-1 text-xs font-semibold text-[#1f4bb7]">
          Detail Unit Kerja
        </span>
        <h1 className="ptsp-title mt-3">{service.name}</h1>
        <p className="ptsp-subtitle mt-3 max-w-3xl">
          {service.description || "Deskripsi layanan belum diisi."}
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[340px,1fr]">
        <aside className="ptsp-card p-4">
          <h2 className="mb-3 text-base font-bold text-slate-900">
            Daftar Item Layanan
          </h2>
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
          {(service.service_items ?? []).map((item: any) => (
            <Card key={item.id} className="border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900">
                {item.name}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {item.description || "Deskripsi item layanan belum tersedia."}
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
            </Card>
          ))}

          <Link
            href="/dashboard/pengajuan/baru"
            className="inline-flex rounded-xl bg-[#1f4bb7] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#183f9a]"
          >
            Ajukan Permohonan
          </Link>
        </div>
      </section>
    </div>
  );
}
