import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck, UserRound } from "lucide-react";

export default function LoginSelectorPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <section className="relative overflow-hidden rounded-3xl border border-[#d9e4ff] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] md:p-6">
        <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-[#1f4bb7]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-60 w-60 rounded-full bg-[#9f8437]/15 blur-3xl" />

        <div className="relative">
          <div className="rounded-2xl border border-[#d9e4ff] bg-linear-to-r from-[#1f4bb7] via-[#245bd6] to-[#1a3f97] p-5 text-white md:p-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
              <BadgeCheck className="h-3.5 w-3.5" />
              Portal PTSP
            </p>
            <h1 className="mt-2.5 text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
              Pilih Jenis Login
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:text-base">
              Silakan pilih akses login sesuai peran Anda agar proses layanan
              berjalan lebih cepat, tepat, dan aman.
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:mt-5 md:grid-cols-2">
            <Link
              href="/login/pemohon"
              className="group rounded-2xl border border-emerald-200 bg-linear-to-b from-emerald-50 to-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <UserRound className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-emerald-800">
                Login Pemohon
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-emerald-700">
                Untuk masyarakat/pemohon yang ingin membuat pengajuan, melacak
                status, dan menerima hasil layanan.
              </p>

              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                <li className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Ajukan layanan online
                </li>
                <li className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Pantau progres pengajuan
                </li>
              </ul>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition group-hover:bg-emerald-700">
                Masuk sebagai Pemohon
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            <Link
              href="/login/petugas"
              className="group rounded-2xl border border-blue-200 bg-linear-to-b from-blue-50 to-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8efff] text-[#1f4bb7]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-[#1f4bb7]">
                Login Petugas / Admin
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-blue-700">
                Untuk petugas internal dalam mengelola layanan, memverifikasi
                berkas, dan memproses pengajuan pemohon.
              </p>

              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                <li className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#1f4bb7]" />
                  Verifikasi dan validasi data
                </li>
                <li className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#1f4bb7]" />
                  Kelola status layanan
                </li>
              </ul>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#1f4bb7] px-3 py-2 text-sm font-semibold text-white transition group-hover:bg-[#183f9a]">
                Masuk sebagai Petugas
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">
              Belum punya akun pemohon?
            </p>
            <p className="mt-1">
              Daftar akun terlebih dahulu di halaman{" "}
              <Link
                href="/register"
                className="font-semibold text-[#1f4bb7] hover:underline"
              >
                Registrasi Pemohon
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
