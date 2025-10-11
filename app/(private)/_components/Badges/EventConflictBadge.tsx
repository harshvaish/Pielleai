import { cn } from '@/lib/utils';

type EventConflictBadgeProps = {
  size?: 'lg' | 'md' | 'sm';
};

const sizes: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-[10px] p-1 gap-1',
  md: 'text-xs px-1.5 py-1 gap-2',
  lg: 'text-sm px-3 py-1.5 gap-2.5',
};

export default function EventConflictBadge({ size = 'md' }: EventConflictBadgeProps) {
  return (
    <div
      className={cn(
        'max-w-min inline-flex flex-nowrap items-center font-medium rounded-md',
        'bg-rose-50 text-rose-600',
        sizes[size],
      )}
    >
      <span className='truncate font-medium'>Conflitto!</span>
    </div>
  );
}
