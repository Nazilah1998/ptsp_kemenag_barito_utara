import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSuperAdmin } from "@/lib/constants";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const profile = await requireAdmin();
  
  // Fetch permissions for this user
  let allowedMenus: string[] = [];
  if (profile.role === 'super_admin' || isSuperAdmin(profile.email)) {
    allowedMenus = ["ringkasan", "pengajuan", "layanan", "item_layanan", "form_layanan", "persyaratan", "pengguna", "dokumen_hasil"];
  } else {
    // If permissions array is null/undefined in DB, use default
    allowedMenus = profile.permissions || ["ringkasan", "pengajuan", "dokumen_hasil"];
  }

  return <AdminShell profile={profile} allowedMenus={allowedMenus}>{children}</AdminShell>;
}
