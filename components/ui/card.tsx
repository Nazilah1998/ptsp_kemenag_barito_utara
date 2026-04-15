import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({
  title,
  description,
  className,
  children
}: {
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-white p-6 shadow-sm', className)}>
      {title ? <h3 className="text-lg font-semibold text-slate-900">{title}</h3> : null}
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      <div className={title || description ? 'mt-4' : ''}>{children}</div>
    </div>
  );
}
