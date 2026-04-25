/**
 * Email yang ditetapkan sebagai Super Admin.
 * Super Admin adalah satu-satunya pengguna dengan hak akses tertinggi.
 * Tidak dapat diubah melalui UI.
 */
export const SUPER_ADMIN_EMAIL = 'nazilahmuhammad1998@gmail.com';

/**
 * Semua role yang termasuk petugas/admin (bisa akses admin panel).
 * Sesuai enum app_role di database Supabase.
 */
export const ADMIN_ROLES = ['admin_ptsp', 'kepala_kantor', 'kasubag_tu', 'super_admin'] as const;

/**
 * Cek apakah sebuah email adalah Super Admin.
 */
export function isSuperAdmin(email?: string | null): boolean {
  return email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

/**
 * Cek apakah role termasuk petugas/admin (bisa akses admin panel).
 */
export function isAdminRole(role?: string | null): boolean {
  return ADMIN_ROLES.includes(role as any);
}
