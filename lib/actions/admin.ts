"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

const serviceSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

const itemSchema = z.object({
  service_id: z.coerce.number().int().positive(),
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

const fieldSchema = z.object({
  service_item_id: z.coerce.number().int().positive(),
  label: z.string().min(2),
  name: z.string().min(2),
  type: z.string().min(2),
  placeholder: z.string().optional(),
  is_required: z.boolean().optional(),
  options: z.string().optional(),
  sort_order: z.coerce.number().int().min(0),
});

const requirementSchema = z.object({
  service_item_id: z.coerce.number().int().positive(),
  document_name: z.string().min(2),
  description: z.string().optional(),
  is_required: z.boolean().optional(),
  allowed_extensions: z.string().optional(),
  max_file_size_mb: z.coerce.number().min(1).max(20),
});

export async function createServiceAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();

  const payload = serviceSchema.parse({
    name: formData.get("name"),
    slug: slugify(String(formData.get("slug") || formData.get("name") || "")),
    description: formData.get("description") || "",
    is_active: formData.get("is_active") === "on",
  });

  await admin.from("services").insert(payload);
  revalidatePath("/admin/layanan");
}

export async function updateServiceAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = Number(formData.get("id"));

  const payload = serviceSchema.parse({
    name: formData.get("name"),
    slug: slugify(String(formData.get("slug") || formData.get("name") || "")),
    description: formData.get("description") || "",
    is_active: formData.get("is_active") === "on",
  });

  await admin.from("services").update(payload).eq("id", id);
  revalidatePath("/admin/layanan");
  revalidatePath(`/admin/layanan/${id}/edit`);
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = Number(formData.get("id"));
  await admin.from("services").delete().eq("id", id);
  revalidatePath("/admin/layanan");
}

export async function createServiceItemAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();

  const payload = itemSchema.parse({
    service_id: formData.get("service_id"),
    name: formData.get("name"),
    slug: slugify(String(formData.get("slug") || formData.get("name") || "")),
    description: formData.get("description") || "",
    is_active: formData.get("is_active") === "on",
  });

  await admin.from("service_items").insert(payload);
  revalidatePath("/admin/item-layanan");
}

export async function updateServiceItemAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = Number(formData.get("id"));

  const payload = itemSchema.parse({
    service_id: formData.get("service_id"),
    name: formData.get("name"),
    slug: slugify(String(formData.get("slug") || formData.get("name") || "")),
    description: formData.get("description") || "",
    is_active: formData.get("is_active") === "on",
  });

  await admin.from("service_items").update(payload).eq("id", id);
  revalidatePath("/admin/item-layanan");
}

export async function deleteServiceItemAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = Number(formData.get("id"));
  await admin.from("service_items").delete().eq("id", id);
  revalidatePath("/admin/item-layanan");
}

export async function createFieldAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();

  const payload = fieldSchema.parse({
    service_item_id: formData.get("service_item_id"),
    label: formData.get("label"),
    name: formData.get("name"),
    type: formData.get("type"),
    placeholder: formData.get("placeholder") || "",
    is_required: formData.get("is_required") === "on",
    options: formData.get("options") || "",
    sort_order: formData.get("sort_order") || 0,
  });

  await admin.from("service_form_fields").insert(payload);
  revalidatePath("/admin/form-layanan");
}

export async function updateFieldAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = Number(formData.get("id"));

  const payload = fieldSchema.parse({
    service_item_id: formData.get("service_item_id"),
    label: formData.get("label"),
    name: formData.get("name"),
    type: formData.get("type"),
    placeholder: formData.get("placeholder") || "",
    is_required: formData.get("is_required") === "on",
    options: formData.get("options") || "",
    sort_order: formData.get("sort_order") || 0,
  });

  await admin.from("service_form_fields").update(payload).eq("id", id);
  revalidatePath("/admin/form-layanan");
}

export async function deleteFieldAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = Number(formData.get("id"));
  await admin.from("service_form_fields").delete().eq("id", id);
  revalidatePath("/admin/form-layanan");
}

export async function createRequirementAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();

  const payload = requirementSchema.parse({
    service_item_id: formData.get("service_item_id"),
    document_name: formData.get("document_name"),
    description: formData.get("description") || "",
    is_required: formData.get("is_required") === "on",
    allowed_extensions:
      formData.get("allowed_extensions") || "pdf,jpg,jpeg,png",
    max_file_size_mb: formData.get("max_file_size_mb") || 5,
  });

  await admin.from("service_requirements").insert(payload);
  revalidatePath("/admin/persyaratan");
}

