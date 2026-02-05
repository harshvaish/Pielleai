import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type HostedEventBadgeProps = {
  size?: 'md' | 'sm' | 'xs';
  className?: string;
};

const sizes: Record<NonNullable<HostedEventBadgeProps['size']>, string> = {
  md: '',
  sm: 'text-[11px] px-2.5 py-1 rounded-lg',
  xs: 'text-[11px] px-2 py-0.5 rounded-md',
};

export function HostedEventBadge({ size = 'md', className }: HostedEventBadgeProps) {
  return (
    <Badge
      variant="orange"
      title="Evento ospitato"
      className={cn(sizes[size], className)}
    >
      Hosted Event
    </Badge>
  );
}
