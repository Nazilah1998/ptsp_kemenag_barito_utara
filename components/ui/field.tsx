import type { ReactNode } from 'react';

export function Field({
  label,
  required,
  hint,
  children
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-medium text-slate-800">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </span>
      {children}
      {hint ? <span className="block text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}
