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
import { isAdminRole } from "@/lib/constants";

type HeaderProfile = {
  role?: string | null;
};

const navItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/layanan", label: "Jenis Layanan", icon: LayoutGrid },
  { href: "/track", label: "Lacak Layanan", icon: Search },
  {
    href: "/dashboard/pengajuan/baru",
    label: "Ajukan Layanan",
    icon: FilePlus2,
  },
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

  const dashboardHref = isAdminRole(profile?.role) ? "/admin" : "/dashboard";

  const isAdmin = isAdminRole(profile?.role);
  const isHome = pathname === "/";

  // On home page: transparent header with white text at top, white header with dark text when scrolled.
  // On other pages: always blue gradient header with white text.
  const isTransparent = isHome && !scrolled;
  const needsDarkStyle = isHome && scrolled;

  const headerClass = isHome
    ? scrolled
      ? "bg-white/95 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-2xl border-b border-slate-100"
      : "bg-transparent"
    : "bg-gradient-to-r from-[#0d2d8a] to-[#1a3fa3] shadow-lg";

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${headerClass}`}
    >
      {/* Gradient top accent */}
      <div
        className={`h-1 w-full bg-gradient-to-r from-[#1f4bb7] via-[#0f8a54] to-[#f0c040] transition-opacity duration-300 ${
          !isHome || scrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="mx-auto w-full px-6 sm:px-10 lg:px-20 xl:px-24">
        <div className="flex h-[72px] items-center justify-between gap-4 md:h-[80px]">
          {/* Logo (Left aligned) */}
          <div className="flex shrink-0 items-center justify-start">
            <Link
              href="/"
              className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm transition-colors duration-300 sm:h-12 sm:w-12 sm:rounded-2xl ${
                  needsDarkStyle
                    ? "bg-gradient-to-br from-[#1f4bb7]/10 to-[#1f4bb7]/5"
                    : "bg-white/10 backdrop-blur-md border border-white/20"
                }`}
              >
                <Image
                  src="/kemenag.svg"
                  alt="Logo Kemenag"
                  width={28}
                  height={28}
                  className="object-contain drop-shadow-md sm:w-8 sm:h-8"
                />
              </div>
              <div className="flex flex-col justify-center whitespace-nowrap">
                {/* Mobile/Tablet text */}
                <span
                  className={`text-[12px] sm:text-[12px] font-black tracking-tight leading-tight transition-colors duration-300 lg:hidden ${
                    needsDarkStyle ? "text-[#1f4bb7]" : "text-white"
                  }`}
                >
                  PELAYANAN TERPADU SATU PINTU (PTSP)
                </span>
                <span
                  className={`text-[13px] sm:text-[9px] font-semibold tracking-wide leading-tight transition-colors duration-300 lg:hidden ${
                    needsDarkStyle ? "text-slate-500" : "text-blue-200"
                  }`}
                >
                  KEMENAG BARITO UTARA
                </span>
                {/* Desktop text */}
                <span
                  className={`hidden lg:block text-[12px] font-black tracking-wider leading-tight transition-colors duration-300 ${
                    needsDarkStyle ? "text-[#1f4bb7]" : "text-white"
                  }`}
                >
                  PELAYANAN TERPADU SATU PINTU (PTSP)
                </span>
                <span
                  className={`hidden lg:block text-[9px] font-semibold tracking-wide leading-tight transition-colors duration-300 ${
                    needsDarkStyle ? "text-slate-500" : "text-blue-200"
                  }`}
                >
                  KEMENTERIAN AGAMA KABUPATEN BARITO UTARA
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav (Center aligned) */}
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group flex items-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-bold transition-all duration-300 ${
                    isActive
                      ? needsDarkStyle
                        ? "bg-[#1f4bb7]/10 text-[#1f4bb7]"
                        : "bg-white/20 text-white shadow-inner"
                      : needsDarkStyle
                        ? "text-slate-600 hover:bg-slate-100 hover:text-[#1f4bb7]"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-transform duration-300 ${isActive ? "scale-110" : "opacity-70 group-hover:scale-110 group-hover:opacity-100"}`}
                  />
                  {item.label}
                </Link>
              );
            })}
            {profile && (
              <Link
                href={dashboardHref}
                className={`group flex items-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-bold transition-all duration-300 ${
                  pathname.startsWith("/dashboard") ||
                  pathname.startsWith("/admin")
                    ? needsDarkStyle
                      ? "bg-[#1f4bb7]/10 text-[#1f4bb7]"
                      : "bg-white/20 text-white shadow-inner"
                    : needsDarkStyle
                      ? "text-slate-600 hover:bg-slate-100 hover:text-[#1f4bb7]"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop CTA (Right aligned) */}
          <div className="hidden w-1/4 items-center justify-end lg:flex">
            {profile ? (
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-md transition-colors duration-300 ${
                    needsDarkStyle
                      ? "bg-slate-100 border border-slate-200 text-slate-700"
                      : "bg-white/10 border border-white/20 text-white"
                  }`}
                >
                  {isAdmin ? (
                    <Shield className="h-4 w-4 text-[#f0c040]" />
                  ) : (
                    <UserCircle2
                      className={`h-4 w-4 ${needsDarkStyle ? "text-[#1f4bb7]" : "text-blue-200"}`}
                    />
                  )}
                  <span className="text-sm font-bold">
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
                  className={`group flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
                    needsDarkStyle
                      ? "bg-gradient-to-r from-[#1f4bb7] to-[#2b67f0] text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                      : "bg-white text-[#1f4bb7] shadow-lg shadow-black/10 hover:shadow-xl hover:bg-slate-50"
                  }`}
                >
                  <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                  Masuk
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                      loginOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {/* Login dropdown */}
                <div
                  className={`absolute right-0 top-[calc(100%+16px)] z-50 w-60 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 origin-top-right ${
                    loginOpen
                      ? "scale-100 opacity-100 pointer-events-auto"
                      : "scale-95 opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="p-2">
                    <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Masuk Sebagai
                    </p>
                    <Link
                      href="/login/pemohon"
                      onClick={() => setLoginOpen(false)}
                      className="group/item flex items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-blue-50/80"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100/50 text-[#1f4bb7] transition-colors group-hover/item:bg-blue-200/50">
                        <UserCircle2 className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-700 transition-colors group-hover/item:text-[#1f4bb7]">
                          Pemohon
                        </p>
                        <p className="text-xs font-medium text-slate-400">
                          Masyarakat Umum
                        </p>
                      </div>
                    </Link>
                    <Link
                      href="/login/petugas"
                      onClick={() => setLoginOpen(false)}
                      className="group/item flex items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-emerald-50/80"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100/50 text-[#0f8a54] transition-colors group-hover/item:bg-emerald-200/50">
                        <Shield className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-700 transition-colors group-hover/item:text-[#0f8a54]">
                          Petugas
                        </p>
                        <p className="text-xs font-medium text-slate-400">
                          Staff Kemenag
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="bg-slate-50 p-3 border-t border-slate-100">
                    <Link
                      href="/register"
                      onClick={() => setLoginOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm border border-slate-200 transition-all duration-200 hover:border-[#1f4bb7] hover:text-[#1f4bb7] hover:shadow-md"
                    >
                      Belum punya akun?{" "}
                      <span className="text-[#1f4bb7]">Daftar</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex w-1/4 items-center justify-end lg:hidden">
            <button
              type="button"
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              onClick={() => setMobileOpen((prev) => !prev)}
              className={`inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200 active:scale-90 ${
                needsDarkStyle
                  ? "border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-100 shadow-sm"
                  : "border-white/20 bg-white/10 text-white hover:bg-white/20 shadow-inner"
              }`}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden transition-[transform,opacity] duration-300 ease-out origin-top will-change-transform ${
            mobileOpen
              ? "scale-y-100 opacity-100 pb-5"
              : "scale-y-0 opacity-0 pointer-events-none h-0"
          }`}
        >
          <div
            className={`rounded-3xl border p-4 backdrop-blur-2xl transition-colors duration-300 ${
              needsDarkStyle
                ? "border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/10"
                : "border-white/20 bg-white/10 shadow-2xl shadow-black/20"
            }`}
          >
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? needsDarkStyle
                          ? "bg-[#1f4bb7]/10 text-[#1f4bb7]"
                          : "bg-white/20 text-white shadow-inner"
                        : needsDarkStyle
                          ? "text-slate-600 hover:bg-slate-100 hover:text-[#1f4bb7]"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
              {profile && (
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-200 ${
                    needsDarkStyle
                      ? "text-slate-600 hover:bg-slate-100 hover:text-[#1f4bb7]"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
                  Dashboard
                </Link>
              )}
            </nav>

            <div
              className={`mt-4 border-t pt-4 ${needsDarkStyle ? "border-slate-200" : "border-white/20"}`}
            >
              {profile ? (
                <div className="flex flex-col gap-3">
                  <div
                    className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 ${
                      needsDarkStyle
                        ? "bg-slate-100 text-slate-700"
                        : "bg-white/10 text-white shadow-inner"
                    }`}
                  >
                    {isAdmin ? (
                      <Shield className="h-5 w-5 text-[#f0c040]" />
                    ) : (
                      <UserCircle2 className="h-5 w-5 opacity-80" />
                    )}
                    <span className="text-sm font-bold">
                      {isAdmin ? "Admin" : "Pemohon"}
                    </span>
                  </div>
                  <SignOutButton />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login/pemohon"
                    onClick={() => setMobileOpen(false)}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#1f4bb7] to-[#2b67f0] p-4 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
                  >
                    <UserCircle2 className="h-6 w-6" />
                    Pemohon
                  </Link>
                  <Link
                    href="/login/petugas"
                    onClick={() => setMobileOpen(false)}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#0f8a54] to-[#0d7a4b] p-4 text-sm font-bold text-white shadow-lg shadow-green-900/20 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
                  >
                    <Shield className="h-6 w-6" />
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
