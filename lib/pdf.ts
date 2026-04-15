import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { formatDate, REQUEST_STATUS_LABELS } from '@/lib/utils';

type RequestPdfPayload = {
  requestNumber: string;
  serviceName: string;
  serviceItemName: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string | null;
  status: string;
  createdAt?: string | null;
  approvedAt?: string | null;
  notes?: string | null;
  answers: Array<{ field_name: string; field_value: string }>;
};

export async function buildRequestPdf(payload: RequestPdfPayload) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 790;
  const left = 50;

  const drawLine = (text: string, options?: { size?: number; bold?: boolean; indent?: number }) => {
    const size = options?.size ?? 11;
    page.drawText(text, {
      x: left + (options?.indent ?? 0),
      y,
      size,
      font: options?.bold ? bold : font,
      color: rgb(0.05, 0.12, 0.25)
    });
    y -= size + 8;
  };

  drawLine('HASIL LAYANAN PTSP KEMENAG BARITO UTARA', { size: 16, bold: true });
  drawLine('Dokumen hasil layanan otomatis', { size: 10 });
  y -= 8;

  drawLine(`Nomor Pengajuan: ${payload.requestNumber}`, { bold: true });
  drawLine(`Layanan: ${payload.serviceName}`);
  drawLine(`Item Layanan: ${payload.serviceItemName}`);
  drawLine(`Nama Pemohon: ${payload.applicantName}`);
  drawLine(`Email: ${payload.applicantEmail}`);
  drawLine(`Telepon: ${payload.applicantPhone || '-'}`);
  drawLine(`Status: ${REQUEST_STATUS_LABELS[payload.status] ?? payload.status}`);
  drawLine(`Tanggal Pengajuan: ${formatDate(payload.createdAt)}`);
  drawLine(`Tanggal Persetujuan: ${formatDate(payload.approvedAt)}`);
  y -= 10;

  drawLine('Data Form Pengajuan', { bold: true, size: 13 });
  payload.answers.forEach((answer) => {
    drawLine(`${answer.field_name}: ${answer.field_value || '-'}`, { indent: 8 });
  });

  y -= 10;
  drawLine('Catatan', { bold: true, size: 13 });
  drawLine(payload.notes || 'Pengajuan telah diproses oleh admin PTSP.', { indent: 8 });

  y -= 24;
  drawLine('Dokumen ini dibuat secara otomatis oleh sistem.', { size: 10 });

  return pdfDoc.save();
}
