import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card title="Login" description="Masuk ke portal PTSP">
        <LoginForm />
        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-green-700">
            Lupa password
          </Link>
          <Link href="/register" className="text-green-700">
            Belum punya akun?
          </Link>
        </div>
      </Card>
    </div>
  );
}
