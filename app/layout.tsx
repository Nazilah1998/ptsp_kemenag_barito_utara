import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="text-slate-900 antialiased">
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <main className="ptsp-shell flex-1 pt-3 pb-2 md:pt-5 md:pb-3">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white/90">
            <div className="ptsp-shell flex flex-col gap-1 py-1 text-center text-[10px] leading-tight text-slate-600 md:flex-row md:items-center md:justify-between md:text-xs">
              <p className="font-medium text-slate-700">
                Pelayanan Terpadu Satu Pintu (PTSP) Kantor Kementerian Agama
                Kabupaten Barito Utara
              </p>
              <p>
                © {new Date().getFullYear()} Kantor Kementerian Agama Kabupaten
                Barito Utara. Seluruh hak cipta dilindungi.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
