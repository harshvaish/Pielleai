import { ArtistSelectData, Event, MoCoordinator, VenueSelectData } from '@/lib/types';
import EventStatusBadge from '../EventStatusBadge';
import { it } from 'date-fns/locale';
import { format } from 'date-fns';
import ArtistsBadge from '../../../_components/Badges/ArtistsBadge';
import Image from 'next/image';
import VenuesBadge from '../../../_components/Badges/VenuesBadge';
import ManagersBadge from '../../../_components/Badges/ManagersBadge';
import UpdateEventStatusButton from './UpdateEventStatusButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DeleteEventButton from './DeleteEventButton';
import UpdateEventButton from '../update/UpdateEventButton';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type EventTileProps = {
  event: Event;
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
};

export default function EventTile({ event, artists, venues, moCoordinators }: EventTileProps) {
  return (
    <div
      key={event.id}
      className='max-h-max flex justify-between items-center gap-4 bg-white rounded-2xl p-6'
    >
      <div className='flex items-center gap-4'>
        {/* time info */}
        <div className='flex flex-col gap-1 justify-center pe-4 border-r'>
          <EventStatusBadge status={event.status} />
          <div className='text-lg font-semibold capitalize'>{format(event.availability.startDate, 'dd E yy', { locale: it })}</div>
          <div className='text-zinc-500 font-medium'>
            {format(event.availability.startDate, 'hh:mm')} - {format(event.availability.endDate, 'hh:mm')}
          </div>
        </div>

        {/* general info */}
        <div className='space-y-4'>
          <div>
            <ArtistsBadge artists={[event.artist]} />
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-1'>
                <Image
                  className='w-4 h-4'
                  src='/images/navbar-icons/venues.svg'
                  alt='icona geolocalizzazione'
                  width={16}
                  height={16}
                  loading='lazy'
                />
                <span className='text-xs text-zinc-600'>Locale</span>
              </div>
              <VenuesBadge venues={[event.venue]} />
            </div>

            {event.artistManager && (
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-1'>
                  <Image
                    className='w-4 h-4'
                    src='/images/navbar-icons/manager-artists.svg'
                    alt='icona valigetta'
                    width={16}
                    height={16}
                    loading='lazy'
                  />
                  <span className='text-xs text-zinc-600'>Manager</span>
                </div>

                <ManagersBadge
                  managers={[event.artistManager]}
                  pathSegment='manager-artisti'
                />
              </div>
            )}

            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-1'>
                <Image
                  className='w-4 h-4'
                  src='/images/navbar-icons/manager-artists.svg'
                  alt='icona valigetta'
                  width={16}
                  height={16}
                  loading='lazy'
                />
                <span className='text-xs text-zinc-600'>Tour manager</span>
              </div>
              <span className='text-xs text-zinc-500 font-semibold'>
                {event.tourManagerName} {event.tourManagerSurname}
              </span>
            </div>

            {event.administrationEmail && (
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-1'>
                  <Image
                    className='w-4 h-4'
                    src='/images/navbar-icons/manager-.svg'
                    alt='icona valigetta'
                    width={16}
                    height={16}
                    loading='lazy'
                  />
                  <span className='text-xs text-zinc-600'>Amministrazione</span>
                </div>
                <span className='text-xs text-zinc-500 font-semibold'>{event.administrationEmail}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        {event.status === 'proposed' && (
          <>
            <UpdateEventStatusButton
              event={event}
              newStatus='confirmed'
              buttonLabel='Accetta'
              buttonVariant='success'
              dialogTitle='Vuoi accettare questa richiesta?'
              dialogDescription="Accettando, l'evento sarà inoltrato al manager dell'artista per la conferma finale. Confermi di voler procedere?"
            />
            <UpdateEventStatusButton
              event={event}
              newStatus='rejected'
              buttonLabel='Rifiuta'
              buttonVariant='destructive'
              dialogTitle='Vuoi rifiutare questa richiesta?'
              dialogDescription="Sei sicuro di voler rifiutare questa richiesta? L'organizzatore dell'evento riceverà una notifica."
            />
          </>
        )}

        <Popover>
          <PopoverTrigger
            className={cn(
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              'bg-zinc-200 text-secondary-foreground hover:bg-zinc-200/80', // secondary variant
              'h-10 min-w-20 rounded-xl gap-1.5 px-3 has-[>svg]:px-2.5' // sm size
            )}
          >
            Modifica <ChevronDown />
          </PopoverTrigger>

          <PopoverContent
            align='end'
            className='max-w-max flex flex-col items-start gap-2'
          >
            <UpdateEventButton
              event={event}
              artists={artists}
              venues={venues}
              moCoordinators={moCoordinators}
            />
            <DeleteEventButton event={event} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
