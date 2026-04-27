"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function checkPhoneExistsAction(phone: string) {
  if (!phone) return { error: "Nomor HP wajib diisi." };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  if (error || !data) {
    return { exists: false };
  }
  return { exists: true };
}

export async function resetPasswordByPhoneAction(
  phone: string,
  newPassword: string,
) {
  if (!phone || !newPassword) {
    return { error: "Data tidak lengkap." };
  }

  if (newPassword.length < 6) {
    return { error: "Password minimal 6 karakter." };
  }

  const admin = createAdminClient();

  // 1. Cari user berdasarkan nomor HP di tabel profiles
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id, full_name, email")
    .eq("phone", phone)
    .maybeSingle();

  if (profileError || !profile) {
    return { error: "Nomor HP tidak terdaftar dalam sistem." };
  }

  try {
    // 2. Update password di sistem Auth menggunakan Admin API
    const { error: authError } = await admin.auth.admin.updateUserById(
      profile.id,
      { password: newPassword },
    );

    if (authError) {
      return {
        error:
          "Gagal memperbarui password di sistem keamanan: " + authError.message,
      };
    }

    // 3. Update plain_password di tabel profiles agar tetap sinkron untuk Super Admin
    await admin
      .from("profiles")
      .update({ plain_password: newPassword })
      .eq("id", profile.id);

    return { success: true, name: profile.full_name };
  } catch (err: any) {
    return { error: "Terjadi kesalahan internal: " + err.message };
  }
}
