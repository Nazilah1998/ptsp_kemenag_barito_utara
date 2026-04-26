"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getEmailByPhoneAction(phone: string) {
  if (!phone) throw new Error("Nomor WhatsApp wajib diisi.");

  const admin = createAdminClient();
  const digits = phone.replace(/\D/g, "");

  // Search by various possible formats just in case
  const { data: profile, error } = await admin
    .from("profiles")
    .select("email")
    .or(`phone.eq.${digits},phone.eq.0${digits},phone.eq.62${digits}`)
    .maybeSingle();

  if (error || !profile) {
    return {
      error: "Nomor WhatsApp tidak ditemukan. Pastikan sudah terdaftar.",
    };
  }

  return { email: profile.email };
}
