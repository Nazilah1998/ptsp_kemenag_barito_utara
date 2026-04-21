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
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Profile = Record<string, any>;

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  group?: string;
}

const ADMIN_NAV: NavItem[] = [
  { label: "Ringkasan", href: "/admin", icon: LayoutDashboard, group: "Utama" },
  {
    label: "Pengajuan",
    href: "/admin/pengajuan",
    icon: FolderKanban,
    group: "Utama",
  },
  {
    label: "Layanan",
    href: "/admin/layanan",
    icon: FileText,
    group: "Master Data",
  },
  {
    label: "Item Layanan",
    href: "/admin/item-layanan",
    icon: Files,
    group: "Master Data",
  },
  {
    label: "Form Layanan",
    href: "/admin/form-layanan",
    icon: FormInput,
    group: "Master Data",
  },
  {
    label: "Persyaratan",
    href: "/admin/persyaratan",
    icon: ListChecks,
    group: "Master Data",
  },
  { label: "Pengguna", href: "/admin/pengguna", icon: Users, group: "Sistem" },
  {
    label: "Dokumen Hasil",
    href: "/admin/dokumen-hasil",
    icon: FileOutput,
    group: "Sistem",
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
      className={`group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] text-white shadow-md shadow-blue-500/20"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-white/20 shadow-sm shadow-white/10"
            : "bg-white/5 group-hover:bg-white/15"
        }`}
      >
        <Icon
          className={`h-3.5 w-3.5 ${
            isActive ? "text-white" : "text-slate-400 group-hover:text-white"
          }`}
        />
      </span>
      <span className="flex-1 leading-tight truncate">{item.label}</span>
      {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60 shrink-0" />}
    </Link>
  );
}

export function AdminShell({
  profile,
  children,
}: {
  profile: Profile;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const groups = Array.from(new Set(ADMIN_NAV.map((item) => item.group || "")));

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isSuperAdmin = profile?.role === "super_admin";

  const initials = (profile?.full_name || profile?.email || "A")
    .split(" ")
    .map((w: any[]) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const Sidebar = ({ onNavClick }: { onNavClick?: () => void }) => (
    <div className="flex h-full flex-col">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/15">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white leading-tight truncate">
            Panel Admin
          </p>
          <p className="text-[10px] text-blue-200/60 truncate">
            PTSP Kemenag Barito Utara
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {groups.map((group, gi) => {
          const GroupIcon = GROUP_ICONS[group];
          const groupItems = ADMIN_NAV.filter(
            (item) => (item.group || "") === group,
          );
          return (
            <div key={group} className={gi > 0 ? "pt-2" : ""}>
              {group && (
                <div className="mb-1.5 mt-2 first:mt-0 flex items-center gap-1.5 px-3">
                  {GroupIcon && (
                    <GroupIcon className="h-3 w-3 text-slate-500" />
                  )}
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    {group}
                  </p>
                </div>
              )}
              <div className="space-y-0.5">
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
              {gi < groups.length - 1 && (
                <div className="mx-3 mt-3 border-t border-white/[0.06]" />
              )}
            </div>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="border-t border-white/10 p-3 space-y-2">
        {/* Profile card */}
        <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400/30 to-blue-600/30 border border-white/15 text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {profile?.full_name || profile?.email || "Admin"}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-300">
                  <Crown className="h-2.5 w-2.5" />
                  Super Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-300">
                  <Shield className="h-2.5 w-2.5" />
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
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 border border-transparent hover:border-red-500/20"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
            <LogOut className="h-3.5 w-3.5" />
          </span>
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex w-full overflow-hidden bg-slate-50 fixed inset-0">
      {/* ── Desktop Sidebar ─────────────────────────────────────── */}
      <aside className="hidden lg:flex w-[260px] xl:w-[280px] shrink-0 flex-col bg-[#0f2563] border-r border-white/[0.06]">
        <Sidebar />
      </aside>

      {/* ── Mobile sidebar overlay ──────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative z-10 flex w-[260px] flex-col bg-[#0f2563] border-r border-white/[0.06]">
            <Sidebar onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main content area ───────────────────────────────────── */}
      <div className="flex flex-1 min-w-0 flex-col overflow-hidden bg-slate-50">
        {/* Top bar — visible on mobile (hamburger) + desktop (breadcrumb area) */}
        <header className="flex items-center gap-3 border-b border-slate-200/80 bg-white px-4 py-3 shrink-0 shadow-sm">
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
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              PTSP Kemenag Barito Utara
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Role badge */}
          {isSuperAdmin ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200/80 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
              <Crown className="h-3 w-3" />
              Super Admin
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200/80 px-2.5 py-1 text-[10px] font-semibold text-[#1f4bb7]">
              <Shield className="h-3 w-3" />
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
