import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-xl">
      <Card title="Registrasi" description="Buat akun pemohon baru">
        <RegisterForm />
        <p className="mt-4 text-sm text-slate-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-green-700">
            Login di sini
          </Link>
        </p>
      </Card>
    </div>
  );
}
