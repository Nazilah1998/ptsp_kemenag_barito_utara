import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return data;
}

export async function requireAuth() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }
  return profile;
}

export async function requireAdmin() {
  const profile = await requireAuth();
  if (profile.role !== "admin" && profile.role !== "super_admin") {
    redirect("/dashboard");
  }
  return profile;
}

export async function requireRequestOwnership(
  requestId: string,
  userId: string,
) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("service_requests")
    .select("id, user_id")
    .eq("id", requestId)
    .maybeSingle();

  return !!data && data.user_id === userId;
}
