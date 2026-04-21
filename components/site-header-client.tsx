"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  Home,
  LayoutGrid,
  Search,
  FilePlus2,
  Phone,
  LayoutDashboard,
  LogIn,
  UserCircle2,
  Shield,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

type HeaderProfile = {
  role?: string | null;
};

const navItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/layanan", label: "Jenis Layanan", icon: LayoutGrid },
  { href: "/track", label: "Lacak Layanan", icon: Search },
  { href: "/dashboard/pengajuan/baru", label: "Ajukan Layanan", icon: FilePlus2 },
  { href: "/kontak", label: "Kontak", icon: Phone },
];

export function SiteHeaderClient({
  profile,
}: {
  profile: HeaderProfile | null;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setLoginOpen(false);
  }, [pathname]);

  // Close login dropdown when clicking outside
  useEffect(() => {
    if (!loginOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-login-dropdown]")) setLoginOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [loginOpen]);

  const dashboardHref =
    profile?.role === "admin" || profile?.role === "super_admin"
      ? "/admin"
      : "/dashboard";

  const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";
  const isHome = pathname === "/";

  // On home page: transparent → white (when scrolled)
  // On other pages: always blue gradient
  const needsDarkStyle = isHome && scrolled;

  const headerClass = isHome
    ? scrolled
      ? "bg-white/96 shadow-[0_2px_32px_rgba(15,23,42,0.12)] backdrop-blur-2xl border-b border-slate-200/80"
      : "bg-transparent"
    : "bg-gradient-to-r from-[#0d2d8a] to-[#1f4bb7] shadow-[0_4px_24px_rgba(15,23,42,0.2)]";

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${headerClass}`}>
      {/* Gradient top accent */}
      <div
        className={`h-[3px] w-full bg-gradient-to-r from-[#1f4bb7] via-[#0f8a54] to-[#9f8437] transition-opacity duration-300 ${
          !isHome || scrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex h-[68px] items-center justify-between gap-4 md:h-[74px]">

          {/* Logo */}
          <Link href="/" className="group inline-flex min-w-0 flex-shrink-0 items-center gap-3">
            <div
              className={`relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105 ${
                needsDarkStyle ? "bg-[#1f4bb7]/10" : "bg-white/20"
              }`}
            >
              <Image
                src="/kemenag.svg"
                alt="Logo Kemenag"
                width={36}
                height={36}
                className="h-8 w-8 object-contain drop-shadow"
              />
            </div>
            <div className="min-w-0 leading-tight">
              <p
                className={`truncate text-[13px] font-black tracking-widest transition-colors duration-300 ${
                  needsDarkStyle ? "text-[#1f4bb7]" : "text-white"
                }`}
              >
                PTSP KEMENAG
              </p>
              <p
                className={`text-[11px] font-medium transition-colors duration-300 ${
                  needsDarkStyle ? "text-slate-500" : "text-blue-200"
                }`}
              >
                Barito Utara
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13.5px] font-semibold transition-all duration-200 ${
                    isActive
                      ? needsDarkStyle
                        ? "bg-[#1f4bb7]/10 text-[#1f4bb7]"
                        : "bg-white/20 text-white"
                      : needsDarkStyle
                        ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        : "text-white/80 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className={`absolute bottom-1 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full ${
                        needsDarkStyle ? "bg-[#1f4bb7]" : "bg-white"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
            {profile && (
              <Link
                href={dashboardHref}
                className={`relative inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13.5px] font-semibold transition-all duration-200 ${
                  pathname.startsWith("/dashboard") || pathname.startsWith("/admin")
                    ? needsDarkStyle
                      ? "bg-[#1f4bb7]/10 text-[#1f4bb7]"
                      : "bg-white/20 text-white"
                    : needsDarkStyle
                      ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      : "text-white/80 hover:bg-white/15 hover:text-white"
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-2.5 lg:flex">
            {profile ? (
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 ${
                    needsDarkStyle ? "bg-slate-100 text-slate-700" : "bg-white/15 text-white"
                  }`}
                >
                  {isAdmin ? (
                    <Shield className="h-4 w-4 text-amber-500" />
                  ) : (
                    <UserCircle2
                      className={`h-4 w-4 ${needsDarkStyle ? "text-[#1f4bb7]" : "text-blue-200"}`}
                    />
                  )}
                  <span className="text-[13px] font-semibold">
                    {isAdmin ? "Admin" : "Pemohon"}
                  </span>
                </div>
                <SignOutButton />
              </div>
            ) : (
              <div className="relative" data-login-dropdown>
                <button
                  type="button"
                  onClick={() => setLoginOpen((prev) => !prev)}
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f4bb7] to-[#2b5ce6] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-900/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/30 active:translate-y-0"
                >
                  <LogIn className="h-4 w-4" />
                  Masuk
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                      loginOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {/* Login dropdown */}
                <div
                  className={`absolute right-0 top-[calc(100%+10px)] z-50 w-56 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/20 transition-all duration-200 ${
                    loginOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-2 opacity-0"
                  }`}
                >
                  <div className="p-2">
                    <p className="px-3 py-2 text-[10.5px] font-black uppercase tracking-widest text-slate-400">
                      Masuk sebagai
                    </p>
                    <Link
                      href="/login/pemohon"
                      onClick={() => setLoginOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-150 hover:bg-blue-50 hover:text-[#1f4bb7]"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100">
                        <UserCircle2 className="h-4 w-4 text-[#1f4bb7]" />
                      </span>
                      <div>
                        <p className="text-sm font-bold">Pemohon</p>
                        <p className="text-[11px] font-normal text-slate-400">Masyarakat umum</p>
                      </div>
                    </Link>
                    <Link
                      href="/login/petugas"
                      onClick={() => setLoginOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-150 hover:bg-green-50 hover:text-[#0f8a54]"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-100">
                        <Shield className="h-4 w-4 text-[#0f8a54]" />
                      </span>
                      <div>
                        <p className="text-sm font-bold">Petugas</p>
                        <p className="text-[11px] font-normal text-slate-400">Staff Kemenag</p>
                      </div>
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 px-2 pb-2 pt-1.5">
                    <Link
                      href="/register"
                      onClick={() => setLoginOpen(false)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2 text-xs font-bold text-slate-600 transition-all duration-150 hover:bg-[#1f4bb7] hover:text-white"
                    >
                      Belum punya akun? Daftar
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border transition-all duration-200 active:scale-95 lg:hidden ${
              needsDarkStyle
                ? "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "border-white/25 bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
            mobileOpen ? "max-h-[600px] opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className={`rounded-2xl border p-3 backdrop-blur-xl ${
              needsDarkStyle
                ? "border-slate-200 bg-white shadow-xl"
                : "border-white/15 bg-white/10"
            }`}
          >
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? needsDarkStyle
                          ? "bg-[#1f4bb7]/10 text-[#1f4bb7]"
                          : "bg-white/25 text-white"
                        : needsDarkStyle
                          ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          : "text-white/80 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
              {profile && (
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150 ${
                    needsDarkStyle
                      ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      : "text-white/80 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
                  Dashboard
                </Link>
              )}
            </nav>

            <div className={`mt-3 border-t pt-3 ${needsDarkStyle ? "border-slate-200" : "border-white/15"}`}>
              {profile ? (
                <div className="flex flex-col gap-2">
                  <div
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 ${
                      needsDarkStyle ? "bg-slate-100 text-slate-700" : "bg-white/10 text-white"
                    }`}
                  >
                    {isAdmin ? (
                      <Shield className="h-4 w-4 text-amber-500" />
                    ) : (
                      <UserCircle2 className="h-4 w-4 opacity-70" />
                    )}
                    <span className="text-sm font-semibold">
                      {isAdmin ? "Admin" : "Pemohon"}
                    </span>
                  </div>
                  <SignOutButton />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login/pemohon"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1f4bb7] px-3 py-2.5 text-sm font-bold text-white transition-all duration-150 hover:bg-[#1a3fa3] active:scale-95"
                  >
                    <UserCircle2 className="h-4 w-4" />
                    Pemohon
                  </Link>
                  <Link
                    href="/login/petugas"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#0f8a54] px-3 py-2.5 text-sm font-bold text-white transition-all duration-150 hover:bg-[#0b7446] active:scale-95"
                  >
                    <Shield className="h-4 w-4" />
                    Petugas
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
