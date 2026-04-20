import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="space-y-5">
      <section className="ptsp-card p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
              Panel Admin PTSP
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Kelola layanan, pengajuan, pengguna, dan dokumen hasil secara
              terpusat.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            Akses Administrator
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <DashboardSidebar isAdmin />
        <div className="space-y-5">{children}</div>
      </div>
    </div>
  );
}
