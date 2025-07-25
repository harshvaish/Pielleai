import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/lib/types';

const ROLE_STYLES: Record<
  UserRole,
  {
    label: string;
    variant:
      | 'default'
      | 'secondary'
      | 'destructive'
      | 'outline'
      | 'disabled'
      | 'orange'
      | 'yellow'
      | 'emerald'
      | 'purple'
      | null
      | undefined;
  }
> = {
  'user': {
    label: 'Ospite',
    variant: 'disabled',
  },
  'artist-manager': {
    label: 'Manager artisti',
    variant: 'emerald',
  },
  'venue-manager': {
    label: 'Promoter locali',
    variant: 'yellow',
  },
  'admin': {
    label: 'Admin',
    variant: 'purple',
  },
};

export default function UserRoleBadge({
  role,
  isDisabled = false,
}: {
  role: UserRole;
  isDisabled?: boolean;
}) {
  const { label, variant } = ROLE_STYLES[role];

  return <Badge variant={isDisabled ? 'disabled' : variant}>{label}</Badge>;
}
