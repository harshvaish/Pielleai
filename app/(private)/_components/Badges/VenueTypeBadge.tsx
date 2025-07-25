import { Badge } from '@/components/ui/badge';
import { VenueType } from '@/lib/constants';
import { cn } from '@/lib/utils';

const styles: Record<
  VenueType,
  { label: string; text: string; bg: string; dot: string }
> = {
  small: {
    label: 'Club / DJ set',
    text: 'text-lime-600',
    bg: 'bg-lime-100',
    dot: 'bg-lime-200',
  },
  medium: {
    label: 'Media > 3.000',
    text: 'text-orange-600',
    bg: 'bg-orange-100',
    dot: 'bg-orange-200',
  },
  big: {
    label: 'Grande > 10.000',
    text: 'text-purple-600',
    bg: 'bg-purple-100',
    dot: 'bg-purple-200',
  },
};

export default function VenueTypeBadge({ type }: { type: VenueType }) {
  const style = styles[type];

  return <Badge className={cn(style.text, style.bg)}>{style.label}</Badge>;
}
