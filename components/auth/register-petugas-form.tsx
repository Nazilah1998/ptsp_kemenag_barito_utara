"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const UNIT_KERJA_OPTIONS = [
  "Kepala Kantor",
  "Sub Bagian Tata Usaha",
  "Seksi Pendidikan Madrasah",
  "Seksi Pendidikan Agama Islam",
  "Seksi Pendidik Diniyah & Pontren",
  "Seksi Bimas Islam",
  "Seksi Bimas Kristen & Katolik",
  "Penyelenggara Zakat dan Wakaf",
  "Penyelenggara Hindu",
];

const PETUGAS_ROLES = [
  { value: "admin", label: "Admin PTSP" },
  { value: "admin_tu", label: "Admin TU" },
  { value: "kasubag_tu", label: "Kasubag TU" },
  { value: "kepala_kantor", label: "Kepala Kantor" },
  { value: "admin_penomoran_surat", label: "Admin Penomoran Surat" },
  { value: "super_admin", label: "Super Admin" },
];

export function RegisterPetugasForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const full_name = String(formData.get("full_name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const unit_kerja = String(formData.get("unit_kerja") || "").trim();
    const role = String(formData.get("role") || "admin");
    const password = String(formData.get("password") || "");

    const supabase = createClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          phone,
          unit_kerja,
          role,
          is_petugas_registration: true,
          pending_activation: true,
          is_active: false,
        },
        emailRedirectTo: undefined,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setMessage(
      "Registrasi petugas berhasil. Akun menunggu aktivasi super admin.",
    );
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
      router.push("/login/petugas");
      router.refresh();
    }, 1300);
  };

  return (
    <>
      {showSuccessToast ? (
        <div className="pointer-events-none fixed right-4 top-20 z-70 w-[min(92vw,360px)] animate-[fadeIn_0.25s_ease-out] rounded-xl border border-emerald-200 bg-white/95 p-3 shadow-2xl backdrop-blur">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 rounded-full bg-emerald-100 p-1 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Berhasil mendaftarkan akun
              </p>
              <p className="text-xs text-emerald-700">
                Akun petugas dibuat dan menunggu aktivasi super admin.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <form className="space-y-3" onSubmit={onSubmit}>
        <Field label="Nama Lengkap" required>
          <Input
            name="full_name"
            required
            placeholder="Masukkan nama lengkap"
          />
        </Field>

        <Field label="Email" required>
          <Input
            type="email"
            name="email"
            required
            placeholder="nama@instansi.go.id"
          />
        </Field>

        <Field
          label="Nomor Telepon"
          hint="Gunakan nomor penuh tanpa tanda - (contoh: 081234567890)"
        >
          <Input name="phone" placeholder="081234567890" />
        </Field>

        <Field label="Unit Kerja" required>
          <Select name="unit_kerja" required defaultValue="">
            <option value="" disabled>
              - Pilih Unit Kerja -
            </option>
            {UNIT_KERJA_OPTIONS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Role Petugas" required>
          <Select name="role" required defaultValue="admin">
            {PETUGAS_ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Password" required hint="Minimal 6 karakter">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              minLength={6}
              required
              placeholder="Masukkan password"
              className="pr-11"
            />
            <button
              type="button"
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </Field>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {message}
          </p>
        ) : null}

        <Button
          className="w-full bg-[#007a3d]! hover:bg-[#016834]!"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Daftar Akun Petugas"}
        </Button>
      </form>
    </>
  );
}
