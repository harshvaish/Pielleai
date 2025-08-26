import { Badge } from '@/components/ui/badge';
import { VENUE_TYPE_LABELS } from '@/lib/constants';
import { VenueType } from '@/lib/types';
import { cn } from '@/lib/utils';

const styles: Record<VenueType, { text: string; bg: string; dot: string }> = {
  small: {
    text: 'text-lime-600',
    bg: 'bg-lime-100',
    dot: 'bg-lime-200',
  },
  medium: {
    text: 'text-orange-600',
    bg: 'bg-orange-100',
    dot: 'bg-orange-200',
  },
  big: {
    text: 'text-purple-600',
    bg: 'bg-purple-100',
    dot: 'bg-purple-200',
  },
};

type VenueTypeBadgeProps = {
  type: VenueType;
  isDisabled?: boolean;
};

export default function VenueTypeBadge({ type, isDisabled }: VenueTypeBadgeProps) {
  const style = styles[type];

  return <Badge className={cn(isDisabled ? 'text-zinc-500' : style.text, isDisabled ? 'bg-zinc-50' : style.bg)}>{VENUE_TYPE_LABELS[type]}</Badge>;
}
