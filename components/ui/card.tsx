import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({
  title,
  description,
  icon: Icon,
  className,
  children
}: {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md overflow-hidden',
        className
      )}
    >
      {(title || description) && (
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-6 py-4">
          <div className="flex items-start gap-3">
            {Icon && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1f4bb7]/10 to-[#1f4bb7]/5 text-[#1f4bb7]">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-base font-semibold text-slate-900 leading-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-0.5 text-sm text-slate-500 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
