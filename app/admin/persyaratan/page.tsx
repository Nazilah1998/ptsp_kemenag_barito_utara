import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  createRequirementAction,
  deleteRequirementAction,
  updateRequirementAction
} from '@/lib/actions/admin';

export default async function AdminRequirementsPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const [{ data: items }, { data: requirements }] = await Promise.all([
    admin.from('service_items').select('id, name').order('name'),
    admin
      .from('service_requirements')
      .select('*, service_items(name)')
      .order('service_item_id')
      .order('id')
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-[#0f2563] to-[#1f4bb7] px-5 py-4 shadow-md shadow-blue-900/20">
        <h1 className="text-3xl font-bold text-white">Kelola Persyaratan</h1>
        <p className="mt-2 text-blue-100/80">Atur dokumen persyaratan untuk tiap item layanan.</p>
      </div>

      <Card title="Tambah Persyaratan">
        <form action={createRequirementAction} className="grid gap-4 md:grid-cols-2">
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
          <Field label="Nama Dokumen">
            <Input name="document_name" required />
          </Field>
          <Field label="Deskripsi">
            <Textarea name="description" />
          </Field>
          <Field label="Ekstensi File">
            <Input name="allowed_extensions" defaultValue="pdf,jpg,jpeg,png" />
          </Field>
          <Field label="Maksimal Ukuran File (MB)">
            <Input type="number" name="max_file_size_mb" defaultValue={5} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_required" defaultChecked />
            Wajib
          </label>
          <div className="md:col-span-2">
            <Button>Simpan Persyaratan</Button>
          </div>
        </form>
      </Card>

      <Card title="Daftar Persyaratan">
        <div className="space-y-4">
          {(requirements ?? []).map((requirement: any) => (
            <div key={requirement.id} className="rounded-xl border border-slate-200 p-4">
              <form action={updateRequirementAction} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={requirement.id} />
                <Field label="Item Layanan">
                  <Select name="service_item_id" defaultValue={String(requirement.service_item_id)}>
                    {(items ?? []).map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Nama Dokumen">
                  <Input name="document_name" defaultValue={requirement.document_name} />
                </Field>
                <Field label="Deskripsi">
                  <Textarea name="description" defaultValue={requirement.description || ''} />
                </Field>
                <Field label="Ekstensi">
                  <Input name="allowed_extensions" defaultValue={requirement.allowed_extensions || ''} />
                </Field>
                <Field label="Maksimal Ukuran (MB)">
                  <Input type="number" name="max_file_size_mb" defaultValue={requirement.max_file_size_mb} />
                </Field>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_required" defaultChecked={requirement.is_required} />
                  Wajib
                </label>
                <div>
                  <Button>Simpan</Button>
                </div>
              </form>
              <form action={deleteRequirementAction} className="mt-3">
                <input type="hidden" name="id" value={requirement.id} />
                <Button variant="danger">Hapus</Button>
              </form>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
