import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'danger' | 'outline';
};

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'default' && 'bg-green-700 text-white hover:bg-green-800',
        variant === 'secondary' && 'bg-slate-800 text-white hover:bg-slate-900',
        variant === 'danger' && 'bg-red-700 text-white hover:bg-red-800',
        variant === 'outline' && 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50',
        className
      )}
      {...props}
    />
  );
}
