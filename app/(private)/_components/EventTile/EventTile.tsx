'use client';

import { ArtistSelectData, Event, MoCoordinator, UserRole, VenueSelectData } from '@/lib/types';
import EventStatusBadge from '../badges/EventStatusBadge';
import { it } from 'date-fns/locale';
import { format } from 'date-fns';
import ArtistsBadge from '../badges/ArtistsBadge';
import Image from 'next/image';
import VenuesBadge from '../badges/VenuesBadge';
import ManagersBadge from '../badges/ManagersBadge';
import UpdateEventStatusButton from './UpdateEventStatusButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DeleteEventButton from './DeleteEventButton';
import UpdateButton from '../../eventi/_components/update/UpdateButton';
import { CalendarDays, Check, ChevronDown, Clock, Ellipsis, X } from 'lucide-react';
import { cn, hasRole } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

type EventTileProps = {
  userRole: UserRole;
  event: Event;
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
};

export default function EventTile({
  userRole,
  event,
  artists,
  venues,
  moCoordinators,
}: EventTileProps) {
  const isAdmin = userRole === 'admin';
  const eventDate = format(event.availability.startDate, 'dd MMM yyyy', { locale: it });
  const eventStartTime = format(event.availability.startDate, 'HH:mm', { locale: it });
  const eventEndTime = format(event.availability.endDate, 'HH:mm', { locale: it });

  const activityCount = Object.values({
    contractSigning: event.contractSigning,
    depositInvoiceIssuing: event.depositInvoiceIssuing,
    depositReceiptVerification: event.depositReceiptVerification,
    techSheetSubmission: event.techSheetSubmission,
    artistEngagement: event.artistEngagement,
    professionalsEngagement: event.professionalsEngagement,
    accompanyingPersonsEngagement: event.accompanyingPersonsEngagement,
    performance: event.performance,
    postDateFeedback: event.postDateFeedback,
    bordereau: event.bordereau,
  }).filter(Boolean).length;

  return (
    <>
      {/* MOBILE */}
      <div className='xl:hidden space-y-2 rounded-2xl p-2 md:p-4'>
        <div className='flex justify-between items-center gap-4'>
          <EventStatusBadge status={event.status} />

          {isAdmin && (
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
          )}
        </div>

        <div className='flex flex-col sm:flex-row justify-between sm:items-end gap-4'>
          <div className='flex justify-between items-center gap-4'>
            <ArtistsBadge artists={[event.artist]} />
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 flex justify-center items-center bg-zinc-400 rounded-xs'>
                <Check className='size-2 text-white' />
              </div>
              <span className='text-xs text-zinc-400 font-normal'>{activityCount}/10</span>
            </div>
          </div>

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
            <span className='text-xs text-zinc-600'>Location</span>
          </div>
          <VenuesBadge venues={[event.venue]} />
        </div>

        {event.artistManager && (
          <div className='flex justify-between items-center gap-4'>
            <div className='flex items-center gap-1'>
              <Image
                className='w-4 h-4'
                src='/images/navbar-icons/artist-managers.svg'
                alt='icona valigetta'
                width={16}
                height={16}
                loading='lazy'
              />
              <span className='text-xs text-zinc-600'>Manager</span>
            </div>

            <ManagersBadge
              userRole={userRole}
              managers={[event.artistManager]}
              pathSegment='manager-artisti'
            />
          </div>
        )}

        <div className='flex justify-between items-center gap-4'>
          <div className='flex items-center gap-1'>
            <Image
              className='w-4 h-4'
              src='/images/navbar-icons/artist-managers.svg'
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
                src='/images/navbar-icons/venue-managers.svg'
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

        <div className={cn('grid gap-2', userRole === 'venue-manager' ? '' : 'grid-cols-2')}>
          {isAdmin && event.status === 'proposed' && (
            <UpdateEventStatusButton
              event={event}
              newStatus='pre-confirmed'
              buttonLabel='Accetta'
              buttonVariant='success'
              dialogTitle='Vuoi accettare questa richiesta?'
              dialogDescription="Accettando, l'evento sarà inoltrato al manager dell'artista per la conferma finale. Confermi di voler procedere?"
              icon={<Check className='size-4' />}
            />
          )}

          {userRole === 'artist-manager' && event.status === 'pre-confirmed' && (
            <UpdateEventStatusButton
              event={event}
              newStatus='confirmed'
              buttonLabel='Accetta'
              buttonVariant='success'
              dialogTitle='Vuoi accettare questa richiesta?'
              dialogDescription='Confermi di voler procedere?'
              icon={<Check className='size-4' />}
            />
          )}

          {hasRole({ role: userRole }, ['admin', 'artist-manager']) &&
            (event.status === 'proposed' || event.status === 'pre-confirmed') && (
              <UpdateEventStatusButton
                event={event}
                newStatus='rejected'
                buttonLabel='Rifiuta'
                buttonVariant='destructive'
                dialogTitle='Vuoi rifiutare questa richiesta?'
                dialogDescription="Sei sicuro di voler rifiutare questa richiesta? L'organizzatore dell'evento riceverà una notifica."
                icon={<X className='size-4' />}
              />
            )}

          {userRole === 'venue-manager' &&
            ['proposed', 'pre-confirmed', 'confirmed'].includes(event.status) && (
              <DeleteEventButton event={event} />
            )}
        </div>
      </div>

      {/* DESKTOP */}
      <div className='max-h-max hidden xl:flex justify-between items-center gap-4 hover:bg-zinc-50 rounded-2xl p-6'>
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
            <div className='flex justify-start items-center gap-4'>
              <ArtistsBadge artists={[event.artist]} />
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 flex justify-center items-center bg-zinc-400 rounded-xs'>
                  <Check className='size-2 text-white' />
                </div>
                <span className='text-xs text-zinc-400 font-normal'>
                  Attività completate: {activityCount}/10
                </span>
              </div>
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
                  <span className='text-xs text-zinc-600'>Location</span>
                </div>
                <VenuesBadge venues={[event.venue]} />
              </div>

              {event.artistManager && (
                <div className='flex items-center gap-4'>
                  <div className='flex items-center gap-1'>
                    <Image
                      className='w-4 h-4'
                      src='/images/navbar-icons/artist-managers.svg'
                      alt='icona valigetta'
                      width={16}
                      height={16}
                      loading='lazy'
                    />
                    <span className='text-xs text-zinc-600'>Manager</span>
                  </div>

                  <ManagersBadge
                    userRole={userRole}
                    managers={[event.artistManager]}
                    pathSegment='manager-artisti'
                  />
                </div>
              )}

              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-1'>
                  <Image
                    className='w-4 h-4'
                    src='/images/navbar-icons/artist-managers.svg'
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
                      src='/images/navbar-icons/venue-managers.svg'
                      alt='icona con tre pallini'
                      width={16}
                      height={16}
                      loading='lazy'
                    />
                    <span className='text-xs text-zinc-600'>Amministrazione</span>
                  </div>
                  <span className='text-xs text-zinc-500 font-semibold'>
                    {event.administrationEmail}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {isAdmin && event.status === 'proposed' && (
            <UpdateEventStatusButton
              event={event}
              newStatus='pre-confirmed'
              buttonLabel='Accetta'
              buttonVariant='success'
              dialogTitle='Vuoi accettare questa richiesta?'
              dialogDescription="Accettando, l'evento sarà inoltrato al manager dell'artista per la conferma finale. Confermi di voler procedere?"
              icon={<Check className='size-4' />}
            />
          )}

          {userRole === 'artist-manager' && event.status === 'pre-confirmed' && (
            <UpdateEventStatusButton
              event={event}
              newStatus='confirmed'
              buttonLabel='Accetta'
              buttonVariant='success'
              dialogTitle='Vuoi accettare questa richiesta?'
              dialogDescription='Confermi di voler procedere?'
              icon={<Check className='size-4' />}
            />
          )}

          {userRole === 'admin' && event.status === 'proposed' && (
            <UpdateEventStatusButton
              event={event}
              newStatus='rejected'
              buttonLabel='Rifiuta'
              buttonVariant='destructive'
              dialogTitle='Vuoi rifiutare questa richiesta?'
              dialogDescription="Sei sicuro di voler rifiutare questa richiesta? L'organizzatore dell'evento riceverà una notifica."
              icon={<X className='size-4' />}
            />
          )}

          {userRole === 'artist-manager' &&
            (event.status === 'proposed' || event.status === 'pre-confirmed') && (
              <UpdateEventStatusButton
                event={event}
                newStatus='rejected'
                buttonLabel='Rifiuta'
                buttonVariant='destructive'
                dialogTitle='Vuoi rifiutare questa richiesta?'
                dialogDescription="Sei sicuro di voler rifiutare questa richiesta? L'organizzatore dell'evento riceverà una notifica."
                icon={<X className='size-4' />}
              />
            )}

          {userRole === 'venue-manager' &&
            ['proposed', 'pre-confirmed', 'conflict'].includes(event.status) && (
              <DeleteEventButton event={event} />
            )}

          {isAdmin && (
            <Popover>
              <PopoverTrigger
                className={cn(
                  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                  'bg-zinc-200 text-secondary-foreground hover:bg-zinc-200/80', // secondary variant
                  'h-10 min-w-20 rounded-xl gap-1.5 px-3 has-[>svg]:px-2.5', // sm size
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
          )}
        </div>
      </div>
    </>
  );
}
