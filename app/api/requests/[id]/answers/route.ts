import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const profile = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { updates } = body;

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Verify ownership and status
    const { data: reqData } = await admin
      .from("service_requests")
      .select("id, status")
      .eq("id", id)
      .eq("user_id", profile.id)
      .single();

    if (!reqData) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
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

    // Update each answer
    // To do this reliably, we update them one by one or in a loop
    for (const update of updates) {
      await admin
        .from("service_request_answers")
        .update({ field_value: update.field_value })
        .eq("id", update.id)
        .eq("request_id", id);
    }

    // Add activity log
    await admin.from("activity_logs").insert({
      request_id: id,
      user_id: profile.id,
      action: "Pemohon memperbarui data formulir",
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Error" },
      { status: 500 },
    );
  }
}
