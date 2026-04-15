'use client';

import { useState, type FormEvent } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ForgotPasswordForm() {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') || '');

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage('Link reset password sudah dikirim ke email Anda.');
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field label="Email" required>
        <Input type="email" name="email" required />
      </Field>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      <Button className="w-full" disabled={loading}>
        {loading ? 'Mengirim...' : 'Kirim Link Reset'}
      </Button>
    </form>
  );
}
