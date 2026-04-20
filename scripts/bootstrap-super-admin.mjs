#!/usr/bin/env node

/**
 * Bootstrap Super Admin Script
 * Usage:
 *   npm run bootstrap:super-admin -- admin@example.com
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";

const emailArg = process.argv[2];

if (!emailArg) {
  console.error(
    "❌ Email wajib diisi.\nContoh: npm run bootstrap:super-admin -- admin@example.com",
  );
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Environment variable belum lengkap.");
  console.error(
    "Pastikan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY tersedia.",
  );
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  console.log(`🔍 Mencari user dengan email: ${emailArg}`);

  const { data: usersData, error: listError } =
    await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

  if (listError) {
    console.error("❌ Gagal mengambil daftar user:", listError.message);
    process.exit(1);
  }

  const user = usersData.users.find(
    (u) => (u.email || "").toLowerCase() === emailArg.toLowerCase(),
  );

  if (!user) {
    console.error(
      "❌ User tidak ditemukan. Daftarkan akun dulu melalui halaman register.",
    );
    process.exit(1);
  }

  const patch = {
    role: "super_admin",
    full_name: user.user_metadata?.full_name || user.email || "Super Admin",
  };

  const { error: upsertError } = await admin.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      ...patch,
    },
    { onConflict: "id" },
  );

  if (upsertError) {
    console.error("❌ Gagal upsert profile:", upsertError.message);
    process.exit(1);
  }

  console.log("✅ Berhasil set role super_admin untuk:", emailArg);
  console.log(
    'ℹ️ Catatan: aplikasi saat ini mengecek akses admin via role "admin".',
  );
  console.log(
    'ℹ️ Pastikan auth guard menerima "super_admin" (akan disesuaikan di kode).',
  );
}

run().catch((err) => {
  console.error("❌ Error tidak terduga:", err);
  process.exit(1);
});
