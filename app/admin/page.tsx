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
  Activity,
  ChevronRight,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/admin/page-header";
import { isSuperAdmin } from "@/lib/constants";

export default async function AdminHomePage() {
  const profile = await requireAdmin();
  const admin = createAdminClient();

  // Fetch permissions for this user
  let allowedMenus: string[] = [];
  if (profile.role === 'super_admin' || isSuperAdmin(profile.email)) {
    allowedMenus = ["ringkasan", "pengajuan", "layanan", "item_layanan", "form_layanan", "persyaratan", "pengguna", "dokumen_hasil"];
  } else {
    allowedMenus = profile.permissions || ["ringkasan", "pengajuan", "dokumen_hasil"];
  }

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

  const quickMenus = [
    {
      id: "layanan",
      label: "Kelola Layanan",
      href: "/admin/layanan",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: "item_layanan",
      label: "Item Layanan",
      href: "/admin/item-layanan",
      icon: Files,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      id: "form_layanan",
      label: "Form & Persyaratan",
      href: "/admin/form-layanan",
      icon: FormInput,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      id: "pengajuan",
      label: "Review Pengajuan",
      href: "/admin/pengajuan",
      icon: FolderKanban,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      id: "pengguna",
      label: "Manajemen Pengguna",
      href: "/admin/pengguna",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      id: "dokumen_hasil",
      label: "Dokumen Hasil",
      href: "/admin/dokumen-hasil",
      icon: FileOutput,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ].filter(menu => allowedMenus.includes(menu.id));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ringkasan Dashboard"
        description="Pantau kondisi layanan, aktivitas pengguna, dan progres pengajuan terkini."
        icon={LayoutDashboard}
      />

      {/* Alert Banner - Redesigned */}
      {needAction > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-orange-50/50 p-5 shadow-sm">
          <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-amber-100/50 to-transparent" />
          <div className="relative flex items-center justify-between gap-4 sm:flex-row flex-col sm:items-center">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100/80 text-amber-600 shadow-inner">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-900">
                  Perhatian Tindakan
                </h3>
                <p className="text-sm font-medium text-amber-700 mt-0.5">
                  Terdapat <span className="font-bold text-amber-600">{needAction} pengajuan</span> yang menunggu untuk diproses.
                </p>
              </div>
            </div>
            <Link
              href="/admin/pengajuan"
              className="flex shrink-0 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-amber-600 active:scale-95 hover:shadow-md hover:shadow-amber-500/25"
            >
              Tinjau Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Key Metrics - Clean Grid */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1f4bb7]">
              <Layers3 className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-500">Total Layanan</p>
          </div>
          <p className="text-3xl font-black text-slate-800 tabular-nums">
            {serviceCount ?? 0}
          </p>
          <p className="text-xs font-medium text-slate-400 mt-2">Layanan aktif di sistem</p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-500">Pengguna</p>
          </div>
          <p className="text-3xl font-black text-slate-800 tabular-nums">
            {userCount ?? 0}
          </p>
          <p className="text-xs font-medium text-slate-400 mt-2">Total akun terdaftar</p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-amber-200/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ring-1 ring-amber-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FileClock className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-amber-700">Perlu Diproses</p>
          </div>
          <p className="text-3xl font-black text-amber-600 tabular-nums">
            {needAction}
          </p>
          <p className="text-xs font-medium text-amber-500 mt-2">Menunggu tindakan admin</p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-500">Total Pengajuan</p>
          </div>
          <p className="text-3xl font-black text-slate-800 tabular-nums">
            {totalRequests}
          </p>
          <p className="text-xs font-medium text-slate-400 mt-2">Seluruh siklus pengajuan</p>
        </div>
      </div>

      {/* Two Column Layout for Status and Quick Links */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Column: Status Pengajuan */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#1f4bb7]" />
              Status Progres Pengajuan
            </h2>
            <Link
              href="/admin/pengajuan"
              className="text-xs font-bold text-[#1f4bb7] hover:text-[#143481] transition-colors"
            >
              Lihat Rincian &rarr;
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            {totalRequests === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                  <FolderKanban className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-500">Belum ada pengajuan</p>
                <p className="text-xs text-slate-400 mt-1">Data statistik akan muncul di sini.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {[
                  {
                    label: "Masuk / Menunggu",
                    value: stats.submitted,
                    color: "bg-blue-500",
                    text: "text-blue-700",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Sedang Diproses",
                    value: stats.underReview,
                    color: "bg-amber-500",
                    text: "text-amber-700",
                    bg: "bg-amber-50",
                  },
                  {
                    label: "Perlu Revisi Pemohon",
                    value: stats.revision,
                    color: "bg-rose-500",
                    text: "text-rose-700",
                    bg: "bg-rose-50",
                  },
                  {
                    label: "Selesai / Disetujui",
                    value: stats.finished,
                    color: "bg-emerald-500",
                    text: "text-emerald-700",
                    bg: "bg-emerald-50",
                  },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex items-end justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                        <span className="text-sm font-bold text-slate-700">{s.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-slate-900 tabular-nums leading-none">
                          {s.value}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 ml-1.5">
                          ({Math.round((s.value / totalRequests) * 100)}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${s.color} transition-all duration-1000 ease-out`}
                        style={{
                          width: `${Math.round((s.value / totalRequests) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Links */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            Akses Cepat Menu
          </h2>
          
          <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden p-2">
            <div className="flex flex-col gap-1">
              {quickMenus.map((menu) => (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className="group flex items-center justify-between rounded-xl p-3 transition-all hover:bg-slate-50 active:bg-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${menu.bg} ${menu.color} transition-transform group-hover:scale-105`}>
                      <menu.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                      {menu.label}
                    </span>
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-white group-hover:text-slate-900 group-hover:shadow-sm">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
