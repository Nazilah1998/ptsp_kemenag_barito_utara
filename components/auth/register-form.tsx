'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function RegisterForm() {
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
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');
    const full_name = String(formData.get('full_name') || '');
    const phone = String(formData.get('phone') || '');
    const address = String(formData.get('address') || '');

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          phone,
          address
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage('Registrasi berhasil. Cek email Anda jika konfirmasi email diaktifkan.');
    router.push('/login');
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field label="Nama Lengkap" required>
        <Input name="full_name" required />
      </Field>
      <Field label="Email" required>
        <Input type="email" name="email" required />
      </Field>
      <Field label="Nomor Telepon">
        <Input name="phone" />
      </Field>
      <Field label="Alamat">
        <Textarea name="address" />
      </Field>
      <Field label="Password" required hint="Minimal 6 karakter">
        <Input type="password" name="password" minLength={6} required />
      </Field>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      <Button className="w-full" disabled={loading}>
        {loading ? 'Memproses...' : 'Buat Akun'}
      </Button>
    </form>
  );
}
