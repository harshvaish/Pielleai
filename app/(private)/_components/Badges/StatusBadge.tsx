'use client';

type StatusBadgeVariant = 'active' | 'disabled' | 'new';

const STATUS_STYLES: Record<
  StatusBadgeVariant,
  { label: string; dotColor: string; bgColor: string; textColor: string }
> = {
  active: {
    label: 'Attivo',
    dotColor: 'bg-green-500',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  disabled: {
    label: 'Disattivato',
    dotColor: 'bg-zinc-400',
    bgColor: 'bg-zinc-100',
    textColor: 'text-zinc-600',
  },
  new: {
    label: 'New',
    dotColor: 'bg-teal-400',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-700',
  },
};

export default function StatusBadge({
  status,
}: {
  status: StatusBadgeVariant;
}) {
  const { label, dotColor, bgColor, textColor } = STATUS_STYLES[status];

  return (
    <div
      className={`max-w-max flex items-center gap-1.5 text-xs font-semibold py-1 px-2 rounded-2xl ${bgColor} ${textColor}`}
    >
      <div className={`h-1.5 w-1.5 rounded-full ${dotColor}`}></div>
      {label}
    </div>
  );
}
