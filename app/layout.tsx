import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { ConditionalShell } from "@/components/conditional-shell";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Instagram,
  Globe,
  ChevronRight,
  Heart,
} from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title:
    "Pelayanan Terpadu Satu Pintu (PTSP) Kantor Kementerian Agama Kabupaten Barito Utara",
  description:
    "Portal resmi Pelayanan Terpadu Satu Pintu (PTSP) Kantor Kementerian Agama Kabupaten Barito Utara",
  icons: {
    icon: "/kemenag.svg",
    shortcut: "/kemenag.svg",
    apple: "/kemenag.svg",
  },
};

const footerNav = [
  { label: "Beranda", href: "/" },
  { label: "Jenis Layanan", href: "/layanan" },
  { label: "Lacak Permohonan", href: "/track" },
  { label: "Ajukan Layanan", href: "/dashboard/pengajuan/baru" },
  { label: "Hubungi Kami", href: "/kontak" },
];

const footerLayanan = [
  { label: "Bimas Islam", href: "/layanan" },
  { label: "Pendidikan Agama", href: "/layanan" },
  { label: "Haji & Umrah", href: "/layanan" },
  { label: "Legalisir Dokumen", href: "/layanan" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  const footer = (
    <footer className="relative bg-[#080f2e] text-white overflow-hidden">
      {/* Top gradient accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#1f4bb7] via-[#0f8a54] to-[#9f8437]" />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#1f4bb7]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#0f8a54]/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Main grid */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">

          {/* Brand — span 4 */}
          <div className="lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-3 mb-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 transition-all duration-200 group-hover:bg-white/20">
                <Image
                  src="/kemenag.svg"
                  alt="Logo Kemenag"
                  width={40}
                  height={40}
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <p className="text-base font-black tracking-widest text-white">PTSP KEMENAG</p>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Barito Utara</p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-white/45 max-w-xs">
              Portal resmi Pelayanan Terpadu Satu Pintu Kementerian Agama Kabupaten Barito Utara.
              Layanan cepat, mudah, dan transparan.
            </p>

            {/* Jam operasional */}
            <div className="mt-6 inline-flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#5eeaa5]" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-0.5">Jam Operasional</p>
                <p className="text-sm font-bold text-white">Senin – Jumat</p>
                <p className="text-sm text-white/60">08.00 – 16.00 WIB</p>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-2.5">
              <a
                href="https://kemenag.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 border border-white/10 text-white/50 transition-all duration-200 hover:bg-white/15 hover:text-white hover:border-white/25"
                aria-label="Website Kemenag"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 border border-white/10 text-white/50 transition-all duration-200 hover:bg-white/15 hover:text-white hover:border-white/25"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation — span 2 */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-[10.5px] font-black uppercase tracking-[0.15em] text-white/40">
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/50 transition-all duration-150 hover:text-white"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan — span 2 */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-[10.5px] font-black uppercase tracking-[0.15em] text-white/40">
              Layanan
            </h3>
            <ul className="space-y-2.5">
              {footerLayanan.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/50 transition-all duration-150 hover:text-white"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — span 4 */}
          <div className="lg:col-span-4">
            <h3 className="mb-5 text-[10.5px] font-black uppercase tracking-[0.15em] text-white/40">
              Kontak Kami
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-sm text-white/50 transition-all duration-150 hover:text-white"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white/8 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-[#5eeaa5]" />
                  </div>
                  <span className="leading-relaxed">
                    Jl. A. Yani No. 6, Muara Teweh,<br />
                    Kab. Barito Utara, Kalimantan Tengah
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+6251321xxx"
                  className="flex items-center gap-3 text-sm text-white/50 transition-all duration-150 hover:text-white"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white/8">
                    <Phone className="h-3.5 w-3.5 text-[#f0c040]" />
                  </div>
                  (0519) 21xxx
                </a>
              </li>
              <li>
                <a
                  href="mailto:ptsp@kemenag-baritoutara.go.id"
                  className="flex items-center gap-3 text-sm text-white/50 transition-all duration-150 hover:text-white"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white/8">
                    <Mail className="h-3.5 w-3.5 text-blue-300" />
                  </div>
                  <span className="break-all">ptsp@kemenag-baritoutara.go.id</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 py-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-[12px] text-white/30 leading-relaxed">
              © {new Date().getFullYear()}{" "}
              <span className="text-white/50 font-semibold">
                Kantor Kementerian Agama Kab. Barito Utara
              </span>
              . Seluruh hak cipta dilindungi.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-white/25 flex items-center gap-1">
                Dibuat dengan <Heart className="h-3 w-3 text-red-400/60 fill-red-400/60" /> untuk masyarakat
              </span>
              <a
                href="https://kemenag.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] text-white/35 transition-colors hover:text-white"
              >
                kemenag.go.id
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <html lang="id" className={inter.variable}>
      <body className="text-slate-900 antialiased">
        <div className="flex min-h-dvh flex-col">
          <ConditionalShell header={<SiteHeader />} footer={footer}>
            {children}
          </ConditionalShell>
        </div>
      </body>
    </html>
  );
}
