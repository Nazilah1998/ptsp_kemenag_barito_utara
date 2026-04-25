'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getRolePermissions() {
  const admin = createAdminClient();
  const { data, error } = await admin.from('role_permissions').select('*');
  
  if (error) {
    console.error('Error fetching role permissions:', error.message);
    return [];
  }
  
  return data || [];
}

export async function updateRolePermissionsAction(role: string, permissions: string[]) {
  // Only super_admin can do this
  const profile = await requireAdmin();
  if (profile.role !== 'super_admin') {
    return { error: 'Hanya Super Admin yang dapat mengubah hak akses.' };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('role_permissions')
    .upsert({ role, permissions, updated_at: new Date().toISOString() });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/pengguna');
  
  return { success: true };
}
