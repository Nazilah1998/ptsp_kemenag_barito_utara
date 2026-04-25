'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';

export function GeneratePdfButton({ requestId, hasFile }: { requestId: string; hasFile?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const generatePdf = async () => {
    setLoading(true);
    const toastId = toast.loading('Memproses dokumen PDF...');

    try {
      const response = await fetch(`/api/admin/requests/${requestId}/generate-pdf`, {
        method: 'POST'
      });

      const result = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        toast.error('Gagal membuat PDF', { id: toastId, description: result.error || 'Terjadi kesalahan sistem' });
        return;
      }

      toast.success('PDF Berhasil Dibuat!', { id: toastId, description: 'Dokumen hasil layanan telah diperbarui.' });
      router.refresh();
    } catch (error) {
      toast.error('Terjadi kesalahan', { id: toastId, description: 'Tidak dapat menghubungi server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={generatePdf}
      disabled={loading}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-70 disabled:pointer-events-none ${
        hasFile 
          ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 hover:border-amber-300'
          : 'bg-gradient-to-r from-[#1f4bb7] to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-md hover:shadow-blue-500/25'
      }`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : hasFile ? (
        <RefreshCwIcon className="h-4 w-4" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
      {loading ? 'Memproses...' : hasFile ? 'Generate Ulang' : 'Generate PDF'}
    </button>
  );
}

// Simple internal icon for RefreshCw since it's only used here or we can import it
function RefreshCwIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
