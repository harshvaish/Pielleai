import { ArtistManagerSelectData, CalendarEvent, UserRole } from '@/lib/types';
import { format } from 'date-fns';
import { CalendarDays, Clock } from 'lucide-react';
import ArtistsBadge from '../Badges/ArtistsBadge';
import ManagersBadge from '../Badges/ManagersBadge';
import VenuesBadge from '../Badges/VenuesBadge';
import EventStatusBadge from '../Badges/EventStatusBadge';

type EventContentProps = {
  userRole: UserRole;
  event: CalendarEvent;
};

export default function EventContent({ userRole, event }: EventContentProps) {
  const isAdmin = userRole === 'admin';

  const selectedDate = event ? format(event.start, 'yyyy-MM-dd') : '';
  const selectedStartTime = event ? format(event.start, 'HH:mm') : '';
  const selectedEndTime = event ? format(event.end, 'HH:mm') : '';

  return (
    <div className='grid sm:grid-cols-2 gap-4 p-2'>
      <div className='space-y-2'>
        <EventStatusBadge status={event.status} />

        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1 text-zinc-700'>
            <CalendarDays className='size-4 stroke-1' />
            <span className='text-sm'>{selectedDate}</span>
          </div>

          <div className='flex items-center gap-1 text-zinc-700'>
            <Clock className='size-4 stroke-1' />
            <span className='text-sm'>
              {selectedStartTime} - {selectedEndTime}
            </span>
          </div>
        </div>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <span className='w-16 text-xs text-zinc-700 font-medium'>Location</span>
          <VenuesBadge venues={[event.venue]} />
        </div>

        <div className='flex items-center gap-2'>
          <span className='w-16 text-xs text-zinc-700 font-medium'>Artista</span>
          <ArtistsBadge
            artists={[event.artist]}
            userRole={userRole}
          />
        </div>

        {isAdmin && event.artistManager?.id && (
          <div className='flex items-center gap-2'>
            <span className='w-16 text-xs text-zinc-700 font-medium'>Manager</span>
            <ManagersBadge
              managers={[event.artistManager as ArtistManagerSelectData]}
              pathSegment='manager-artisti'
              userRole={userRole}
            />
          </div>
        )}
      </div>
    </div>
  );
}
