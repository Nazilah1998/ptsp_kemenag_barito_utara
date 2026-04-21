import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  createServiceItemAction,
  deleteServiceItemAction,
  updateServiceItemAction
} from '@/lib/actions/admin';

export default async function AdminServiceItemsPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const [{ data: services }, { data: items }] = await Promise.all([
    admin.from('services').select('*').order('name'),
    admin.from('service_items').select('*, services(name)').order('id')
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#0f2563] to-[#1f4bb7] px-5 py-4 shadow-md shadow-blue-900/20">
        <h1 className="text-3xl font-bold text-white">Kelola Item Layanan</h1>
        <p className="mt-2 text-blue-100/80">Tambah, edit, dan hapus item layanan.</p>
      </div>

      <Card title="Tambah Item Layanan">
        <form action={createServiceItemAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Layanan" required>
            <Select name="service_id" required>
              <option value="">Pilih layanan</option>
              {(services ?? []).map((service: any) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Nama Item" required>
            <Input name="name" required />
          </Field>
          <Field label="Slug" required>
            <Input name="slug" />
          </Field>
          <Field label="Deskripsi">
            <Textarea name="description" />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" defaultChecked />
            Aktif
          </label>
          <div className="md:col-span-2">
            <Button>Simpan Item</Button>
          </div>
        </form>
      </Card>

      <Card title="Daftar Item Layanan">
        <div className="space-y-4">
          {(items ?? []).map((item: any) => (
            <div key={item.id} className="rounded-xl border border-slate-200 p-4">
              <form action={updateServiceItemAction} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={item.id} />
                <Field label="Layanan">
                  <Select name="service_id" defaultValue={String(item.service_id)}>
                    {(services ?? []).map((service: any) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Nama Item">
                  <Input name="name" defaultValue={item.name} />
                </Field>
                <Field label="Slug">
                  <Input name="slug" defaultValue={item.slug} />
                </Field>
                <Field label="Deskripsi">
                  <Textarea name="description" defaultValue={item.description || ''} />
                </Field>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_active" defaultChecked={item.is_active} />
                  Aktif
                </label>
                <div>
                  <Button>Simpan</Button>
                </div>
              </form>
              <form action={deleteServiceItemAction} className="mt-3">
                <input type="hidden" name="id" value={item.id} />
                <Button variant="danger">Hapus</Button>
              </form>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
