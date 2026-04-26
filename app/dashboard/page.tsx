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
      <section className="relative overflow-hidden rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-slate-200">
        {/* Soft blue accent line at the top */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1f4bb7] to-[#0f8a54]"></div>

        <div className="relative mx-auto grid gap-6 lg:grid-cols-[1fr,auto] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#1f4bb7]">
              <Sparkles className="h-3.5 w-3.5" />
              Ruang Pemohon
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Halo, {profile.full_name || "Pemohon"} 👋
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base max-w-xl">
              Pantau status layanan, kirim pengajuan baru, dan kelola dokumen
              Anda dengan mudah dan transparan.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col justify-center rounded-xl border border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList className="h-4 w-4 text-slate-400" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Total Pengajuan
                </p>
              </div>
              <p className="text-3xl font-black text-[#1f4bb7]">
                {stats.total}
              </p>
            </div>
            <div className="flex flex-col justify-center rounded-xl border border-emerald-100 bg-emerald-50 px-6 py-4">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  Selesai
                </p>
              </div>
              <p className="text-3xl font-black text-emerald-700">
                {stats.finished}
              </p>
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
    </div>
  );
}
