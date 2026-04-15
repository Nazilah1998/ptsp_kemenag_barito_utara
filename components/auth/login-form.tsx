'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field label="Email" required>
        <Input type="email" name="email" required />
      </Field>
      <Field label="Password" required>
        <Input type="password" name="password" required />
      </Field>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <Button className="w-full" disabled={loading}>
        {loading ? 'Memproses...' : 'Login'}
      </Button>
    </form>
  );
}
