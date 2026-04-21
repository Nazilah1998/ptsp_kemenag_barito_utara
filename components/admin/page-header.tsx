import type { ReactNode } from 'react';

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-gradient-to-r from-[#0f2563] to-[#1f4bb7] px-5 py-4 shadow-md shadow-blue-900/20">
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 border border-white/20 text-white shadow-md shadow-blue-500/20">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight sm:text-xl leading-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-sm text-blue-100/80 leading-relaxed max-w-lg">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
