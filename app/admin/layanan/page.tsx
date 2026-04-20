import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/card";
import { deleteServiceAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

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
      <section className="ptsp-card flex flex-wrap items-center justify-between gap-3 p-5 md:p-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Kelola Layanan
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            CRUD data layanan utama untuk katalog PTSP.
          </p>
        </div>
        <Link
          href="/admin/layanan/tambah"
          className="inline-flex items-center gap-2 rounded-xl bg-[#1f4bb7] px-4 py-2 text-sm font-semibold text-white hover:bg-[#183f9a]"
        >
          <Plus className="h-4 w-4" />
          Tambah Layanan
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{total}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Aktif
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{active}</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
            Nonaktif
          </p>
          <p className="mt-1 text-2xl font-bold text-rose-700">{inactive}</p>
        </div>
      </section>

      <Card className="border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="pb-3">ID</th>
                <th className="pb-3">Nama</th>
                <th className="pb-3">Slug</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(services ?? []).map((service: any) => (
                <tr key={service.id} className="border-t border-slate-100">
                  <td className="py-3 font-medium text-slate-700">
                    {service.id}
                  </td>
                  <td className="py-3">{service.name}</td>
                  <td className="py-3 text-slate-600">{service.slug}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        service.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {service.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/layanan/${service.id}/edit`}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                      <form action={deleteServiceAction}>
                        <input type="hidden" name="id" value={service.id} />
                        <Button variant="danger">Hapus</Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {!services?.length ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Belum ada layanan.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
