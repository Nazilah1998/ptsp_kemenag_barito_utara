import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building2,
  BookOpenCheck,
  Search,
  FilePlus2,
  LayoutGrid,
  ClipboardList,
  CheckCircle2,
  Clock,
  FileCheck2,
  Zap,
  Globe,
  Users,
  Star,
  ChevronRight,
  Award,
  Headphones,
  TrendingUp,
} from "lucide-react";
import { SiteHomeFaq } from "@/components/site-home-faq";
import { getPublicServices } from "@/lib/queries";

export default async function HomePage() {
  const services = await getPublicServices();

  return (
    <div className="w-full overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════
          HERO — Full-width immersive with kantor image background
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/kantor-kemenag.jpg"
            alt="Kantor Kemenag Barito Utara"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1e5e]/95 via-[#0d2d8a]/90 to-[#1a3fa3]/85" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Ambient glows */}
        <div className="pointer-events-none absolute -left-40 top-20 h-[600px] w-[600px] rounded-full bg-[#0f8a54]/15 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[#2b67f0]/20 blur-[100px]" />
        <div className="pointer-events-none absolute left-1/3 top-0 h-[300px] w-[300px] rounded-full bg-[#9f8437]/10 blur-[80px]" />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px]">
            {/* Left */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0f8a54] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0f8a54]" />
                </span>
                <span className="text-xs font-bold tracking-widest text-white/90 uppercase">
                  PTSP · Kementerian Agama Barito Utara
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl font-black leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-[64px] xl:text-[72px]">
                  Pelayanan{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-[#5eeaa5] to-[#38d9a9] bg-clip-text text-transparent">
                      Mudah
                    </span>
                    <span className="absolute -bottom-1 left-0 z-0 h-3 w-full -skew-x-6 rounded bg-[#0f8a54]/25 blur-sm" />
                  </span>{" "}
                  untuk{" "}
                  <span className="bg-gradient-to-r from-[#f0c040] to-[#fbbf24] bg-clip-text text-transparent">
                    Semua
                  </span>
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-white/70 md:text-lg lg:text-xl">
                  Portal resmi layanan administrasi keagamaan — perizinan,
                  legalisir, konsultasi, dan surat menyurat — secara online,
                  cepat, dan terdokumentasi.
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                {[
                  {
                    value: "10+",
                    label: "Jenis Layanan",
                    color: "text-[#5eeaa5]",
                  },
                  {
                    value: "500+",
                    label: "Pengajuan Diproses",
                    color: "text-[#f0c040]",
                  },
                  {
                    value: "200+",
                    label: "Pengguna Aktif",
                    color: "text-blue-300",
                  },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span
                      className={`text-3xl font-black ${stat.color} leading-none`}
                    >
                      {stat.value}
                    </span>
                    <span className="mt-1 text-xs font-medium text-white/50 uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/login/pemohon"
                  className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#0f8a54] to-[#0d7a4b] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-green-900/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-900/40 active:translate-y-0"
                >
                  <FilePlus2 className="h-4 w-4" />
                  Mulai Pengajuan
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/layanan"
                  className="inline-flex items-center gap-2.5 rounded-2xl border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Lihat Layanan
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { icon: ShieldCheck, text: "Aman & Terverifikasi" },
                  { icon: Clock, text: "Proses Transparan" },
                  { icon: Award, text: "Pelayanan Resmi" },
                ].map(({ icon: Icon, text }) => (
                  <span
                    key={text}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm"
                  >
                    <Icon className="h-3.5 w-3.5 text-white/60" />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: floating card */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 blur-2xl" />
                <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                  {/* Card header */}
                  <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f0c040] to-[#f59e0b]">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">
                        Layanan Aktif
                      </p>
                      <p className="text-xs text-white/50">
                        Siap diakses kapanpun
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 rounded-full bg-[#0f8a54]/25 px-2.5 py-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5eeaa5]" />
                      <span className="text-[10px] font-bold text-[#5eeaa5]">
                        LIVE
                      </span>
                    </div>
                  </div>

                  {/* Feature list */}
                  <div className="space-y-2.5">
                    {[
                      {
                        icon: CheckCircle2,
                        text: "Pengajuan 100% online",
                        color: "text-[#5eeaa5]",
                        bg: "bg-[#5eeaa5]/10",
                      },
                      {
                        icon: Clock,
                        text: "Pantau status real-time",
                        color: "text-[#f0c040]",
                        bg: "bg-[#f0c040]/10",
                      },
                      {
                        icon: FileCheck2,
                        text: "Unduh dokumen hasil",
                        color: "text-blue-300",
                        bg: "bg-blue-300/10",
                      },
                      {
                        icon: ShieldCheck,
                        text: "Data aman & terlindungi",
                        color: "text-purple-300",
                        bg: "bg-purple-300/10",
                      },
                      {
                        icon: Headphones,
                        text: "Dukungan teknis 24/7",
                        color: "text-pink-300",
                        bg: "bg-pink-300/10",
                      },
                    ].map(({ icon: Icon, text, color, bg }) => (
                      <div
                        key={text}
                        className={`flex items-center gap-3 rounded-2xl ${bg} px-4 py-3 border border-white/5`}
                      >
                        <Icon className={`h-4 w-4 flex-shrink-0 ${color}`} />
                        <span className="text-sm font-medium text-white/80">
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Operating hours */}
                  <div className="mt-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1f4bb7]/40 to-[#0f8a54]/30 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-3.5 w-3.5 text-white/60" />
                      <p className="text-[10.5px] font-semibold uppercase tracking-wider text-white/50">
                        Jam Operasional
                      </p>
                    </div>
                    <p className="text-sm font-black text-white">
                      Senin – Jumat, 08.00 – 16.00 WIB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C240,80 480,0 720,40 C960,80 1200,20 1440,40 L1440,80 L0,80 Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          QUICK ACCESS CARDS
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[#f8fafc] py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          {/* Section label */}
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1f4bb7]/60 mb-2">
              Akses Cepat
            </p>
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
              Layanan Kami
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {[
              {
                href: "/layanan",
                icon: LayoutGrid,
                label: "Jenis Layanan",
                desc: "Lihat semua layanan yang tersedia",
                gradient: "from-[#1f4bb7] to-[#2b67f0]",
                lightBg: "bg-[#1f4bb7]/5 hover:bg-[#1f4bb7]/10",
                iconBg: "bg-[#1f4bb7]",
                border: "border-[#1f4bb7]/15 hover:border-[#1f4bb7]/35",
                textColor: "text-[#1f4bb7]",
              },
              {
                href: "/track",
                icon: Search,
                label: "Lacak Permohonan",
                desc: "Pantau status pengajuan Anda",
                gradient: "from-[#0f8a54] to-[#0b7446]",
                lightBg: "bg-[#0f8a54]/5 hover:bg-[#0f8a54]/10",
                iconBg: "bg-[#0f8a54]",
                border: "border-[#0f8a54]/15 hover:border-[#0f8a54]/35",
                textColor: "text-[#0f8a54]",
              },
              {
                href: "/dashboard/pengajuan/baru",
                icon: FilePlus2,
                label: "Ajukan Layanan",
                desc: "Buat permohonan baru online",
                gradient: "from-[#9f8437] to-[#8c7431]",
                lightBg: "bg-[#9f8437]/5 hover:bg-[#9f8437]/10",
                iconBg: "bg-[#9f8437]",
                border: "border-[#9f8437]/15 hover:border-[#9f8437]/35",
                textColor: "text-[#9f8437]",
              },
              {
                href: "/kontak",
                icon: Headphones,
                label: "Hubungi Kami",
                desc: "Butuh bantuan? Kami siap bantu",
                gradient: "from-purple-600 to-purple-700",
                lightBg: "bg-purple-500/5 hover:bg-purple-500/10",
                iconBg: "bg-purple-600",
                border: "border-purple-500/15 hover:border-purple-500/35",
                textColor: "text-purple-600",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border ${item.border} ${item.lightBg} p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg sm:p-6`}
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconBg} shadow-lg`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <p className={`text-sm font-black ${item.textColor} mb-1`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                  <div
                    className={`mt-4 flex items-center gap-1 text-xs font-bold ${item.textColor} opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
                  >
                    Selengkapnya <ChevronRight className="h-3 w-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TRACK SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d2d8a] via-[#1f4bb7] to-[#1a53c8] p-8 shadow-2xl shadow-blue-900/20 md:p-12">
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/8 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#0f8a54]/20 blur-3xl" />

            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5">
                  <Search className="h-3.5 w-3.5 text-white/70" />
                  <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                    Lacak Status
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white md:text-3xl">
                  Pantau Permohonan Anda
                </h2>
                <p className="mt-2 text-sm text-white/60 md:text-base max-w-lg">
                  Masukkan kode pelacakan untuk melihat status dan progres
                  layanan Anda secara real-time.
                </p>

                <form
                  action="/track"
                  method="get"
                  className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center max-w-xl"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      name="kode"
                      placeholder="Contoh: PTSP-BRU-2025-000123"
                      className="w-full rounded-2xl border border-white/20 bg-white/10 py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/40 backdrop-blur-sm transition-all duration-200 focus:border-white/40 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-[#1f4bb7] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl sm:flex-shrink-0"
                  >
                    <Search className="h-4 w-4" />
                    Lacak
                  </button>
                </form>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  {[
                    {
                      icon: CheckCircle2,
                      text: "Status Real-time",
                      color: "text-[#5eeaa5]",
                    },
                    {
                      icon: Clock,
                      text: "Update Otomatis",
                      color: "text-[#f0c040]",
                    },
                    {
                      icon: FileCheck2,
                      text: "Unduh Hasil",
                      color: "text-blue-300",
                    },
                  ].map(({ icon: Icon, text, color }) => (
                    <span
                      key={text}
                      className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold ${color}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {text}
                    </span>
                  ))}
                </div>
              </div>

              {/* Decorative visual */}
              <div className="hidden xl:flex flex-col items-center gap-3">
                {[
                  { step: "Menunggu Verifikasi", status: "done" },
                  { step: "Sedang Diproses", status: "active" },
                  { step: "Menunggu Tanda Tangan", status: "pending" },
                ].map(({ step, status }, i) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 w-52"
                  >
                    <div
                      className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                        status === "done"
                          ? "bg-[#5eeaa5]"
                          : status === "active"
                            ? "bg-[#f0c040] animate-pulse"
                            : "bg-white/20"
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold ${status === "pending" ? "text-white/30" : "text-white/80"}`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SERVICES SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[#f8fafc] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#1f4bb7]/10 px-4 py-1.5">
                <LayoutGrid className="h-3.5 w-3.5 text-[#1f4bb7]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1f4bb7]">
                  Layanan Kami
                </span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                Jenis Layanan Tersedia
              </h2>
              <p className="mt-3 max-w-lg text-sm text-slate-500 md:text-base leading-relaxed">
                Ajukan layanan administrasi keagamaan secara online — mudah,
                terdokumentasi, dan terpantau.
              </p>
            </div>
            <Link
              href="/layanan"
              className="hidden shrink-0 items-center gap-2 rounded-2xl border border-[#1f4bb7]/20 bg-white px-5 py-2.5 text-sm font-bold text-[#1f4bb7] shadow-sm transition-all duration-200 hover:bg-[#1f4bb7] hover:text-white hover:shadow-md sm:inline-flex"
            >
              Semua Layanan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Cards */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {/* Featured/Static card */}
            <div className="group relative overflow-hidden rounded-3xl border border-[#1f4bb7]/15 bg-white shadow-[0_8px_30px_rgba(31,75,183,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(31,75,183,0.18)]">
              {/* Top gradient bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#1f4bb7] via-[#2b67f0] to-[#0f8a54]" />
              <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-gradient-to-br from-[#1f4bb7]/8 to-transparent" />

              <div className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#1f4bb7] to-[#2b67f0] px-3 py-1 text-[11px] font-black text-white">
                    <Sparkles className="h-3 w-3" />
                    Unggulan
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                    <Star className="h-3 w-3" />
                    Prioritas
                  </span>
                </div>

                <h3 className="text-lg font-black leading-snug text-slate-900">
                  Layanan Bidang Bimas Islam
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
                  Layanan administrasi keagamaan bidang Bimas Islam secara
                  cepat, terarah, dan terdokumentasi dengan baik.
                </p>

                <div className="mt-3.5 flex items-center gap-2 text-xs text-slate-400">
                  <Building2 className="h-3.5 w-3.5 text-[#1f4bb7]" />
                  <span>Unit Kerja Bimas Islam</span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                    <BookOpenCheck className="h-3.5 w-3.5 text-[#1f4bb7]" />
                    Layanan prioritas
                  </span>
                  <Link
                    href="/layanan"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1f4bb7] to-[#2b67f0] px-4 py-2 text-xs font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Lihat Detail <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Dynamic services */}
            {services.map((service: any, idx: number) => (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-[#1f4bb7]/25 hover:shadow-[0_20px_50px_rgba(31,75,183,0.14)]"
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-slate-200 to-slate-300 transition-all duration-300 group-hover:from-[#1f4bb7] group-hover:to-[#0f8a54]" />
                <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-gradient-to-br from-slate-50 to-transparent transition-all duration-300 group-hover:from-[#1f4bb7]/6" />

                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef3ff] px-3 py-1 text-[11px] font-bold text-[#1f4bb7]">
                      <ShieldCheck className="h-3 w-3" />
                      Aktif
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-[11px] font-black text-slate-500">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="line-clamp-2 text-lg font-black leading-snug text-slate-900">
                    {service.name}
                  </h3>
                  <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-500">
                    {service.description || "Deskripsi layanan belum tersedia."}
                  </p>

                  <div className="mt-3.5 flex items-center gap-2 text-xs text-slate-400">
                    <Building2 className="h-3.5 w-3.5 text-[#1f4bb7]" />
                    <span>Kemenag Barito Utara</span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                      <ClipboardList className="h-3.5 w-3.5 text-[#1f4bb7]" />
                      {service.service_items?.length ?? 0} item layanan
                    </span>
                    <Link
                      href={`/layanan/${service.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#1f4bb7]/20 bg-[#1f4bb7]/5 px-4 py-2 text-xs font-bold text-[#1f4bb7] transition-all duration-200 hover:bg-[#1f4bb7] hover:text-white hover:-translate-y-0.5"
                    >
                      Lihat Detail <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile see all button */}
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#1f4bb7]/25 bg-white px-6 py-3 text-sm font-bold text-[#1f4bb7] shadow-sm transition-all duration-200 hover:bg-[#1f4bb7] hover:text-white"
            >
              Lihat Semua Layanan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#1f4bb7]/10 px-4 py-1.5">
              <Zap className="h-3.5 w-3.5 text-[#1f4bb7]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#1f4bb7]">
                Cara Kerja
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              4 Langkah Mudah
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500 md:text-base leading-relaxed">
              Proses pengajuan layanan dirancang sesederhana mungkin — dari
              pendaftaran hingga menerima dokumen hasil.
            </p>
          </div>

          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Connector line desktop */}
            <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent lg:block" />

            {[
              {
                step: "01",
                icon: Users,
                title: "Daftar Akun",
                desc: "Buat akun pemohon dengan data diri yang lengkap dan terverifikasi.",
                gradient: "from-[#1f4bb7] to-[#2b67f0]",
                glow: "shadow-blue-500/30",
                light: "bg-blue-50",
                text: "text-[#1f4bb7]",
              },
              {
                step: "02",
                icon: LayoutGrid,
                title: "Pilih Layanan",
                desc: "Pilih jenis layanan yang sesuai dengan kebutuhan administrasi Anda.",
                gradient: "from-[#0f8a54] to-[#0b7446]",
                glow: "shadow-green-500/30",
                light: "bg-green-50",
                text: "text-[#0f8a54]",
              },
              {
                step: "03",
                icon: FilePlus2,
                title: "Isi & Upload",
                desc: "Lengkapi formulir dan unggah berkas persyaratan sesuai ketentuan.",
                gradient: "from-[#9f8437] to-[#8c7431]",
                glow: "shadow-amber-500/30",
                light: "bg-amber-50",
                text: "text-[#9f8437]",
              },
              {
                step: "04",
                icon: FileCheck2,
                title: "Terima Hasil",
                desc: "Pantau status dan unduh dokumen hasil layanan digital Anda.",
                gradient: "from-purple-600 to-purple-700",
                glow: "shadow-purple-500/30",
                light: "bg-purple-50",
                text: "text-purple-600",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Icon circle */}
                  <div className="relative mb-6">
                    <div
                      className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${item.gradient} shadow-xl ${item.glow} shadow-[0_8px_24px]`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <span
                      className={`absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-xl bg-white text-xs font-black ${item.text} shadow-md ring-2 ring-slate-100`}
                    >
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 max-w-[180px]">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#1f4bb7] to-[#2b67f0] px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-900/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-900/35"
            >
              <Users className="h-4 w-4" />
              Mulai Sekarang — Gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-[#0a1e5e] to-[#1f4bb7] py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {[
              {
                value: "10+",
                label: "Jenis Layanan",
                icon: LayoutGrid,
                color: "text-[#5eeaa5]",
              },
              {
                value: "500+",
                label: "Permohonan Diproses",
                icon: TrendingUp,
                color: "text-[#f0c040]",
              },
              {
                value: "200+",
                label: "Pengguna Terdaftar",
                icon: Users,
                color: "text-blue-300",
              },
              {
                value: "100%",
                label: "Layanan Online",
                icon: Globe,
                color: "text-purple-300",
              },
            ].map(({ value, label, icon: Icon, color }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <span className={`text-4xl font-black ${color} leading-none`}>
                  {value}
                </span>
                <span className="mt-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAQ SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[#f8fafc] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#1f4bb7]/10 px-4 py-1.5">
              <BookOpenCheck className="h-3.5 w-3.5 text-[#1f4bb7]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#1f4bb7]">
                FAQ
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Pertanyaan Umum
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500 md:text-base leading-relaxed">
              Jawaban atas pertanyaan yang sering diajukan untuk memudahkan
              proses layanan Anda.
            </p>
          </div>
          <div className="mx-auto max-w-4xl">
            <SiteHomeFaq />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f8a54] via-[#0b7446] to-[#096038] p-10 text-white shadow-2xl shadow-green-900/30 md:p-14">
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#1f4bb7]/20 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:text-left">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm">
                <Sparkles className="h-10 w-10 text-[#f0c040]" />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-black text-white md:text-3xl lg:text-4xl">
                  Siap Mengajukan Layanan?
                </h2>
                <p className="mt-3 max-w-xl text-sm text-white/70 md:text-base leading-relaxed">
                  Daftar sekarang dan nikmati kemudahan layanan Kementerian
                  Agama Kabupaten Barito Utara — online, cepat, dan transparan.
                </p>
              </div>

              <div className="flex flex-shrink-0 flex-wrap justify-center gap-3 md:flex-col">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-7 py-3.5 text-sm font-black text-[#0f8a54] shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  <Users className="h-4 w-4" />
                  Daftar Sekarang
                </Link>
                <Link
                  href="/layanan"
                  className="inline-flex items-center gap-2.5 rounded-2xl border-2 border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Lihat Layanan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
