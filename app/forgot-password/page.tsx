import { Card } from '@/components/ui/card';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card title="Reset Password" description="Masukkan email Anda untuk menerima link reset">
        <ForgotPasswordForm />
      </Card>
    </div>
  );
}
