import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteFromDrive } from "@/lib/google-drive";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const profile = await requireAuth();
    const { id } = await params;
    const admin = createAdminClient();

    // Verify ownership and status
    const { data: reqData } = await admin
      .from("service_requests")
      .select("id, status")
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
        { error: "Pengajuan yang sudah diproses tidak dapat dihapus." },
        { status: 400 },
      );
    }

    // Get all document paths to delete from storage
    const { data: docs } = await admin
      .from("service_request_documents")
      .select("id, file_path, file_name")
      .eq("request_id", id);

    if (docs && docs.length > 0) {
      console.log(`Cleaning up ${docs.length} documents for request ${id}...`);

      const deletePromises = docs.map(async (doc) => {
        if (!doc.file_path) return;

        try {
          if (doc.file_path.startsWith("gdrive:")) {
            const driveFileId = doc.file_path.replace("gdrive:", "");
            await deleteFromDrive(driveFileId);
          } else {
            const { error: storageError } = await admin.storage
              .from("request-documents")
              .remove([doc.file_path]);
            if (storageError) throw storageError;
          }
          console.log(`Deleted document: ${doc.file_name} (${doc.id})`);
        } catch (error) {
          console.error(`Failed to delete document ${doc.id}:`, error);
          // We continue to delete other files even if one fails
        }
      });

      await Promise.all(deletePromises);
    }

    // 4. Delete from DB
    console.log(`Deleting request ${id} from database...`);
    const { error: deleteError } = await admin
      .from("service_requests")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Database deletion error:", deleteError);
      throw deleteError;
    }

    console.log(`Request ${id} deleted successfully.`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Error" },
      { status: 500 },
    );
  }
}
