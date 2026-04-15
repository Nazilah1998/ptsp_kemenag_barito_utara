import { createAdminClient } from '@/lib/supabase/admin';

export async function getPublicServices() {
  const admin = createAdminClient();
  const { data } = await admin
    .from('services')
    .select('*, service_items(*)')
    .eq('is_active', true)
    .order('name');

  return data ?? [];
}

export async function getServiceBySlug(slug: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from('services')
    .select('*, service_items(*, service_form_fields(*), service_requirements(*))')
    .eq('slug', slug)
    .maybeSingle();

  return data;
}

export async function getServiceCatalog() {
  const admin = createAdminClient();
  const { data } = await admin
    .from('services')
    .select(`
      *,
      service_items (
        *,
        service_form_fields (*),
        service_requirements (*)
      )
    `)
    .eq('is_active', true)
    .order('name');

  return data ?? [];
}
