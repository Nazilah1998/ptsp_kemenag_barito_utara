import Link from "next/link";
import { LoginFormByRole } from "@/components/auth/login-form-by-role";

export default function LoginPetugasPage() {
  return (
    <div className="flex min-h-[calc(100dvh-112px)] items-center justify-center px-3 py-1 sm:px-4">
      <section className="w-full max-w-120 rounded-xl border border-slate-200 bg-white p-4 shadow-md sm:max-w-130 sm:p-5">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1f4bb7]">
            Portal Internal
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">
            Login Petugas
          </h1>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">
            Masuk untuk mengelola layanan dan proses pengajuan PTSP.
          </p>
        </div>

        <div className="mt-4">
          <LoginFormByRole mode="petugas" />
        </div>

        <div className="mt-3 grid gap-1 text-center text-xs sm:text-sm">
          <Link
            href="/register/petugas"
            className="font-medium text-[#1f4bb7] hover:underline"
          >
            Daftar akun petugas
          </Link>
          <Link
            href="/forgot-password"
            className="font-medium text-[#1f4bb7] hover:underline"
          >
            Lupa password?
          </Link>
        </div>
      </section>
    </div>
  );
}
