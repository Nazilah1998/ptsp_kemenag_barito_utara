'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ResetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') || '');

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage('Password berhasil diperbarui.');
    router.push('/login');
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field label="Password Baru" required>
        <Input type="password" name="password" minLength={6} required />
      </Field>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      <Button className="w-full" disabled={loading}>
        {loading ? 'Menyimpan...' : 'Simpan Password'}
      </Button>
    </form>
  );
}
