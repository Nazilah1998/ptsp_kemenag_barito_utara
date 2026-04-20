import Link from "next/link";
import { LoginFormByRole } from "@/components/auth/login-form-by-role";

export default function LoginPemohonPage() {
  return (
    <div className="flex min-h-[calc(100dvh-112px)] items-center justify-center px-3 py-1 sm:px-4">
      <section className="w-full max-w-115nded-xl border border-slate-200 bg-white p-4 shadow-md sm:p-5">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1f4bb7]">
            Sistem PTSP
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">
            Login Pemohon
          </h1>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            Masuk dengan nomor WhatsApp dan password.
          </p>
        </div>

        <div className="mt-4">
          <LoginFormByRole mode="pemohon" />
        </div>

        <div className="mt-3 grid gap-1 text-center text-xs sm:text-sm">
          <Link
            href="/forgot-password"
            className="font-medium text-[#1f4bb7] hover:underline"
          >
            Lupa kata sandi?
          </Link>
          <Link
            href="/register"
            className="font-medium text-[#1f4bb7] hover:underline"
          >
            Buat akun pemohon
          </Link>
          <Link
            href="/login/petugas"
            className="font-medium text-[#1f4bb7] hover:underline"
          >
            Login petugas
          </Link>
        </div>
      </section>
    </div>
  );
}
