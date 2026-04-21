import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100dvh-112px)] items-center justify-center px-3 py-1 sm:px-4">
      <section className="w-full max-w-130 rounded-xl border border-slate-200 bg-white p-4 shadow-md sm:p-5">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1f4bb7]">
            Sistem PTSP
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">
            Daftar Akun Pemohon
          </h1>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            Buat akun pemohon untuk mengakses layanan PTSP online.
          </p>
        </div>

        <div className="mt-4">
          <RegisterForm />
        </div>

        <div className="mt-3 text-center text-xs sm:text-sm">
          <Link
            href="/login/pemohon"
            className="font-medium text-[#1f4bb7] hover:underline"
          >
            Kembali ke login pemohon
          </Link>
        </div>
      </section>
    </div>
  );
}
