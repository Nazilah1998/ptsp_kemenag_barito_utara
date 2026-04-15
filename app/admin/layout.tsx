import type { ReactNode } from 'react';
import { requireAdmin } from '@/lib/auth';
import { DashboardSidebar } from '@/components/dashboard/sidebar';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
      <DashboardSidebar isAdmin />
      <div>{children}</div>
    </div>
  );
}
