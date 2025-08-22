'use client';

import { ArtistSelectData, Event, MoCoordinator, VenueSelectData } from '@/lib/types';
import EventStatusBadge from '../../../_components/badges/EventStatusBadge';
import { it } from 'date-fns/locale';
import { format } from 'date-fns';
import ArtistsBadge from '../../../_components/badges/ArtistsBadge';
import Image from 'next/image';
import VenuesBadge from '../../../_components/badges/VenuesBadge';
import ManagersBadge from '../../../_components/badges/ManagersBadge';
import UpdateEventStatusButton from './UpdateEventStatusButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DeleteEventButton from './DeleteEventButton';
import UpdateButton from '../update/UpdateButton';
import { CalendarDays, Check, ChevronDown, Clock, Ellipsis, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

type EventTileProps = {
  event: Event;
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
};

export default function EventTile({ event, artists, venues, moCoordinators }: EventTileProps) {
  const isDesktop = useMediaQuery('(min-width: 1280px)');

  const eventDate = format(event.availability.startDate, 'dd MMM yyyy', { locale: it });
  const eventStartTime = format(event.availability.startDate, 'HH:mm', { locale: it });
  const eventEndTime = format(event.availability.endDate, 'HH:mm', { locale: it });

  if (isDesktop)
    return (
      <div
        key={event.id}
        className='max-h-max flex justify-between items-center gap-4 hover:bg-zinc-50 rounded-2xl p-6'
      >
        <div className='grid grid-cols-[max-content_1fr] gap-4'>
          {/* time info */}
          <div className='w-40 flex flex-col gap-1 justify-center pe-4 border-r'>
            <EventStatusBadge status={event.status} />
            <div className='text-lg font-semibold capitalize'>{eventDate}</div>
            <div className='text-zinc-500 font-medium'>
              {eventStartTime} - {eventEndTime}
            </div>
          </div>

          {/* general info */}
          <div className='space-y-4'>
            <div>
              <ArtistsBadge artists={[event.artist]} />
            </div>
            <div className='grid grid-cols-2 gap-4'>
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
                      src='/images/navbar-icons/manager-venues.svg'
                      alt='icona con tre pallini'
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
                newStatus='pre-confirmed'
                buttonLabel='Accetta'
                buttonVariant='success'
                dialogTitle='Vuoi accettare questa richiesta?'
                dialogDescription="Accettando, l'evento sarà inoltrato al manager dell'artista per la conferma finale. Confermi di voler procedere?"
                icon={<Check className='size-4' />}
              />
              <UpdateEventStatusButton
                event={event}
                newStatus='rejected'
                buttonLabel='Rifiuta'
                buttonVariant='destructive'
                dialogTitle='Vuoi rifiutare questa richiesta?'
                dialogDescription="Sei sicuro di voler rifiutare questa richiesta? L'organizzatore dell'evento riceverà una notifica."
                icon={<X className='size-4' />}
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
              <UpdateButton
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

  return (
    <div
      key={event.id}
      className='space-y-2 rounded-2xl p-2 md:p-4'
    >
      <div className='flex justify-between items-center gap-4'>
        <EventStatusBadge status={event.status} />

        <Popover>
          <PopoverTrigger className='h-10 w-10 flex justify-center items-center'>
            <Ellipsis className='size-4 text-zinc-700' />
          </PopoverTrigger>
          <PopoverContent
            align='end'
            className='w-48 space-y-2'
          >
            <UpdateButton
              event={event}
              artists={artists}
              venues={venues}
              moCoordinators={moCoordinators}
            />
            <DeleteEventButton event={event} />
          </PopoverContent>
        </Popover>
      </div>

      <div className='flex flex-col sm:flex-row justify-between sm:items-end gap-4'>
        <ArtistsBadge artists={[event.artist]} />

        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1 text-sm text-zinc-700'>
            <CalendarDays className='size-3 text-zinc-700' />
            <span>{eventDate}</span>
          </div>

          <div className='flex items-center gap-1 text-sm text-zinc-700'>
            <Clock className='size-3 text-zinc-700' />
            <span>
              {eventStartTime} - {eventEndTime}
            </span>
          </div>
        </div>
      </div>

      <Separator className='my-4' />

      <div className='flex justify-between items-center gap-4'>
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
        <div className='flex justify-between items-center gap-4'>
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

      <div className='flex justify-between items-center gap-4'>
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
        <div className='flex justify-between items-center gap-4'>
          <div className='flex items-center gap-1'>
            <Image
              className='w-4 h-4'
              src='/images/navbar-icons/manager-venues.svg'
              alt='icona con tre pallini'
              width={16}
              height={16}
              loading='lazy'
            />
            <span className='text-xs text-zinc-600'>Amministrazione</span>
          </div>
          <span className='text-xs text-zinc-500 font-semibold'>{event.administrationEmail}</span>
        </div>
      )}

      <Separator className='my-4' />

      <div className='grid grid-cols-2 gap-2'>
        {event.status === 'proposed' && (
          <>
            <UpdateEventStatusButton
              event={event}
              newStatus='pre-confirmed'
              buttonLabel='Accetta'
              buttonVariant='success'
              dialogTitle='Vuoi accettare questa richiesta?'
              dialogDescription="Accettando, l'evento sarà inoltrato al manager dell'artista per la conferma finale. Confermi di voler procedere?"
              icon={<Check className='size-4' />}
            />
            <UpdateEventStatusButton
              event={event}
              newStatus='rejected'
              buttonLabel='Rifiuta'
              buttonVariant='destructive'
              dialogTitle='Vuoi rifiutare questa richiesta?'
              dialogDescription="Sei sicuro di voler rifiutare questa richiesta? L'organizzatore dell'evento riceverà una notifica."
              icon={<X className='size-4' />}
            />
          </>
        )}
      </div>
    </div>
  );
}
