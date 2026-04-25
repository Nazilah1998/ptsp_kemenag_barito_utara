"use client";

import { useMemo, useState, useEffect, type FormEvent } from "react";
import { Eye, EyeOff, ShieldCheck, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isAdminRole } from "@/lib/constants";

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

  const [mounted, setMounted] = useState(false);
  const [captchaA, setCaptchaA] = useState(1);
  const [captchaB, setCaptchaB] = useState(1);

  useEffect(() => {
    setMounted(true);
    setCaptchaA(Math.floor(Math.random() * 9) + 1);
    setCaptchaB(Math.floor(Math.random() * 9) + 1);
  }, []);
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
      .select("role, is_verified")
      .eq("id", userRes.user.id)
      .maybeSingle();

    if (profileError) {
      setLoading(false);
      setError(profileError.message);
      return;
    }

    const role = String(profile?.role || "user");
    const isAdmin = isAdminRole(role);
    const isPetugasRole = isAdminRole(role);

    // Cek verifikasi: petugas yang belum diverifikasi Super Admin tidak bisa login
    if (mode === "petugas" && isPetugasRole && profile?.is_verified === false) {
      await supabase.auth.signOut();
      setLoading(false);
      setError("Akun Anda sedang menunggu verifikasi dari Super Admin. Silakan hubungi admin untuk aktivasi.");
      return;
    }

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
          label="Keamanan (Captcha)"
          required
          hint="Isi hasil perhitungan di atas untuk verifikasi"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-2 shadow-sm">
              <div className="flex items-center gap-3 pl-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-[14px] font-bold text-slate-700 tracking-wide">
                  Berapa hasil {mounted ? captchaQuestion : "..."} ?
                </span>
              </div>
              <button
                type="button"
                onClick={regenerateCaptcha}
                className="group flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                title="Ganti soal captcha"
              >
                <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>
            </div>
            <Input
              name="captcha_answer"
              type="number"
              required
              placeholder="Ketik angka jawaban di sini..."
              className="font-bold text-slate-700 h-11"
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
        className={`w-full h-11 text-[15px] font-bold shadow-md transition-all ${mode === "petugas" ? "bg-[#0f8a54]! hover:bg-[#0b7446]! hover:shadow-emerald-500/25" : "bg-[#1f4bb7]! hover:bg-[#1a3fa3]! hover:shadow-blue-500/25"}`}
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
