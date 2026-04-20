import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Files,
  FormInput,
  ListChecks,
  FolderKanban,
  Users,
  FileOutput,
  PlusCircle,
  UserCircle2,
} from "lucide-react";

export function DashboardSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <aside className="ptsp-card h-fit p-4 md:p-5">
      <div className="mb-4 border-b border-slate-100 pb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {isAdmin ? "Navigasi Admin" : "Navigasi Pemohon"}
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-800">
          {isAdmin ? "Kelola Seluruh Fitur PTSP" : "Akses Cepat Layanan PTSP"}
        </p>
      </div>

      <nav className="space-y-1.5 text-sm">
        <Link
          className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#1f4bb7]"
          href={isAdmin ? "/admin" : "/dashboard"}
        >
          <LayoutDashboard className="h-4 w-4" />
          Ringkasan
        </Link>

        {isAdmin ? (
          <>
            <Link
              className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#1f4bb7]"
              href="/admin/layanan"
            >
              <FileText className="h-4 w-4" />
              Layanan
            </Link>
            <Link
              className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#1f4bb7]"
              href="/admin/item-layanan"
            >
              <Files className="h-4 w-4" />
              Item Layanan
            </Link>
            <Link
              className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#1f4bb7]"
              href="/admin/form-layanan"
            >
              <FormInput className="h-4 w-4" />
              Form Layanan
            </Link>
            <Link
              className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#1f4bb7]"
              href="/admin/persyaratan"
            >
              <ListChecks className="h-4 w-4" />
              Persyaratan
            </Link>
            <Link
              className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#1f4bb7]"
              href="/admin/pengajuan"
            >
              <FolderKanban className="h-4 w-4" />
              Pengajuan
            </Link>
            <Link
              className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#1f4bb7]"
              href="/admin/pengguna"
            >
              <Users className="h-4 w-4" />
              Pengguna
            </Link>
            <Link
              className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#1f4bb7]"
              href="/admin/dokumen-hasil"
            >
              <FileOutput className="h-4 w-4" />
              Dokumen Hasil
            </Link>
          </>
        ) : (
          <>
            <Link
              className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#1f4bb7]"
              href="/dashboard/pengajuan"
            >
              <FolderKanban className="h-4 w-4" />
              Pengajuan
            </Link>
            <Link
              className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#1f4bb7]"
              href="/dashboard/pengajuan/baru"
            >
              <PlusCircle className="h-4 w-4" />
              Buat Pengajuan
            </Link>
            <Link
              className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#1f4bb7]"
              href="/dashboard/profil"
            >
              <UserCircle2 className="h-4 w-4" />
              Profil
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