export async function updateRequirementAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = Number(formData.get("id"));

  const payload = requirementSchema.parse({
    service_item_id: formData.get("service_item_id"),
    document_name: formData.get("document_name"),
    description: formData.get("description") || "",
    is_required: formData.get("is_required") === "on",
    allowed_extensions:
      formData.get("allowed_extensions") || "pdf,jpg,jpeg,png",
    max_file_size_mb: formData.get("max_file_size_mb") || 5,
  });

  await admin.from("service_requirements").update(payload).eq("id", id);
  revalidatePath("/admin/persyaratan");
}

export async function deleteRequirementAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = Number(formData.get("id"));
  await admin.from("service_requirements").delete().eq("id", id);
  revalidatePath("/admin/persyaratan");
}

export async function updateUserRoleAction(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const id = String(formData.get("id"));
  const role = String(formData.get("role"));
  await admin.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin/pengguna");
}

export async function updateRequestStatusAction(formData: FormData) {
  const adminProfile = await requireAdmin();
  const admin = createAdminClient();

  const requestId = String(formData.get("request_id"));
  const newStatus = String(formData.get("status"));
  const notes = String(formData.get("notes") || "");

  const patch: Record<string, string | null> = { status: newStatus };

  if (newStatus === "revision_required") {
    patch.revision_note = notes || null;
  } else {
    patch.revision_note = null;
  }

  if (newStatus === "rejected") {
    patch.rejection_reason = notes || null;
    patch.rejected_at = new Date().toISOString();
  } else {
    patch.rejection_reason = null;
  }

  if (newStatus === "approved") {
    patch.approved_at = new Date().toISOString();
  }

  if (newStatus === "completed") {
    patch.completed_at = new Date().toISOString();
  }

  await admin.from("service_requests").update(patch).eq("id", requestId);

  const actionMap: Record<string, string> = {
    under_review: "status:under_review",
    revision_required: "status:revision_required",
    rejected: "status:rejected",
    approved: "status:approved",
    completed: "status:completed",
  };

  await admin.from("activity_logs").insert({
    request_id: requestId,
    action: actionMap[newStatus],
    notes: notes || null,
    user_id: adminProfile.id,
  });

  revalidatePath(`/admin/pengajuan/${requestId}`);
  revalidatePath("/admin/pengajuan");
}

export async function uploadResultDocumentAction(formData: FormData) {
  const adminProfile = await requireAdmin();
  const admin = createAdminClient();

  const requestId = String(formData.get("request_id"));
  const file = formData.get("file") as File | null;

  if (!requestId || !file || file.size === 0) {
    throw new Error("File tidak valid atau kosong");
  }

  const { data: request } = await admin
    .from("service_requests")
    .select("id, user_id, request_number, status, completed_at")
    .eq("id", requestId)
    .single();

  if (!request) {
    throw new Error("Pengajuan tidak ditemukan");
  }

  const fileExt = file.name.split(".").pop() || "pdf";
  const fileName = `${request.request_number}_MANUAL.${fileExt}`;
  const filePath = `${request.user_id}/${request.id}/${fileName}`;

  const fileBuffer = await file.arrayBuffer();

  const { error: uploadError } = await admin.storage
    .from("generated-documents")
    .upload(filePath, fileBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Gagal mengunggah file: ${uploadError.message}`);
  }

  await admin.from("generated_documents").upsert(
    {
      request_id: request.id,
      file_name: fileName,
      file_path: filePath,
      generated_by: adminProfile.id,
      generated_at: new Date().toISOString(),
    },
    { onConflict: "request_id" },
  );

  const nextStatus = ["approved", "completed"].includes(request.status)
    ? "completed"
    : request.status;

  if (request.status !== nextStatus) {
    await admin
      .from("service_requests")
      .update({
        status: nextStatus,
        completed_at:
          nextStatus === "completed"
            ? new Date().toISOString()
            : request.completed_at,
      })
      .eq("id", request.id);
  }

  await admin.from("activity_logs").insert({
    request_id: request.id,
    action: "manual_document_uploaded",
    notes: "Dokumen hasil diunggah secara manual oleh admin.",
    user_id: adminProfile.id,
  });

  revalidatePath(`/admin/pengajuan/${requestId}`);
  revalidatePath(`/admin/dokumen-hasil`);
  revalidatePath(`/dashboard/pengajuan/${requestId}`);
}

export async function reorderServicesAction(orderedIds: number[]) {
  await requireAdmin();
  const admin = createAdminClient();

  // We simulate ordering by updating created_at sequentially.
  // The earlier the item, the older the timestamp.
  const baseTime = Date.now();

  const updates = orderedIds.map((id, index) => {
    // Add 1000ms per index to ensure they are sorted properly.
    const newDate = new Date(baseTime + index * 1000).toISOString();
    return admin.from("services").update({ created_at: newDate }).eq("id", id);
  });

  await Promise.all(updates);
  revalidatePath("/admin/layanan");
}
