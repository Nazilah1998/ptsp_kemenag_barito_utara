import type { ReactNode } from 'react';
import { requireAuth } from '@/lib/auth';
import { DashboardSidebar } from '@/components/dashboard/sidebar';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireAuth();

  return (
    <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
      <DashboardSidebar />
      <div>{children}</div>
    </div>
  );
}
