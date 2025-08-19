import ArtistsBadge from '@/app/(private)/_components/Badges/ArtistsBadge';
import ManagersBadge from '@/app/(private)/_components/Badges/ManagersBadge';
import VenuesBadge from '@/app/(private)/_components/Badges/VenuesBadge';
import EventStatusBadge from '@/app/(private)/eventi/_components/EventStatusBadge';
import { CalendarEvent } from '@/lib/types';
import { format } from 'date-fns';
import { CalendarDays, Clock } from 'lucide-react';

type EventContentProps = {
  event: CalendarEvent;
};

export default function EventContent({ event }: EventContentProps) {
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
          <span className='w-16 text-xs text-zinc-700 font-medium'>Locale</span>
          <VenuesBadge venues={[event.venue]} />
        </div>

        <div className='flex items-center gap-2'>
          <span className='w-16 text-xs text-zinc-700 font-medium'>Artista</span>
          <ArtistsBadge artists={[event.artist]} />
        </div>

        {event?.artistManager && (
          <div className='flex items-center gap-2'>
            <span className='w-16 text-xs text-zinc-700 font-medium'>Manager</span>
            <ManagersBadge
              managers={[event.artistManager]}
              pathSegment='manager-artisti'
            />
          </div>
        )}
      </div>
    </div>
  );
}
