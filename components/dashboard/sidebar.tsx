import Link from 'next/link';

export function DashboardSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4">
      <nav className="space-y-2 text-sm">
        <Link className="block rounded-lg px-3 py-2 hover:bg-slate-50" href={isAdmin ? '/admin' : '/dashboard'}>
          Ringkasan
        </Link>
        {isAdmin ? (
          <>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-50" href="/admin/layanan">
              Layanan
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-50" href="/admin/item-layanan">
              Item Layanan
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-50" href="/admin/form-layanan">
              Form Layanan
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-50" href="/admin/persyaratan">
              Persyaratan
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-50" href="/admin/pengajuan">
              Pengajuan
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-50" href="/admin/pengguna">
              Pengguna
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-50" href="/admin/dokumen-hasil">
              Dokumen Hasil
            </Link>
          </>
        ) : (
          <>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-50" href="/dashboard/pengajuan">
              Pengajuan
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-50" href="/dashboard/pengajuan/baru">
              Buat Pengajuan
            </Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-slate-50" href="/dashboard/profil">
              Profil
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
