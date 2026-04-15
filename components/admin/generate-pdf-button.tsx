'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function GeneratePdfButton({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePdf = async () => {
    setLoading(true);
    setError('');

    const response = await fetch(`/api/admin/requests/${requestId}/generate-pdf`, {
      method: 'POST'
    });

    const result = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(result.error || 'Gagal membuat PDF.');
      return;
    }

    router.refresh();
  };

  return (
    <div className="space-y-2">
      <Button type="button" onClick={generatePdf} disabled={loading}>
        {loading ? 'Membuat PDF...' : 'Generate PDF Hasil'}
      </Button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
