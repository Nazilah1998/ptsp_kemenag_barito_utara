"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";

type HeaderProfile = {
  role?: string | null;
};

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/layanan", label: "Jenis Layanan" },
  { href: "/track", label: "Track Layanan" },
  { href: "/dashboard/pengajuan/baru", label: "Ajukan Layanan" },
  { href: "/kontak", label: "Kontak" },
];

export function SiteHeaderClient({
  profile,
}: {
  profile: HeaderProfile | null;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const dashboardHref =
    profile?.role === "admin" || profile?.role === "super_admin"
      ? "/admin"
      : "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-blue-900/20 bg-[#1f4bb7] text-white shadow-lg">
      <div className="ptsp-shell py-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex min-w-0 items-center gap-2 md:gap-3"
          >
            <Image
              src="/kemenag.svg"
              alt="Logo Kemenag"
              width={42}
              height={42}
              className="h-10 w-10 object-contain"
            />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold md:hidden">
                PTSP BARITO UTARA
              </p>
              <p className="hidden truncate text-sm font-semibold md:block md:max-w-130 md:text-base">
                Pelayanan Terpadu Satu Pintu (PTSP) Kantor Kementerian Agama
                Kabupaten Barito Utara
              </p>
              <p className="truncate text-xs text-blue-100">
                Satu Layanan Untuk Semua
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Buka menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-all duration-300 hover:scale-105 hover:bg-white/20 md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <div className="hidden md:flex md:items-center md:gap-2">
            <nav className="flex items-center gap-1 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-3 py-2 font-medium text-blue-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              {profile ? (
                <Link
                  href={dashboardHref}
                  className="rounded-lg px-3 py-2 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                >
                  Dashboard
                </Link>
              ) : null}
            </nav>

            {profile ? (
              <SignOutButton />
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLoginOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#9f8437] px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8c7431]"
                >
                  Login
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      loginOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                <div
                  className={`absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 text-slate-800 shadow-xl transition-all duration-300 ${
                    loginOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-2 opacity-0"
                  }`}
                >
                  <Link
                    href="/login/pemohon"
                    onClick={() => setLoginOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 hover:bg-slate-100 hover:pl-4"
                  >
                    Login Pemohon
                  </Link>
                  <Link
                    href="/login/petugas"
                    onClick={() => setLoginOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 hover:bg-slate-100 hover:pl-4"
                  >
                    Login Petugas
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
            mobileOpen ? "mt-3 max-h-105 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="rounded-xl border border-white/15 bg-white/10 p-3">
            <nav className="grid gap-1 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 font-medium text-blue-50 transition-all duration-300 hover:translate-x-1 hover:bg-white/20 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              {profile ? (
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 font-semibold text-white transition-all duration-300 hover:translate-x-1 hover:bg-white/20"
                >
                  Dashboard
                </Link>
              ) : null}
            </nav>

            <div className="mt-3 flex items-center justify-center gap-2">
              {profile ? (
                <SignOutButton />
              ) : (
                <>
                  <Link
                    href="/login/pemohon"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button className="min-w-33 justify-center bg-[#0f8a54] px-4 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0b7446]">
                      Login Pemohon
                    </Button>
                  </Link>
                  <Link
                    href="/login/petugas"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button className="min-w-33 justify-center bg-[#166534] px-4 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#14532d]">
                      Login Petugas
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
