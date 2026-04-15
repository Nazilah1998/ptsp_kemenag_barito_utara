'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function UploadRevisionForm({
  requestId,
  requirement
}: {
  requestId: string;
  requirement: any;
}) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch(`/api/requests/${requestId}/documents`, {
      method: 'POST',
      body: formData
    });
    const result = await response.json().catch(() => ({}));

    setLoading(false);

    if (!response.ok) {
      setError(result.error || 'Upload gagal.');
      return;
    }

    setMessage('Dokumen revisi berhasil diupload.');
    router.refresh();
  };

  return (
    <form className="space-y-3 rounded-xl border border-slate-200 p-4" onSubmit={onSubmit}>
      <input type="hidden" name="requirement_id" value={requirement.id} />
      <Field
        label={requirement.document_name}
        required={requirement.is_required}
        hint={`Format: ${requirement.allowed_extensions || 'pdf,jpg,jpeg,png'} | Maks: ${requirement.max_file_size_mb} MB`}
      >
        <Input
          type="file"
          name="file"
          required
          accept={(requirement.allowed_extensions || 'pdf,jpg,jpeg,png')
            .split(',')
            .map((ext: string) => `.${ext.trim()}`)
            .join(',')}
        />
      </Field>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      <Button disabled={loading}>{loading ? 'Mengupload...' : 'Upload Revisi'}</Button>
    </form>
  );
}
