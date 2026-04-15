import { createServiceAction } from '@/lib/actions/admin';
import { requireAdmin } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default async function AddServicePage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Tambah Layanan</h1>
        <p className="mt-2 text-slate-600">Buat layanan utama baru.</p>
      </div>

      <Card>
        <form action={createServiceAction} className="space-y-4">
          <Field label="Nama Layanan" required>
            <Input name="name" required />
          </Field>
          <Field label="Slug" required hint="Boleh dikosongkan. Sistem akan membuat slug dari nama.">
            <Input name="slug" />
          </Field>
          <Field label="Deskripsi">
            <Textarea name="description" />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" defaultChecked />
            Aktif
          </label>
          <Button>Simpan</Button>
        </form>
      </Card>
    </div>
  );
}
