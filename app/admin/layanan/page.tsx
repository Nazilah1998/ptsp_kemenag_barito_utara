import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card } from '@/components/ui/card';
import { deleteServiceAction } from '@/lib/actions/admin';
import { Button } from '@/components/ui/button';

export default async function AdminServicesPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const { data: services } = await admin.from('services').select('*').order('id');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Kelola Layanan</h1>
          <p className="mt-2 text-slate-600">CRUD data layanan utama.</p>
        </div>
        <Link href="/admin/layanan/tambah" className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white">
          Tambah Layanan
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="pb-3">ID</th>
                <th className="pb-3">Nama</th>
                <th className="pb-3">Slug</th>
                <th className="pb-3">Status</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {(services ?? []).map((service: any) => (
                <tr key={service.id} className="border-t border-slate-100">
                  <td className="py-3">{service.id}</td>
                  <td className="py-3">{service.name}</td>
                  <td className="py-3">{service.slug}</td>
                  <td className="py-3">{service.is_active ? 'Aktif' : 'Nonaktif'}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/layanan/${service.id}/edit`} className="text-green-700">
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
                  <td colSpan={5} className="py-6 text-center text-slate-500">
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
