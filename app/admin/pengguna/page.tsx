import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { updateUserRoleAction } from '@/lib/actions/admin';
import { formatDate } from '@/lib/utils';

export default async function AdminUsersPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const { data: users } = await admin.from('profiles').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Kelola Pengguna</h1>
        <p className="mt-2 text-slate-600">Ubah role pengguna sesuai kebutuhan.</p>
      </div>

      <Card>
        <div className="space-y-4">
          {(users ?? []).map((user: any) => (
            <form key={user.id} action={updateUserRoleAction} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-[1.5fr,1fr,auto]">
              <input type="hidden" name="id" value={user.id} />
              <div>
                <p className="font-medium text-slate-900">{user.full_name || '-'}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
                <p className="text-xs text-slate-400">Terdaftar: {formatDate(user.created_at)}</p>
              </div>
              <Select name="role" defaultValue={user.role}>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </Select>
              <Button>Simpan Role</Button>
            </form>
          ))}
        </div>
      </Card>
    </div>
  );
}
