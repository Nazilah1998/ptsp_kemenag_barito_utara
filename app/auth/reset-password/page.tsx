import { Card } from '@/components/ui/card';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card title="Password Baru" description="Masukkan password baru untuk akun Anda">
        <ResetPasswordForm />
      </Card>
    </div>
  );
}
