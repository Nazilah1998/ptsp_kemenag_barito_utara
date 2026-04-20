import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
        <div className="grid min-h-140 lg:grid-cols-[0.95fr,1.05fr]">
          <div className="flex flex-col items-center justify-center bg-[#1f4bb7] p-10 text-center text-white">
            <div className="max-w-sm space-y-5">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 text-2xl font-black uppercase ring-1 ring-white/30">
                ptsp
              </div>
              <h1 className="text-3xl font-extrabold leading-tight">
                Buat Akun PTSP Online
              </h1>
              <p className="text-sm text-blue-100">
                Daftarkan akun Anda untuk mengakses seluruh layanan digital PTSP
                Kementerian Agama.
              </p>
              <p className="rounded-xl bg-white/10 p-3 text-sm">
                Satu akun untuk pengajuan layanan, pemantauan status, dan unduh
                hasil dokumen.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="mx-auto w-full max-w-xl">
              <h2 className="text-3xl font-bold text-[#1f2b57]">Registrasi</h2>
              <p className="mt-2 text-sm text-slate-600">
                Lengkapi data berikut untuk membuat akun pemohon baru.
              </p>

              <div className="mt-6">
                <RegisterForm />
              </div>

              <p className="mt-5 text-sm text-slate-600">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#1f4bb7] hover:underline"
                >
                  Login di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
