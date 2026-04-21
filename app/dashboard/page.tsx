import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  FileClock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/card";
import { DashboardFaq } from "@/components/dashboard/dashboard-faq";

export default async function DashboardHomePage() {
  const profile = await requireAuth();
  const admin = createAdminClient();

  const { data: requests } = await admin
    .from("service_requests")
    .select("status")
    .eq("user_id", profile.id);

  const stats = {
    total: requests?.length ?? 0,
    pending:
      requests?.filter((item) =>
        ["submitted", "under_review"].includes(item.status),
      ).length ?? 0,
    revision:
      requests?.filter((item) => item.status === "revision_required").length ??
      0,
    finished:
      requests?.filter((item) =>
        ["approved", "completed"].includes(item.status),
      ).length ?? 0,
  };

  return (
    <div className="space-y-5 md:space-y-7">
      <section className="ptsp-hero-gradient ptsp-grid-bg overflow-hidden rounded-2xl p-4 text-white sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              Dashboard Pemohon
            </span>
            <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
              Selamat datang, {profile.full_name || profile.email}
            </h1>
            <p className="mt-2 text-sm text-blue-50 sm:text-base">
              Pantau status layanan, kirim pengajuan baru, dan lihat progres
              proses layanan Anda.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur">
              <p className="text-[11px] text-blue-100">Total Pengajuan</p>
              <p className="mt-1 text-xl font-bold">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur">
              <p className="text-[11px] text-blue-100">Selesai</p>
              <p className="mt-1 text-xl font-bold">{stats.finished}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500">Total Pengajuan</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {stats.total}
              </p>
            </div>
            <ClipboardList className="h-5 w-5 text-[#1f4bb7]" />
          </div>
        </Card>
        <Card className="border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500">Menunggu Proses</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {stats.pending}
              </p>
            </div>
            <FileClock className="h-5 w-5 text-amber-600" />
          </div>
        </Card>
        <Card className="border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500">Perlu Revisi</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {stats.revision}
              </p>
            </div>
            <ShieldCheck className="h-5 w-5 text-rose-600" />
          </div>
        </Card>
        <Card className="border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500">Selesai</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {stats.finished}
              </p>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
        </Card>
      </div>

      <Card
        className="border-slate-200"
        title="Aksi Cepat"
        description="Buat pengajuan baru atau lihat riwayat pengajuan Anda."
      >
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/pengajuan/baru"
            className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-[#1f4bb7] px-4 py-2 text-sm font-semibold text-white hover:bg-[#183f9a]"
          >
            Buat Pengajuan Baru
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard/pengajuan"
            className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Lihat Riwayat
          </Link>
        </div>
      </Card>

      <DashboardFaq />
    </div>
  );
}
