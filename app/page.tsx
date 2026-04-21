import Link from "next/link";
import {
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building2,
  BookOpenCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SiteHomeFaq } from "@/components/site-home-faq";
import { getPublicServices } from "@/lib/queries";

export default async function HomePage() {
  const services = await getPublicServices();

  return (
    <div className="space-y-8 md:space-y-10">
      <section className="ptsp-hero-gradient ptsp-grid-bg overflow-hidden rounded-3xl px-6 py-10 text-white md:px-10 md:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-5">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold md:text-sm">
              Pelayanan Terpadu Satu Pintu (PTSP)
            </span>
            <h1 className="max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">
              Pelayanan Terpadu Satu Pintu (PTSP) Kantor Kementerian Agama
              Kabupaten Barito Utara
            </h1>
            <p className="max-w-2xl text-sm text-blue-50 md:text-base">
              Portal resmi untuk layanan perizinan, non-perizinan, informasi,
              konsultasi, pengaduan, dan legalisir secara online dengan proses
              yang mudah, cepat, dan transparan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/login/pemohon">
                <Button className="bg-[#0f8a54] text-white hover:bg-[#0b7446]">
                  Login Pemohon
                </Button>
              </Link>
              <Link href="/layanan">
                <Button
                  variant="outline"
                  className="border-[#c8d6ff] bg-[#eaf0ff] text-[#1f3f92] hover:bg-[#dbe6ff]"
                >
                  Akses Layanan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-[#d7e2ff] bg-linear-to-br from-white via-[#f8fbff] to-[#eef4ff] p-5 shadow-[0_10px_30px_rgba(31,75,183,0.08)] md:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#1f4bb7]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-[#0f8a54]/10 blur-3xl" />

        <div className="relative z-10 mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-[#1f4bb7]/10 p-2.5">
            <Search className="h-5 w-5 text-[#1f4bb7]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">
              Lacak Permohonan
            </h2>
            <p className="text-xs text-slate-600 md:text-sm">
              Masukkan kode pelacakan untuk memantau progres layanan Anda.
            </p>
          </div>
        </div>

        <form className="relative z-10 grid gap-3 md:grid-cols-[1fr,auto]">
          <div className="relative">
            <input
              type="text"
              placeholder="Contoh: PTSP-BRU-2025-000123"
              className="w-full rounded-2xl border border-[#cfdcff] bg-white px-4 py-3.5 text-sm text-slate-800 shadow-sm transition focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/20"
            />
          </div>
          <Button className="rounded-2xl bg-[#0f8a54] px-7 py-3.5 text-white shadow-md shadow-[#0f8a54]/25 hover:bg-[#0b7446]">
            Lacak Sekarang
          </Button>
        </form>
      </section>

      <section className="space-y-4 md:space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="ptsp-title">Layanan</h2>
            <p className="ptsp-subtitle">
              Daftar layanan aktif yang dapat diajukan secara online.
            </p>
          </div>
          <Link
            href="/layanan"
            className="inline-flex items-center gap-2 rounded-xl border border-[#d9e4ff] bg-white px-3 py-2 text-sm font-semibold text-[#1f4bb7] hover:bg-[#f4f7ff]"
          >
            Lihat semua <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Card className="group relative overflow-hidden rounded-2xl border border-[#d4dfff] bg-white p-0 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(31,75,183,0.18)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#1f4bb7] via-[#2b67f0] to-[#0f8a54]" />
            <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[#1f4bb7]/10 blur-xl" />
            <div className="relative p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#eaf0ff] px-2.5 py-1 text-[11px] font-semibold text-[#1f4bb7]">
                  <Sparkles className="h-3 w-3" />
                  Layanan Unggulan
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  <ShieldCheck className="h-3 w-3" />
                  Prioritas
                </span>
              </div>

              <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-slate-900 sm:text-lg">
                Layanan Bidang Bimas Islam
              </h3>

              <p className="mt-2 min-h-14 text-sm leading-relaxed text-slate-600">
                Layanan administrasi keagamaan bidang Bimas Islam secara cepat,
                terarah, dan terdokumentasi.
              </p>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                <Building2 className="h-3.5 w-3.5 text-[#1f4bb7]" />
                Unit kerja Bimas Islam
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                  <BookOpenCheck className="h-3.5 w-3.5 text-[#1f4bb7]" />
                  Layanan prioritas
                </span>
                <Link
                  href="/layanan"
                  className="inline-flex min-h-8 items-center gap-1 rounded-full bg-[#1f4bb7] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#183f9a]"
                >
                  Detail <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </Card>

          {services.map((service: any, idx: number) => (
            <Card
              key={service.id}
              className="group relative overflow-hidden rounded-2xl border border-[#d4dfff] bg-white p-0 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(31,75,183,0.18)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#1f4bb7] via-[#2b67f0] to-[#0f8a54]" />
              <div className="pointer-events-none absolute -right-6 -top-6 h-14 w-14 rounded-full bg-[#1f4bb7]/10 blur-xl" />

              <div className="relative p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f5ff] px-2.5 py-1 text-[11px] font-semibold text-[#1f4bb7]">
                    <ShieldCheck className="h-3 w-3" />
                    Layanan Aktif
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                    #{idx + 1}
                  </span>
                </div>

                <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-slate-900 sm:text-lg">
                  {service.name}
                </h3>

                <p className="mt-2 line-clamp-3 min-h-14 text-sm leading-relaxed text-slate-600">
                  {service.description || "Deskripsi layanan belum tersedia."}
                </p>

                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                  <Building2 className="h-3.5 w-3.5 text-[#1f4bb7]" />
                  Kementerian Agama Barito Utara
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                    <BookOpenCheck className="h-3.5 w-3.5 text-[#1f4bb7]" />
                    {service.service_items?.length ?? 0} item layanan
                  </div>
                  <Link
                    href={`/layanan/${service.slug}`}
                    className="inline-flex min-h-8 items-center gap-1 rounded-full bg-[#1f4bb7] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#183f9a]"
                  >
                    Detail <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4 md:space-y-5">
        <div>
          <h2 className="ptsp-title">FAQ Singkat</h2>
          <p className="ptsp-subtitle">
            Pertanyaan yang sering diajukan untuk membantu proses layanan Anda.
          </p>
        </div>
        <SiteHomeFaq />
      </section>
    </div>
  );
}
