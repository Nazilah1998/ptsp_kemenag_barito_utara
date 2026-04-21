import Link from "next/link";
import { Plus, FileText, Pencil, Trash2, Inbox } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteServiceAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";

export default async function AdminServicesPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const { data: services } = await admin
    .from("services")
    .select("*")
    .order("id");

  const total = services?.length ?? 0;
  const active = services?.filter((item: any) => item.is_active).length ?? 0;
  const inactive = total - active;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Layanan"
        description="CRUD data layanan utama untuk katalog PTSP."
        icon={FileText}
        actions={
          <Link
            href="/admin/layanan/tambah"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Tambah Layanan
          </Link>
        }
      />

      {/* Summary Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums">{total}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Aktif</p>
          <p className="mt-1.5 text-2xl font-bold text-emerald-700 tabular-nums">{active}</p>
        </div>
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">Nonaktif</p>
          <p className="mt-1.5 text-2xl font-bold text-rose-700 tabular-nums">{inactive}</p>
        </div>
      </section>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-slate-50/50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">ID</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Nama</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Slug</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(services ?? []).map((service: any) => (
                <tr key={service.id} className="group transition-colors duration-150 hover:bg-blue-50/30">
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {service.id}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-900">{service.name}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded-md">{service.slug}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        service.is_active
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60"
                          : "bg-rose-50 text-rose-700 ring-1 ring-rose-200/60"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${service.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {service.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/layanan/${service.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Link>
                      <form action={deleteServiceAction}>
                        <input type="hidden" name="id" value={service.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200/60 hover:bg-red-100 transition-all duration-200"
                        >
                          <Trash2 className="h-3 w-3" />
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {!services?.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                        <Inbox className="h-8 w-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-600">Belum ada layanan</p>
                        <p className="mt-1 text-xs text-slate-400">Klik tombol &quot;Tambah Layanan&quot; untuk memulai.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
