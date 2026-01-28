import { HostedEventBadge } from '../Badges/HostedEventBadge';
import { ArtistManagerSelectData, CalendarEvent, UserRole, VenueManagerSelectData } from '@/lib/types';
import { format } from 'date-fns';
import ManagersBadge from '../Badges/ManagersBadge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type EventContentProps = {
  userRole: UserRole;
  event: CalendarEvent;
};

export default function EventContent({ userRole, event }: EventContentProps) {
    const showHosted = event.hostedEvent;
  const isAdmin = userRole === 'admin';

  const startLabel = event ? `${format(event.start, 'dd/MM/yyyy')} - ${format(event.start, 'HH:mm')}` : '';
  const endLabel = event ? `${format(event.end, 'dd/MM/yyyy')} - ${format(event.end, 'HH:mm')}` : '';
  const artistManager =
    event.artistManager?.id && event.artistManager.profileId && event.artistManager.name && event.artistManager.surname
      ? [
          {
            id: event.artistManager.id,
            profileId: event.artistManager.profileId,
            status: event.artistManager.status,
            avatarUrl: event.artistManager.avatarUrl,
            name: event.artistManager.name,
            surname: event.artistManager.surname,
          } as ArtistManagerSelectData,
        ]
      : [];
  const venueManager =
    event.venueManager?.id && event.venueManager.profileId && event.venueManager.name && event.venueManager.surname
      ? [
          {
            id: event.venueManager.id,
            profileId: event.venueManager.profileId,
            status: event.venueManager.status,
            avatarUrl: event.venueManager.avatarUrl,
            name: event.venueManager.name,
            surname: event.venueManager.surname,
          } as VenueManagerSelectData,
        ]
      : [];

  return (
    <div className='space-y-4 p-2'>
      {showHosted && (
        <div className='mb-1'><HostedEventBadge /></div>
      )}
      <div className='space-y-2 text-sm text-zinc-800'>
        <div className='flex items-center gap-3'>
          <span className='w-12 text-xs font-semibold text-zinc-500'>Inizio</span>
          <span className='font-medium'>{startLabel}</span>
        </div>
        <div className='flex items-center gap-3'>
          <span className='w-12 text-xs font-semibold text-zinc-500'>Fine</span>
          <span className='font-medium'>{endLabel}</span>
        </div>
      </div>

      <div className='space-y-2'>
        {isAdmin && artistManager.length > 0 && (
          <div className='flex items-center gap-2'>
            <span className='w-28 text-xs text-zinc-700 font-medium'>Manager</span>
            <ManagersBadge
              managers={artistManager}
              pathSegment='manager-artisti'
              userRole={userRole}
            />
          </div>
        )}

        {venueManager.length > 0 && (
          <div className='flex items-center gap-2'>
            <span className='w-28 text-xs text-zinc-700 font-medium'>Promoter locale</span>
            <ManagersBadge
              managers={venueManager}
              pathSegment='promoter-locali'
              userRole={userRole}
            />
          </div>
        )}
      </div>

      <div className='flex flex-wrap gap-2'>
        <Button size='sm' variant='secondary' asChild>
          <Link href={`/eventi/${event.id}`}>Dettagli evento</Link>
        </Button>
        {isAdmin && (
          <Button size='sm' asChild>
            <Link href={`/eventi/${event.id}/modifica`}>Modifica evento</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
