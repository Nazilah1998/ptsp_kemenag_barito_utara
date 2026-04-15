import { cn, getStatusTone, REQUEST_STATUS_LABELS } from '@/lib/utils';

export function StatusBadge({ status }: { status: string }) {
  const tone = getStatusTone(status);

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
        tone === 'success' && 'bg-green-100 text-green-800',
        tone === 'danger' && 'bg-red-100 text-red-800',
        tone === 'warning' && 'bg-amber-100 text-amber-800',
        tone === 'info' && 'bg-blue-100 text-blue-800',
        tone === 'muted' && 'bg-slate-100 text-slate-700'
      )}
    >
      {REQUEST_STATUS_LABELS[status] ?? status}
    </span>
  );
}
