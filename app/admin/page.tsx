import {
  Layers3,
  Users,
  FileClock,
  RefreshCcw,
  CheckCircle2,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/card";

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

  const cards = [
    {
      title: "Jumlah Layanan",
      value: serviceCount ?? 0,
      icon: Layers3,
      color: "text-[#1f4bb7]",
    },
    {
      title: "Jumlah Pengguna",
      value: userCount ?? 0,
      icon: Users,
      color: "text-violet-600",
    },
    {
      title: "Perlu Diproses",
      value: stats.submitted + stats.underReview,
      icon: FileClock,
      color: "text-amber-600",
    },
    {
      title: "Perlu Revisi",
      value: stats.revision,
      icon: RefreshCcw,
      color: "text-rose-600",
    },
    {
      title: "Selesai",
      value: stats.finished,
      icon: CheckCircle2,
      color: "text-emerald-600",
    },
  ];

  const quickMenus = [
    { label: "Kelola Layanan", href: "/admin/layanan" },
    { label: "Kelola Item Layanan", href: "/admin/item-layanan" },
    { label: "Kelola Form Layanan", href: "/admin/form-layanan" },
    { label: "Kelola Persyaratan", href: "/admin/persyaratan" },
    { label: "Kelola Pengajuan", href: "/admin/pengajuan" },
    { label: "Kelola Pengguna", href: "/admin/pengguna" },
  ];

  return (
    <div className="space-y-6">
      <section className="ptsp-card p-5 md:p-6">
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
          Ringkasan Statistik Admin
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Pantau kondisi layanan, aktivitas pengguna, dan progres pengajuan
          secara real-time.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((item) => (
          <Card key={item.title} className="border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-600">{item.title}</p>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {item.value}
            </p>
          </Card>
        ))}
      </section>

      <section className="ptsp-card p-5 md:p-6">
        <h3 className="text-lg font-bold text-slate-900">Aksi Cepat Admin</h3>
        <p className="mt-1 text-sm text-slate-600">
          Akses cepat ke menu CRUD utama.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickMenus.map((menu) => (
            <a
              key={menu.href}
              href={menu.href}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#1f4bb7] hover:bg-blue-50 hover:text-[#1f4bb7]"
            >
              {menu.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
