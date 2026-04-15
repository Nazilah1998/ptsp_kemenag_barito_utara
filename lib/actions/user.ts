'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function updateProfileAction(formData: FormData) {
  const profile = await requireAuth();
  const admin = createAdminClient();

  await admin
    .from('profiles')
    .update({
      full_name: String(formData.get('full_name') || ''),
      phone: String(formData.get('phone') || ''),
      address: String(formData.get('address') || '')
    })
    .eq('id', profile.id);

  revalidatePath('/dashboard/profil');
  revalidatePath('/dashboard');
}
