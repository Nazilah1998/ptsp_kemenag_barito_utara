"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FileText,
  Files,
  FormInput,
  ListChecks,
  FolderKanban,
  Users,
  FileOutput,
  ChevronRight,
  Shield,
  Database,
  Settings2,
  Crown,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { isSuperAdmin as checkSuperAdmin } from "@/lib/constants";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Profile = Record<string, any>;

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  group?: string;
  id: string;
}

const ADMIN_NAV: NavItem[] = [
  {
    label: "Ringkasan",
    href: "/admin",
    icon: LayoutDashboard,
    group: "Utama",
    id: "ringkasan",
  },
  {
    label: "Pengajuan",
    href: "/admin/pengajuan",
    icon: FolderKanban,
    group: "Utama",
    id: "pengajuan",
  },
  {
    label: "Layanan",
    href: "/admin/layanan",
    icon: FileText,
    group: "Master Data",
    id: "layanan",
  },
  {
    label: "Item Layanan",
    href: "/admin/item-layanan",
    icon: Files,
    group: "Master Data",
    id: "item_layanan",
  },
  {
    label: "Form Layanan",
    href: "/admin/form-layanan",
    icon: FormInput,
    group: "Master Data",
    id: "form_layanan",
  },
  {
    label: "Persyaratan",
    href: "/admin/persyaratan",
    icon: ListChecks,
    group: "Master Data",
    id: "persyaratan",
  },
  {
    label: "Pengguna",
    href: "/admin/pengguna",
    icon: Users,
    group: "Sistem",
    id: "pengguna",
  },
  {
    label: "Dokumen Hasil",
    href: "/admin/dokumen-hasil",
    icon: FileOutput,
    group: "Sistem",
    id: "dokumen_hasil",
  },
];

const GROUP_ICONS: Record<string, React.ElementType> = {
  Utama: LayoutDashboard,
  "Master Data": Database,
  Sistem: Settings2,
};

function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-300 ${
        isActive
          ? "bg-blue-50/80 text-[#1f4bb7] shadow-sm shadow-blue-100/50 border border-blue-100/50"
          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
          isActive
            ? "bg-white shadow-sm text-[#1f4bb7]"
            : "bg-transparent text-slate-400 group-hover:text-slate-600 group-hover:bg-white group-hover:shadow-sm"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1 leading-tight truncate">{item.label}</span>
      {isActive && (
        <ChevronRight className="h-4 w-4 opacity-60 shrink-0 text-[#1f4bb7]" />
      )}
    </Link>
  );
}

export function AdminShell({
  profile,
  allowedMenus = [],
  children,
}: {
  profile: Profile;
  allowedMenus?: string[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filter navigation items based on role permissions
  const isSuperAdmin = checkSuperAdmin(profile?.email);
  const authorizedNav = isSuperAdmin
    ? ADMIN_NAV
    : ADMIN_NAV.filter((item) => allowedMenus.includes(item.id));

  const groups = Array.from(
    new Set(authorizedNav.map((item) => item.group || "")),
  );

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const initials = (profile?.full_name || profile?.email || "A")
    .split(" ")
    .map((w: any[]) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const Sidebar = ({ onNavClick }: { onNavClick?: () => void }) => (
    <div className="flex h-full flex-col">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1f4bb7] to-[#143481] shadow-lg shadow-blue-900/20">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-extrabold text-slate-900 leading-tight truncate">
            PANEL ADMIN
          </p>
          <p className="text-[11px] font-semibold text-slate-500 truncate">
            PTSP KEMENAG BARITO UTARA
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {groups.map((group) => {
          const groupItems = authorizedNav.filter(
            (item) => (item.group || "") === group,
          );
          return (
            <div key={group}>
              {group && (
                <div className="mb-3 flex items-center gap-2 px-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                    {group}
                  </p>
                </div>
              )}
              <div className="space-y-1">
                {groupItems.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                  return (
                    <NavLink
                      key={item.href}
                      item={item}
                      isActive={isActive}
                      onClick={onNavClick}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-3">
        {/* Profile card */}
        <div className="flex items-center gap-3 rounded-2xl bg-white border border-slate-200/60 px-3 py-3 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-50 border border-blue-200/50 text-xs font-black text-[#1f4bb7]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-800 truncate">
              {profile?.full_name || profile?.email || "Admin"}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600">
                  <Crown className="h-3 w-3" />
                  Super Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1f4bb7]">
                  <Shield className="h-3 w-3" />
                  Administrator
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Logout button */}
        <button
          type="button"
          onClick={handleSignOut}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 border border-transparent hover:border-red-100"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors group-hover:bg-red-100 group-hover:text-red-600">
            <LogOut className="h-4 w-4" />
          </span>
          <span>Keluar dari Panel</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex w-full overflow-hidden bg-slate-50 fixed inset-0">
      {/* ── Desktop Sidebar ─────────────────────────────────────── */}
      <aside className="hidden lg:flex w-[280px] shrink-0 flex-col bg-white border-r border-slate-200 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)] z-20">
        <Sidebar />
      </aside>

      {/* ── Mobile sidebar overlay ──────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative z-10 flex w-[280px] flex-col bg-white border-r border-slate-200 shadow-2xl">
            <Sidebar onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main content area ───────────────────────────────────── */}
      <div className="flex flex-1 min-w-0 flex-col overflow-hidden bg-slate-50">
        {/* Top bar — visible on mobile (hamburger) + desktop (breadcrumb area) */}
        <header className="flex items-center gap-3 border-b border-slate-200/80 bg-white px-4 py-3 shrink-0 shadow-sm z-10">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex lg:hidden h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>

          {/* Brand mark — mobile only */}
          <div className="flex lg:hidden items-center gap-2 min-w-0">
            <Shield className="h-4 w-4 text-[#1f4bb7] shrink-0" />
            <p className="text-sm font-bold text-slate-800 truncate">
              Panel Admin PTSP
            </p>
          </div>

          {/* Desktop: subtle breadcrumb label */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1f4bb7]/10">
              <Shield className="h-3.5 w-3.5 text-[#1f4bb7]" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              PTSP Kemenag Barito Utara
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Role badge */}
          {isSuperAdmin ? (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200/80 px-3 py-1.5 text-[11px] font-bold text-amber-700">
              <Crown className="h-3.5 w-3.5" />
              Super Admin
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200/80 px-3 py-1.5 text-[11px] font-bold text-[#1f4bb7]">
              <Shield className="h-3.5 w-3.5" />
              Administrator
            </span>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
