"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Files,
  FormInput,
  ListChecks,
  FolderKanban,
  Users,
  FileOutput,
  PlusCircle,
  UserCircle2,
  ChevronRight,
  Shield,
  Database,
  Settings2,
} from "lucide-react";

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

const USER_NAV: NavItem[] = [
  { label: "Ringkasan", href: "/dashboard", icon: LayoutDashboard },
  { label: "Pengajuan Saya", href: "/dashboard/pengajuan", icon: FolderKanban },
  {
    label: "Buat Pengajuan",
    href: "/dashboard/pengajuan/baru",
    icon: PlusCircle,
  },
  { label: "Profil", href: "/dashboard/profil", icon: UserCircle2 },
];

const GROUP_ICONS: Record<string, React.ElementType> = {
  Utama: LayoutDashboard,
  "Master Data": Database,
  Sistem: Settings2,
};

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] text-white shadow-md shadow-blue-500/20"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-white/20 shadow-sm shadow-white/10"
            : "bg-slate-100/80 group-hover:bg-white group-hover:shadow-sm"
        }`}
      >
        <Icon
          className={`h-3.5 w-3.5 ${
            isActive
              ? "text-white"
              : "text-slate-500 group-hover:text-slate-700"
          }`}
        />
      </span>
      <span className="flex-1 leading-tight truncate">{item.label}</span>
      {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60 shrink-0" />}
    </Link>
  );
}

export function DashboardSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const navItems = isAdmin ? ADMIN_NAV : USER_NAV;

  const groups = isAdmin
    ? Array.from(new Set(navItems.map((item) => item.group || "")))
    : [""];

  return (
    <aside className="flex flex-col gap-3 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pb-2">
      {/* Navigation */}
      <nav className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#1f4bb7]/10">
              <Shield className="h-3.5 w-3.5 text-[#1f4bb7]" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
              {isAdmin ? "Menu Admin" : "Menu Utama"}
            </p>
          </div>
        </div>

        {/* Nav items */}
        <div className="p-2">
          {isAdmin ? (
            <div className="space-y-1">
              {groups.map((group, gi) => {
                const GroupIcon = GROUP_ICONS[group];
                const groupItems = navItems.filter(
                  (item) => (item.group || "") === group,
                );
                return (
                  <div key={group} className={gi > 0 ? "pt-1" : ""}>
                    {group && (
                      <div className="mb-1 mt-2 first:mt-0 flex items-center gap-1.5 px-3">
                        {GroupIcon && (
                          <GroupIcon className="h-3 w-3 text-slate-400" />
                        )}
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
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
                          />
                        );
                      })}
                    </div>
                    {gi < groups.length - 1 && (
                      <div className="mx-3 mt-2 border-t border-slate-100" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-0.5">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <NavLink key={item.href} item={item} isActive={isActive} />
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Info card */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-[#1f4bb7]/5 via-white to-slate-50/80 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#1f4bb7]/10">
            <Shield className="h-3.5 w-3.5 text-[#1f4bb7]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">
              {isAdmin ? "Panel Admin PTSP" : "Panel Pemohon PTSP"}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-400 leading-relaxed">
              {isAdmin
                ? "Kelola seluruh fitur dan data layanan PTSP Kemenag."
                : "Akses cepat untuk mengajukan dan melacak layanan."}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
