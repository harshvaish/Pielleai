import { Badge } from '@/components/ui/badge';
import { VenueType } from '@/lib/constants';
import { cn } from '@/lib/utils';

const typesUI: Record<
  string,
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
  large: {
    label: 'Grande > 10.000',
    text: 'text-purple-600',
    bg: 'bg-purple-100',
    dot: 'bg-purple-200',
  },
  default: {
    label: 'Locale',
    text: 'text-zinc-600',
    bg: 'bg-zinc-100',
    dot: 'bg-zinc-200',
  },
};

export default function VenueTypeBadge({ type }: { type: VenueType }) {
  const typeUI = typesUI[type] || typesUI['default'];

  return <Badge className={cn(typeUI.text, typeUI.bg)}>{typeUI.label}</Badge>;
}
