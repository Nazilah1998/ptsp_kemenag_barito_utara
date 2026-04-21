import { Users, Shield, UserCheck, UserX, Crown, Search } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { updateUserRoleAction } from '@/lib/actions/admin';
import { PageHeader } from '@/components/admin/page-header';
import { formatDate } from '@/lib/utils';

function RoleBadge({ role }: { role: string }) {
  const config: Record<string, { label: string; className: string; icon: React.ElementType }> = {
    super_admin: {
      label: 'Super Admin',
      className: 'bg-amber-50 text-amber-700 border border-amber-200',
      icon: Crown,
    },
    admin: {
      label: 'Admin / Petugas',
      className: 'bg-blue-50 text-blue-700 border border-blue-200',
      icon: Shield,
    },
    user: {
      label: 'Pemohon',
      className: 'bg-slate-50 text-slate-600 border border-slate-200',
      icon: Users,
    },
  };

  const cfg = config[role] ?? config['user'];
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${cfg.className}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  await requireAdmin();
  const { q = '', role: roleFilter = '' } = await searchParams;
  const admin = createAdminClient();

  const { data: rawUsers } = await admin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  const users = (rawUsers ?? []).filter((user: any) => {
    const matchRole = roleFilter ? user.role === roleFilter : true;
    const matchQ = q
      ? String(user.full_name || '').toLowerCase().includes(q.toLowerCase()) ||
        String(user.email || '').toLowerCase().includes(q.toLowerCase())
      : true;
    return matchRole && matchQ;
  });

  const stats = {
    total: rawUsers?.length ?? 0,
    admin: rawUsers?.filter((u: any) => u.role === 'admin').length ?? 0,
    super_admin: rawUsers?.filter((u: any) => u.role === 'super_admin').length ?? 0,
    user: rawUsers?.filter((u: any) => u.role === 'user').length ?? 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Petugas & Pengguna"
        description="Kelola role dan akses pengguna sistem PTSP Kemenag Barito Utara."
        icon={Users}
      />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Total Pengguna',
            value: stats.total,
            icon: Users,
            color: 'bg-slate-100 text-slate-600',
          },
          {
            label: 'Super Admin',
            value: stats.super_admin,
            icon: Crown,
            color: 'bg-amber-100 text-amber-600',
          },
          {
            label: 'Admin / Petugas',
            value: stats.admin,
            icon: UserCheck,
            color: 'bg-blue-100 text-blue-600',
          },
          {
            label: 'Pemohon',
            value: stats.user,
            icon: UserX,
            color: 'bg-emerald-100 text-emerald-600',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-900 tabular-nums tracking-tight">
                  {card.value}
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color} transition-transform duration-300 group-hover:scale-110`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full bg-gradient-to-r from-[#1f4bb7] to-[#2d5bcf] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-3">
          <p className="text-sm font-medium text-slate-700">Filter & Pencarian</p>
        </div>
        <div className="p-5">
          <form className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Cari Pengguna
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Cari nama atau email pengguna..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition-all duration-200 hover:border-slate-400 focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/10 outline-none"
                />
              </div>
            </div>
            <div className="w-full md:w-52">
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Filter Role
              </label>
              <select
                name="role"
                defaultValue={roleFilter}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-200 hover:border-slate-400 focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/10 appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10 outline-none"
              >
                <option value="">Semua role</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin / Petugas</option>
                <option value="user">Pemohon</option>
              </select>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-500/20 transition-all duration-200 hover:shadow-md hover:shadow-blue-500/30 active:scale-[0.98]"
            >
              <Search className="h-4 w-4" />
              Cari
            </button>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">Daftar Pengguna</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Menampilkan <span className="font-semibold text-slate-700">{users.length}</span> dari{' '}
              <span className="font-semibold text-slate-700">{stats.total}</span> pengguna
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-slate-50/50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  #
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Nama Pengguna
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Role Saat Ini
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Terdaftar
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ubah Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user: any, idx: number) => (
                <tr
                  key={user.id}
                  className="group transition-colors duration-150 hover:bg-blue-50/30"
                >
                  <td className="px-5 py-4 text-xs text-slate-400 tabular-nums">
                    {idx + 1}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1f4bb7]/10 to-[#2d5bcf]/20 text-[#1f4bb7] font-bold text-sm select-none">
                        {(user.full_name || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {user.full_name || <span className="italic text-slate-400">Tanpa nama</span>}
                        </p>
                        {user.full_name && (
                          <p className="text-xs text-slate-400 mt-0.5">ID: {user.id.slice(0, 8)}…</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-slate-600 text-sm">{user.email || '-'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    {/* Hanya super_admin yang bisa diubah ke super_admin, jika bukan super_admin tampilkan opsi admin/user saja */}
                    <form
                      action={updateUserRoleAction}
                      className="flex items-center gap-2 justify-center"
                    >
                      <input type="hidden" name="id" value={user.id} />
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-400 focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/10 appearance-none outline-none pr-7 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat"
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin / Petugas</option>
                        <option value="user">Pemohon</option>
                      </select>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition-all duration-200 hover:shadow-md hover:shadow-blue-500/30 active:scale-[0.97] whitespace-nowrap"
                      >
                        <Shield className="h-3 w-3" />
                        Simpan
                      </button>
                    </form>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                        <Users className="h-8 w-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-600">
                          Tidak ada pengguna ditemukan
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Coba ubah filter atau kata kunci pencarian.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {users.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3">
            <p className="text-xs text-slate-500">
              Total{' '}
              <span className="font-semibold text-slate-700">{users.length}</span> pengguna
              {roleFilter ? ` dengan role "${roleFilter}"` : ''}
              {q ? ` untuk pencarian "${q}"` : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
