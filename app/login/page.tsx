import Link from "next/link";

export default function LoginSelectorPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <section className="ptsp-card p-6 md:p-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#1f4bb7]">
            Portal PTSP
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Pilih Jenis Login
          </h1>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Silakan pilih halaman login sesuai peran Anda.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            href="/login/pemohon"
            className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-emerald-800">
              Login Pemohon
            </h2>
            <p className="mt-2 text-sm text-emerald-700">
              Untuk masyarakat/pemohon yang ingin membuat dan melacak pengajuan.
            </p>
          </Link>

          <Link
            href="/login/petugas"
            className="rounded-2xl border border-blue-200 bg-blue-50 p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-[#1f4bb7]">
              Login Petugas / Admin
            </h2>
            <p className="mt-2 text-sm text-blue-700">
              Untuk petugas internal dalam mengelola layanan dan proses
              verifikasi.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
