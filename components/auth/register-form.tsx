"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function normalizeWhatsappNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("62")) return `0${digits.slice(2)}`;
  return digits;
}

function buildInternalEmailFromPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `pemohon.${digits}@ptsp.local`;
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const full_name = String(formData.get("full_name") || "").trim();
    const rawPhone = String(formData.get("phone") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const password = String(formData.get("password") || "");

    const normalizedPhone = normalizeWhatsappNumber(rawPhone);

    if (!normalizedPhone || normalizedPhone.length < 10) {
      setLoading(false);
      setError("Nomor Telepon / WhatsApp tidak valid.");
      return;
    }

    const supabase = createClient();

    const { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("id, phone")
      .or(`phone.eq.${normalizedPhone},phone.eq.${rawPhone}`)
      .maybeSingle();

    if (checkError) {
      setLoading(false);
      setError("Gagal memeriksa nomor telepon. Silakan coba lagi.");
      return;
    }

    if (existingProfile) {
      setLoading(false);
      setError("Nomor sudah terdaftar. Silakan gunakan nomor lain.");
      return;
    }

    const internalEmail = buildInternalEmailFromPhone(normalizedPhone);

    const { error: signUpError } = await supabase.auth.signUp({
      email: internalEmail,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          full_name,
          phone: normalizedPhone,
          address,
          role: "user",
          plain_password: password,
          registration_source: "pemohon_phone_only",
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setMessage(
      "Registrasi berhasil. Silakan login menggunakan nomor WhatsApp dan password.",
    );
    router.push("/login/pemohon");
    router.refresh();
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <Field label="Nama Lengkap" required>
        <Input name="full_name" required placeholder="Masukkan nama lengkap" />
      </Field>

      <Field
        label="Nomor Telepon / WhatsApp"
        required
        hint="Contoh: 081234567890"
      >
        <Input
          name="phone"
          required
          placeholder="Masukkan nomor WhatsApp aktif"
        />
      </Field>

      <Field label="Alamat" required>
        <Textarea
          name="address"
          required
          placeholder="Masukkan alamat lengkap"
          className="min-h-24"
        />
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
        className="w-full h-11 text-[15px] font-bold shadow-md transition-all bg-[#1f4bb7]! hover:bg-[#1a3fa3]! hover:shadow-blue-500/25"
        disabled={loading}
      >
        {loading ? "Memproses..." : "Buat Akun"}
      </Button>
    </form>
  );
}
