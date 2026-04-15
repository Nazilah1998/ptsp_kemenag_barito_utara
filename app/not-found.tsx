import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-slate-600">Periksa kembali alamat URL yang Anda buka.</p>
      <Link href="/" className="mt-4 inline-flex text-sm font-medium text-green-700">
        Kembali ke beranda
      </Link>
    </div>
  );
}
