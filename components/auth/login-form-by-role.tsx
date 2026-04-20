"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LoginRoleMode = "pemohon" | "petugas";

function normalizeWhatsappNumber(raw: string) {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.startsWith("62")) return `+${digits}`;
  if (digits.startsWith("0")) return `+62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `+62${digits}`;
  if (raw.startsWith("+")) return `+${digits}`;
  return `+${digits}`;
}

export function LoginFormByRole({ mode }: { mode: LoginRoleMode }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [captchaA, setCaptchaA] = useState(
    () => Math.floor(Math.random() * 9) + 1,
  );
  const [captchaB, setCaptchaB] = useState(
    () => Math.floor(Math.random() * 9) + 1,
  );

  const captchaQuestion = useMemo(
    () => `${captchaA} + ${captchaB}`,
    [captchaA, captchaB],
  );
  const regenerateCaptcha = () => {
    setCaptchaA(Math.floor(Math.random() * 9) + 1);
    setCaptchaB(Math.floor(Math.random() * 9) + 1);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const supabase = createClient();

    let email = String(formData.get("email") || "");

    if (mode === "pemohon") {
      const phoneRaw = String(formData.get("phone") || "");
      const normalizedPhone = normalizeWhatsappNumber(phoneRaw);

      if (!normalizedPhone) {
        setLoading(false);
        setError("Nomor WhatsApp wajib diisi.");
        return;
      }

      const { data: profileByPhone, error: profilePhoneError } = await supabase
        .from("profiles")
        .select("id, phone, role")
        .or(`phone.eq.${normalizedPhone},phone.eq.${phoneRaw}`)
        .maybeSingle();

      if (profilePhoneError || !profileByPhone) {
        setLoading(false);
        setError("Nomor WhatsApp tidak ditemukan. Pastikan sudah terdaftar.");
        return;
      }

      const { data: profileDetail, error: detailError } = await supabase
        .from("profiles")
        .select("id, phone, role")
        .eq("id", profileByPhone.id)
        .maybeSingle();

      if (detailError || !profileDetail) {
        setLoading(false);
        setError("Data akun tidak valid. Hubungi admin PTSP.");
        return;
      }

      const { error: userResByIdError } = await supabase.auth.getUser();

      if (userResByIdError && !email) {
        setLoading(false);
        setError(
          "Masuk dengan WA membutuhkan email akun yang sesuai. Hubungi admin.",
        );
        return;
      }

      if (!email) {
        setLoading(false);
        setError(
          "Sistem WA login belum memiliki pemetaan email pada akun ini. Silakan hubungi admin untuk sinkronisasi.",
        );
        return;
      }
    }

    if (mode === "petugas") {
      const captchaAnswer = Number(formData.get("captcha_answer") || 0);
      const expectedAnswer = captchaA + captchaB;

      if (captchaAnswer !== expectedAnswer) {
        setLoading(false);
        setError("Jawaban captcha salah. Coba lagi.");
        regenerateCaptcha();
        return;
      }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setLoading(false);
      setError(signInError.message);
      return;
    }

    const { data: userRes, error: userError } = await supabase.auth.getUser();

    if (userError || !userRes.user) {
      setLoading(false);
      setError(userError?.message || "Gagal memuat data pengguna.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userRes.user.id)
      .maybeSingle();

    if (profileError) {
      setLoading(false);
      setError(profileError.message);
      return;
    }

    const role = String(profile?.role || "user");
    const isAdmin = role === "admin" || role === "super_admin";
    const isPetugasRole =
      role === "admin" ||
      role === "super_admin" ||
      role === "admin_tu" ||
      role === "kasubag_tu" ||
      role === "kepala_kantor" ||
      role === "admin_penomoran_surat";

    if (mode === "petugas" && !isPetugasRole) {
      await supabase.auth.signOut();
      setLoading(false);
      setError("Akun ini bukan akun petugas/admin.");
      return;
    }

    if (mode === "pemohon" && isAdmin) {
      router.push("/admin");
      router.refresh();
      return;
    }

    setLoading(false);
    router.push(
      mode === "petugas" ? "/admin" : isAdmin ? "/admin" : "/dashboard",
    );
    router.refresh();
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      {mode === "pemohon" ? (
        <Field label="Nomor WhatsApp" required hint="Contoh: 08123456789">
          <Input name="phone" required placeholder="Masukkan nomor WhatsApp" />
        </Field>
      ) : (
        <Field label="Email" required>
          <Input
            type="email"
            name="email"
            required
            placeholder="nama@instansi.go.id"
          />
        </Field>
      )}

      <Field label="Password" required>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
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

      {mode === "petugas" ? (
        <Field
          label="Captcha Sederhana"
          required
          hint="Isi hasil perhitungan untuk verifikasi keamanan"
        >
          <div className="grid gap-2 sm:grid-cols-[1fr,120px]">
            <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-900">
              <ShieldCheck className="h-4 w-4" />
              <span>Berapa hasil {captchaQuestion} ?</span>
            </div>
            <Input
              name="captcha_answer"
              type="number"
              required
              placeholder="Jawaban"
            />
          </div>
        </Field>
      ) : null}

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <Button
        className="w-full bg-[#007a3d]! hover:bg-[#016834]!"
        disabled={loading}
      >
        {loading
          ? "Memproses..."
          : mode === "petugas"
            ? "Masuk Sebagai Petugas"
            : "Masuk Sebagai Pemohon"}
      </Button>
    </form>
  );
}
