export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  try {
    // Basic security: check secret token from query param or header
    const { searchParams } = new URL(request.url);
    const secret =
      searchParams.get("secret") ||
      request.headers.get("Authorization")?.replace("Bearer ", "");

    // In production, you should use environment variable for this: process.env.CRON_SECRET
    // For now we'll allow a hardcoded fallback or checking process.env
    const validSecret = process.env.CRON_SECRET || "super-secret-cron-key-123";

    if (secret !== validSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    // 1. Find all completed requests older than 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data: expiredRequests, error: reqError } = await admin
      .from("service_requests")
      .select("id, request_number, completed_at")
      .eq("status", "completed")
      .lt("completed_at", threeDaysAgo.toISOString());

    if (reqError) throw reqError;
    if (!expiredRequests || expiredRequests.length === 0) {
      return NextResponse.json({
        message: "Tidak ada dokumen yang perlu dibersihkan hari ini.",
      });
    }

    const expiredRequestIds = expiredRequests.map((r) => r.id);
    let deletedFilesCount = 0;

    // 2. Clean up "Dokumen Hasil" (generated_documents)
    const { data: generatedDocs } = await admin
      .from("generated_documents")
      .select("*")
      .in("request_id", expiredRequestIds)
      .not("file_path", "eq", "EXPIRED");

    if (generatedDocs && generatedDocs.length > 0) {
      const pathsToDelete = generatedDocs.map((doc) => doc.file_path);

      // Delete physical files from Storage
      const { error: storageError } = await admin.storage
        .from("generated-documents")
        .remove(pathsToDelete);

      if (!storageError) {
        // Mark as expired in DB
        await admin
          .from("generated_documents")
          .update({ file_path: "EXPIRED" })
          .in(
            "id",
            generatedDocs.map((d) => d.id),
          );

        deletedFilesCount += pathsToDelete.length;
      }
    }

    // 3. Clean up "Dokumen Persyaratan" (service_request_documents)
    const { data: reqDocs } = await admin
      .from("service_request_documents")
      .select("*")
      .in("request_id", expiredRequestIds)
      .not("file_path", "eq", "EXPIRED");

    if (reqDocs && reqDocs.length > 0) {
      const pathsToDelete = reqDocs.map((doc) => doc.file_path);

      // Delete physical files from Storage
      const { error: storageError } = await admin.storage
        .from("request-documents")
        .remove(pathsToDelete);

      if (!storageError) {
        // Mark as expired in DB
        await admin
          .from("service_request_documents")
          .update({ file_path: "EXPIRED" })
          .in(
            "id",
            reqDocs.map((d) => d.id),
          );

        deletedFilesCount += pathsToDelete.length;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Pembersihan berhasil. ${deletedFilesCount} file fisik telah dihapus permanen.`,
      expired_requests_processed: expiredRequests.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
