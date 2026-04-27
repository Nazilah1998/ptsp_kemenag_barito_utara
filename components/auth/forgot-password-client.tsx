"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircle2,
  ShieldCheck,
  ArrowLeft,
  Phone,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Mail,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  resetPasswordByPhoneAction,
  checkPhoneExistsAction,
} from "@/lib/actions/reset-password";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Role = "user" | "admin" | null;

export function ForgotPasswordClient() {
  const router = useRouter();
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState(1); // 1: Input Phone, 2: New Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form States
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const resetAll = () => {
    setRole(null);
    setStep(1);
    setError("");
    setPhone("");
    setNewPassword("");
    setConfirmPassword("");
    setEmail("");
  };

  // --- PEMOHON FLOW ---
  const handleCheckPhone = async () => {
    if (!phone) return setError("Masukkan nomor HP Anda.");
    setLoading(true);
    setError("");

    const result = await checkPhoneExistsAction(phone);

    setLoading(false);
    if (result.error) {
      return setError(result.error);
    }

    if (!result.exists) {
      return setError("Nomor HP tidak ditemukan dalam sistem.");
    }

    setStep(2);
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) return setError("Password minimal 6 karakter.");
    if (newPassword !== confirmPassword)
      return setError("Konfirmasi password tidak cocok.");

    setLoading(true);
    setError("");

    const result = await resetPasswordByPhoneAction(phone, newPassword);

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      toast.success("Password Berhasil Diperbarui!", {
        description: `Halo ${result.name}, password Anda telah berhasil diubah.`,
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
      });
      router.push("/login/pemohon");
    }
  };

  // --- PETUGAS FLOW ---
  const handleSendEmailLink = async () => {
    if (!email) return setError("Masukkan email petugas Anda.");
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      },
    );

    setLoading(false);
    if (resetError) {
      setError(resetError.message);
    } else {
      toast.success("Email Terkirim!", {
        description: "Silakan cek inbox email Anda untuk link reset password.",
      });
      router.push("/login/petugas");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {!role ? (
          /* STEP 0: Pemilihan Role */
          <motion.div
            key="role-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Reset Password
              </h1>
              <p className="text-slate-500">
                Pilih jenis akun Anda untuk melanjutkan proses reset password.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Option Pemohon */}
              <button
                onClick={() => setRole("user")}
                className="group relative flex flex-col items-center p-6 bg-white rounded-3xl border-2 border-slate-100 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <UserCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-black text-slate-800">Pemohon</h3>
                <p className="mt-1 text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                  Masyarakat Umum
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Pilih <ChevronRight className="h-3 w-3" />
                </div>
              </button>

              {/* Option Petugas */}
              <button
                onClick={() => setRole("admin")}
                className="group relative flex flex-col items-center p-6 bg-white rounded-3xl border-2 border-slate-100 hover:border-[#1f4bb7] hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#1f4bb7] group-hover:scale-110 group-hover:bg-[#1f4bb7] group-hover:text-white transition-all duration-300">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="font-black text-slate-800">Petugas</h3>
                <p className="mt-1 text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                  Internal Kemenag
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#1f4bb7] opacity-0 group-hover:opacity-100 transition-opacity">
                  Pilih <ChevronRight className="h-3 w-3" />
                </div>
              </button>
            </div>
          </motion.div>
        ) : (
          /* FORM FLOW */
          <motion.div
            key="form-flow"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden"
          >
            {/* Form Header */}
            <div
              className={`h-1.5 w-full ${role === "user" ? "bg-emerald-500" : "bg-[#1f4bb7]"}`}
            />

            <div className="p-8">
              <button
                onClick={resetAll}
                className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Kembali
              </button>

              {role === "user" ? (
                /* --- PEMOHON FORM (Phone Based) --- */
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">
                      {step === 1
                        ? "Verifikasi Nomor HP"
                        : "Atur Password Baru"}
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {step === 1
                        ? "Masukkan nomor WhatsApp yang terdaftar untuk verifikasi akun Anda."
                        : "Nomor ditemukan! Sekarang masukkan password baru yang aman."}
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                          <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Masukkan nomor WhatsApp (Contoh: 0812345...)"
                            className="h-14 pl-12 rounded-2xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 transition-all"
                          />
                        </div>
                        {error && (
                          <p className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                            <AlertCircle className="h-3.5 w-3.5" /> {error}
                          </p>
                        )}
                        <Button
                          onClick={handleCheckPhone}
                          disabled={loading}
                          className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold text-base shadow-lg shadow-emerald-600/20"
                        >
                          {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          ) : null}
                          Lanjutkan
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="relative">
                          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Password Baru"
                            className="h-14 pl-12 pr-12 rounded-2xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        <div className="relative">
                          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Konfirmasi Password Baru"
                            className="h-14 pl-12 pr-12 rounded-2xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {error && (
                          <p className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                            <AlertCircle className="h-3.5 w-3.5" /> {error}
                          </p>
                        )}
                        <Button
                          onClick={handleUpdatePassword}
                          disabled={loading}
                          className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold text-base shadow-lg shadow-emerald-600/20"
                        >
                          {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          ) : null}
                          Update Password
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* --- PETUGAS FORM (Email Based) --- */
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">
                      Reset Password Petugas
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Masukkan email petugas Anda. Kami akan mengirimkan link
                      untuk mengatur ulang password ke inbox Anda.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@kemenag.go.id"
                        className="h-14 pl-12 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                      />
                    </div>
                    {error && (
                      <p className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                        <AlertCircle className="h-3.5 w-3.5" /> {error}
                      </p>
                    )}
                    <Button
                      onClick={handleSendEmailLink}
                      disabled={loading}
                      className="w-full h-14 rounded-2xl bg-[#1f4bb7] hover:bg-[#1a3fa3] font-bold text-base shadow-lg shadow-blue-500/20"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : null}
                      Kirim Link Reset
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
