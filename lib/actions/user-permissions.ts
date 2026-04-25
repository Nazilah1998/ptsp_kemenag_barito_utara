'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateUserPermissionsAction(userId: string, permissions: string[]) {
  // Only super_admin can do this
  const profile = await requireAdmin();
  if (profile.role !== 'super_admin') {
    return { error: 'Hanya Super Admin yang dapat mengubah hak akses.' };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('profiles')
    .update({ permissions })
    .eq('id', userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/pengguna');
  
  return { success: true };
}
