import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  createFieldAction,
  deleteFieldAction,
  updateFieldAction
} from '@/lib/actions/admin';

export default async function AdminFormFieldsPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const [{ data: items }, { data: fields }] = await Promise.all([
    admin.from('service_items').select('id, name').order('name'),
    admin.from('service_form_fields').select('*, service_items(name)').order('service_item_id').order('sort_order')
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Kelola Form Layanan</h1>
        <p className="mt-2 text-slate-600">Field form diambil dari database dan dipakai untuk form dinamis.</p>
      </div>

      <Card title="Tambah Field">
        <form action={createFieldAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Item Layanan">
            <Select name="service_item_id" required>
              <option value="">Pilih item layanan</option>
              {(items ?? []).map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Label">
            <Input name="label" required />
          </Field>
          <Field label="Nama Field">
            <Input name="name" required />
          </Field>
          <Field label="Tipe">
            <Select name="type" defaultValue="text">
              <option value="text">text</option>
              <option value="textarea">textarea</option>
              <option value="number">number</option>
              <option value="date">date</option>
              <option value="select">select</option>
            </Select>
          </Field>
          <Field label="Placeholder">
            <Input name="placeholder" />
          </Field>
          <Field label="Opsi Select" hint='Contoh JSON: ["Islam","Katolik"]'>
            <Input name="options" />
          </Field>
          <Field label="Urutan">
            <Input type="number" name="sort_order" defaultValue={0} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_required" defaultChecked />
            Wajib diisi
          </label>
          <div className="md:col-span-2">
            <Button>Simpan Field</Button>
          </div>
        </form>
      </Card>

      <Card title="Daftar Field">
        <div className="space-y-4">
          {(fields ?? []).map((field: any) => (
            <div key={field.id} className="rounded-xl border border-slate-200 p-4">
              <form action={updateFieldAction} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={field.id} />
                <Field label="Item Layanan">
                  <Select name="service_item_id" defaultValue={String(field.service_item_id)}>
                    {(items ?? []).map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Label">
                  <Input name="label" defaultValue={field.label} />
                </Field>
                <Field label="Nama Field">
                  <Input name="name" defaultValue={field.name} />
                </Field>
                <Field label="Tipe">
                  <Select name="type" defaultValue={field.type}>
                    <option value="text">text</option>
                    <option value="textarea">textarea</option>
                    <option value="number">number</option>
                    <option value="date">date</option>
                    <option value="select">select</option>
                  </Select>
                </Field>
                <Field label="Placeholder">
                  <Input name="placeholder" defaultValue={field.placeholder || ''} />
                </Field>
                <Field label="Opsi Select">
                  <Input name="options" defaultValue={field.options || ''} />
                </Field>
                <Field label="Urutan">
                  <Input type="number" name="sort_order" defaultValue={field.sort_order} />
                </Field>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_required" defaultChecked={field.is_required} />
                  Wajib
                </label>
                <div className="flex gap-2">
                  <Button>Simpan</Button>
                </div>
              </form>
              <form action={deleteFieldAction} className="mt-3">
                <input type="hidden" name="id" value={field.id} />
                <Button variant="danger">Hapus</Button>
              </form>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
