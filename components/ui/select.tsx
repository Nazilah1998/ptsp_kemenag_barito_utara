import * as React from 'react';
import { cn } from '@/lib/utils';

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-green-700',
        props.className
      )}
    />
  );
}
