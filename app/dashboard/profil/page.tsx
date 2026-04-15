import { requireAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { updateProfileAction } from '@/lib/actions/user';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default async function ProfilePage() {
  const profile = await requireAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profil</h1>
        <p className="mt-2 text-slate-600">Perbarui data profil Anda.</p>
      </div>

      <Card>
        <form action={updateProfileAction} className="space-y-4">
          <Field label="Nama Lengkap">
            <Input name="full_name" defaultValue={profile.full_name || ''} />
          </Field>
          <Field label="Email">
            <Input value={profile.email || ''} readOnly />
          </Field>
          <Field label="Nomor Telepon">
            <Input name="phone" defaultValue={profile.phone || ''} />
          </Field>
          <Field label="Alamat">
            <Textarea name="address" defaultValue={profile.address || ''} />
          </Field>
          <Button>Simpan Profil</Button>
        </form>
      </Card>
    </div>
  );
}
