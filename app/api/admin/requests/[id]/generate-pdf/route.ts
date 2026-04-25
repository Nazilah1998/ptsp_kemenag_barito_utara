export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { buildRequestPdf } from '@/lib/pdf';
import { isAdminRole } from '@/lib/constants';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin.from('profiles').select('*').eq('id', user.id).maybeSingle();

  if (!profile || !isAdminRole(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data: serviceRequest } = await admin
    .from('service_requests')
    .select(`
      *,
      profiles!service_requests_user_id_fkey (*),
      services (name),
      service_items (name),
      service_request_answers (*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (!serviceRequest) {
    return NextResponse.json({ error: 'Pengajuan tidak ditemukan.' }, { status: 404 });
  }

  const pdfBytes = await buildRequestPdf({
    requestNumber: serviceRequest.request_number,
    serviceName: serviceRequest.services?.name || '-',
    serviceItemName: serviceRequest.service_items?.name || '-',
    applicantName: serviceRequest.profiles?.full_name || serviceRequest.profiles?.email || '-',
    applicantEmail: serviceRequest.profiles?.email || '-',
    applicantPhone: serviceRequest.profiles?.phone || '-',
    status: serviceRequest.status,
    createdAt: serviceRequest.created_at,
    approvedAt: serviceRequest.approved_at,
    notes: serviceRequest.revision_note || serviceRequest.rejection_reason || '',
    answers: (serviceRequest.service_request_answers || []).map((answer: any) => ({
      field_name: answer.field_name,
      field_value: answer.field_value
    }))
  });

  const filePath = `${serviceRequest.user_id}/${serviceRequest.id}/${serviceRequest.request_number}.pdf`;

  const { error: uploadError } = await admin.storage
    .from('generated-documents')
    .upload(filePath, Buffer.from(pdfBytes), {
      contentType: 'application/pdf',
      upsert: true
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  await admin.from('generated_documents').upsert(
    {
      request_id: serviceRequest.id,
      file_name: `${serviceRequest.request_number}.pdf`,
      file_path: filePath,
      generated_by: user.id,
      generated_at: new Date().toISOString()
    },
    { onConflict: 'request_id' }
  );

  const nextStatus = ['approved', 'completed'].includes(serviceRequest.status)
    ? 'completed'
    : serviceRequest.status;

  await admin
    .from('service_requests')
    .update({
      status: nextStatus,
      completed_at: nextStatus === 'completed' ? new Date().toISOString() : serviceRequest.completed_at
    })
    .eq('id', serviceRequest.id);

  await admin.from('activity_logs').insert({
    request_id: serviceRequest.id,
    actor_id: user.id,
    action: 'pdf_generated',
    notes: 'Dokumen hasil PDF dibuat oleh admin.'
  });

  return NextResponse.json({ success: true });
}
