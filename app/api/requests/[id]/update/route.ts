import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  uploadToDrive,
  deleteFromDrive,
  getOrCreateFolder,
} from "@/lib/google-drive";
import { sanitizeFilename } from "@/lib/utils";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const profile = await requireAuth();
    const { id } = await params;
    const formData = await request.formData();

    const answersJson = formData.get("answers") as string;
    const updates = JSON.parse(answersJson);

    const admin = createAdminClient();

    // Verify ownership and status
    const { data: reqData } = await admin
      .from("service_requests")
      .select("id, status, user_id")
      .eq("id", id)
      .eq("user_id", profile.id)
      .single();

    if (!reqData) {
      return NextResponse.json(
        { error: "Pengajuan tidak ditemukan" },
        { status: 404 },
      );
    }

    if (
      !["submitted", "under_review", "revision_required"].includes(
        reqData.status,
      )
    ) {
      return NextResponse.json(
        { error: "Status pengajuan saat ini tidak dapat diubah." },
        { status: 400 },
      );
    }

    // 1. Update text answers
    for (const update of updates) {
      await admin
        .from("service_request_answers")
        .update({ field_value: update.field_value })
        .eq("id", update.id)
        .eq("request_id", id);
    }

    // 2. Prepare Google Drive Folder
    const mainRequirementsFolderId =
      await getOrCreateFolder("File Persyaratan");
    const userFolderName = `${profile.full_name || "User"} (${profile.email})`;
    const userFolderId = await getOrCreateFolder(
      userFolderName,
      mainRequirementsFolderId,
    );

    // 3. Update documents
    const entries = Array.from(formData.entries());
    const fileEntries = entries.filter(([key]) => key.startsWith("doc_"));

    for (const [key, value] of fileEntries) {
      if (value instanceof File && value.size > 0) {
        const docId = key.replace("doc_", "");
        console.log(`Processing file replacement for docId: ${docId}`);

        // 3a. Get old file info BEFORE updating
        const { data: oldDoc, error: fetchError } = await admin
          .from("service_request_documents")
          .select("file_path, file_name")
          .eq("id", docId)
          .single();

        if (fetchError || !oldDoc) {
          console.error(
            `Could not find old document info for ${docId}:`,
            fetchError,
          );
          continue;
        }

        const oldFilePath = oldDoc.file_path;
        const newFileName = sanitizeFilename(value.name);

        console.log(`Replacing "${oldDoc.file_name}" with "${newFileName}"`);

        // 3b. Upload NEW file to Google Drive
        try {
          const driveFile = await uploadToDrive(value, userFolderId);
          const newStoragePath = `gdrive:${driveFile.id}`;

          // 3c. Update DB with NEW file info
          const { error: updateError } = await admin
            .from("service_request_documents")
            .update({
              file_path: newStoragePath,
              file_name: newFileName, // Update with the new actual file name
              file_size: value.size,
              file_type: value.type,
              updated_at: new Date().toISOString(),
            })
            .eq("id", docId);

          if (updateError) throw updateError;

          // 3d. DELETE old file only after new one is successfully saved
          if (oldFilePath) {
            console.log(`Deleting old file from storage: ${oldFilePath}`);
            if (oldFilePath.startsWith("gdrive:")) {
              const oldDriveId = oldFilePath.replace("gdrive:", "");
              await deleteFromDrive(oldDriveId);
            } else {
              await admin.storage
                .from("request-documents")
                .remove([oldFilePath]);
            }
          }

          console.log(`Successfully replaced document ${docId}`);
        } catch (uploadOrDeleteError) {
          console.error(
            `Error during file replacement for ${docId}:`,
            uploadOrDeleteError,
          );
          // Continue to next file if one fails
        }
      }
    }

    // Add activity log
    await admin.from("activity_logs").insert({
      request_id: id,
      user_id: profile.id,
      action: "Pemohon memperbarui data dan dokumen",
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Update error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Error" },
      { status: 500 },
    );
  }
}
