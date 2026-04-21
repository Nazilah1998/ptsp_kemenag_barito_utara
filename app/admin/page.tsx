import Link from "next/link";
import {
  Layers3,
  Users,
  FileClock,
  RefreshCcw,
  CheckCircle2,
  LayoutDashboard,
  FileText,
  Files,
  FormInput,
  ListChecks,
  FolderKanban,
  FileOutput,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCheck,
  Clock,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/admin/page-header";

export default async function AdminHomePage() {
  await requireAdmin();
  const admin = createAdminClient();

  const [{ count: serviceCount }, { count: userCount }, { data: requests }] =
    await Promise.all([
      admin.from("services").select("*", { count: "exact", head: true }),
      admin.from("profiles").select("*", { count: "exact", head: true }),
      admin.from("service_requests").select("status"),
    ]);

  const stats = {
    submitted:
      requests?.filter((item) => item.status === "submitted").length ?? 0,
    underReview:
      requests?.filter((item) => item.status === "under_review").length ?? 0,
    revision:
      requests?.filter((item) => item.status === "revision_required").length ??
      0,
    finished:
      requests?.filter((item) =>
        ["approved", "completed"].includes(item.status),
      ).length ?? 0,
  };

  const totalRequests = requests?.length ?? 0;
  const needAction = stats.submitted + stats.underReview;

  const statCards = [
    {
      title: "Jumlah Layanan",
      value: serviceCount ?? 0,
      icon: Layers3,
      gradient: "from-[#1f4bb7] to-[#2d5bcf]",
      bg: "bg-blue-50",
      text: "text-[#1f4bb7]",
      sub: "Layanan aktif",
    },
    {
      title: "Jumlah Pengguna",
      value: userCount ?? 0,
      icon: Users,
      gradient: "from-[#1f4bb7] to-[#2d5bcf]",
      bg: "bg-blue-50",
      text: "text-[#1f4bb7]",
      sub: "Terdaftar",
    },
    {
      title: "Perlu Diproses",
      value: needAction,
      icon: FileClock,
      gradient: "from-amber-500 to-amber-600",
      bg: "bg-amber-50",
      text: "text-amber-600",
      sub: "Menunggu tindakan",
      highlight: needAction > 0,
    },
    {
      title: "Perlu Revisi",
      value: stats.revision,
      icon: RefreshCcw,
      gradient: "from-rose-500 to-rose-600",
      bg: "bg-rose-50",
      text: "text-rose-600",
      sub: "Perlu koreksi",
      highlight: stats.revision > 0,
    },
    {
      title: "Selesai",
      value: stats.finished,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      sub: "Disetujui / selesai",
    },
    {
      title: "Total Pengajuan",
      value: totalRequests,
      icon: TrendingUp,
      gradient: "from-slate-400 to-slate-500",
      bg: "bg-slate-100",
      text: "text-slate-500",
      sub: "Seluruh pengajuan",
    },
  ];

  const quickMenus = [
    {
      label: "Kelola Layanan",
      href: "/admin/layanan",
      icon: FileText,
      description: "CRUD layanan utama",
      iconColor: "text-[#1f4bb7]",
      iconBg: "bg-blue-50 group-hover:bg-blue-100",
    },
    {
      label: "Item Layanan",
      href: "/admin/item-layanan",
      icon: Files,
      description: "Sub-layanan per kategori",
      iconColor: "text-[#1f4bb7]",
      iconBg: "bg-blue-50 group-hover:bg-blue-100",
    },
    {
      label: "Form Layanan",
      href: "/admin/form-layanan",
      icon: FormInput,
      description: "Field form dinamis",
      iconColor: "text-[#1f4bb7]",
      iconBg: "bg-blue-50 group-hover:bg-blue-100",
    },
    {
      label: "Persyaratan",
      href: "/admin/persyaratan",
      icon: ListChecks,
      description: "Dokumen persyaratan",
      iconColor: "text-[#1f4bb7]",
      iconBg: "bg-blue-50 group-hover:bg-blue-100",
    },
    {
      label: "Pengajuan",
      href: "/admin/pengajuan",
      icon: FolderKanban,
      description: "Review pengajuan masuk",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 group-hover:bg-amber-100",
    },
    {
      label: "Pengguna",
      href: "/admin/pengguna",
      icon: Users,
      description: "Manajemen role pengguna",
      iconColor: "text-[#1f4bb7]",
      iconBg: "bg-blue-50 group-hover:bg-blue-100",
    },
    {
      label: "Dokumen Hasil",
      href: "/admin/dokumen-hasil",
      icon: FileOutput,
      description: "Generate & download PDF",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 group-hover:bg-emerald-100",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ringkasan Dashboard"
        description="Pantau kondisi layanan, aktivitas pengguna, dan progres pengajuan."
        icon={LayoutDashboard}
      />

      {/* Alert banner jika ada pengajuan menunggu */}
      {needAction > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">
              {needAction} pengajuan menunggu tindakan
            </p>
            <p className="text-xs text-amber-600 mt-0.5 truncate">
              Segera proses agar pelayanan berjalan lancar.
            </p>
          </div>
          <Link
            href="/admin/pengajuan"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-amber-600 active:scale-95"
          >
            Tinjau
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Stat Cards */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="h-4 w-0.5 rounded-full bg-gradient-to-b from-[#1f4bb7] to-[#2d5bcf]" />
          <h2 className="text-sm font-semibold text-slate-700">
            Statistik Sistem
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-3">
          {statCards.map((item) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                item.highlight ? "border-amber-200" : "border-slate-200/80"
              }`}
            >
              {/* bg blob */}
              <div
                className={`pointer-events-none absolute -right-3 -top-3 h-14 w-14 rounded-full ${item.bg} opacity-60 transition-all duration-300 group-hover:scale-125 group-hover:opacity-80`}
              />
              <div className="relative flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-slate-500 leading-tight">
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums tracking-tight">
                    {item.value}
                  </p>
                  <p
                    className={`mt-1 text-[11px] font-medium ${item.text} flex items-center gap-1`}
                  >
                    <Clock className="h-2.5 w-2.5" />
                    {item.sub}
                  </p>
                </div>
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-sm transition-transform duration-200 group-hover:scale-110`}
                >
                  <item.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-[#1f4bb7] to-[#2d5bcf] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Status Pengajuan */}
      {totalRequests > 0 && (
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-0.5 rounded-full bg-gradient-to-b from-[#1f4bb7] to-[#2d5bcf]" />
              <h2 className="text-sm font-semibold text-slate-800">
                Status Pengajuan
              </h2>
            </div>
            <Link
              href="/admin/pengajuan"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#1f4bb7] hover:underline"
            >
              Lihat semua
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
            {[
              {
                label: "Masuk",
                value: stats.submitted,
                color: "bg-blue-500",
                bg: "bg-blue-50",
                text: "text-blue-700",
              },
              {
                label: "Diproses",
                value: stats.underReview,
                color: "bg-amber-500",
                bg: "bg-amber-50",
                text: "text-amber-700",
              },
              {
                label: "Revisi",
                value: stats.revision,
                color: "bg-rose-500",
                bg: "bg-rose-50",
                text: "text-rose-700",
              },
              {
                label: "Selesai",
                value: stats.finished,
                color: "bg-emerald-500",
                bg: "bg-emerald-50",
                text: "text-emerald-700",
              },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl ${s.bg} p-3.5`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium ${s.text}`}>
                    {s.label}
                  </span>
                  <span
                    className={`text-base font-bold tabular-nums ${s.text}`}
                  >
                    {s.value}
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/60">
                  <div
                    className={`h-full rounded-full ${s.color} transition-all duration-500`}
                    style={{
                      width:
                        totalRequests > 0
                          ? `${Math.round((s.value / totalRequests) * 100)}%`
                          : "0%",
                    }}
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-slate-400">
                  {totalRequests > 0
                    ? Math.round((s.value / totalRequests) * 100)
                    : 0}
                  % dari total
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-0.5 rounded-full bg-gradient-to-b from-[#1f4bb7] to-[#2d5bcf]" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Menu Pengelolaan
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Akses cepat ke semua modul admin
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {quickMenus.map((menu) => {
            const Icon = menu.icon;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className="group flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white p-3.5 transition-all duration-200 hover:border-blue-200 hover:shadow-sm hover:bg-blue-50/30"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${menu.iconBg} ${menu.iconColor}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-[#1f4bb7] truncate">
                    {menu.label}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {menu.description}
                  </p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-all duration-200 group-hover:text-[#1f4bb7] group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
