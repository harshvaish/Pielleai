'use client';

import { ArtistSelectData, Event, UserRole, VenueSelectData } from '@/lib/types';
import { it } from 'date-fns/locale';
import { format } from 'date-fns';
import Image from 'next/image';
import UpdateEventStatusButton from './UpdateEventStatusButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DeleteEventButton from './DeleteEventButton';
import UpdateButton from '../../eventi/_components/update/UpdateButton';
import { CalendarDays, Check, ChevronDown, Ellipsis, Eye, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import EventStatusBadge from '../Badges/EventStatusBadge';
import ArtistsBadge from '../Badges/ArtistsBadge';
import VenuesBadge from '../Badges/VenuesBadge';
import ManagersBadge from '../Badges/ManagersBadge';
import EventConflictBadge from '../Badges/EventConflictBadge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type EventTileProps = {
  userRole: UserRole;
  event: Event;
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
};

export default function EventTile({
  userRole,
  event,
  artists,
  venues,
}: EventTileProps) {
  const isAdmin = userRole === 'admin';
  const isArtistManager = userRole === 'artist-manager';
  const isVenueManager = userRole === 'venue-manager';

  // Get dates (already Date objects from type definition)
  const startDate = new Date(event.availability.startDate);
  const endDate = new Date(event.availability.endDate);
  
  const isSameDay = format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd');
  
  const eventStartDate = format(startDate, 'dd MMM yyyy', { locale: it });
  const eventEndDate = format(endDate, 'dd MMM yyyy', { locale: it });
  const eventStartTime = format(startDate, 'HH:mm', { locale: it });
  const eventEndTime = format(endDate, 'HH:mm', { locale: it });
  
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
      <div className='xl:hidden space-y-2 rounded-2xl p-2 md:p-3'>
        <div className='flex justify-between items-start gap-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <ArtistsBadge
              artists={[event.artist]}
              userRole={userRole}
            />
            <span className='text-xs text-zinc-400'>x</span>
            <VenuesBadge
              userRole={userRole}
              venues={[event.venue]}
            />
            <span className='text-xs text-zinc-400'>—</span>
            <span className='text-[13px] font-semibold text-zinc-800'>
              {isSameDay ? eventStartDate : `${eventStartDate} - ${eventEndDate}`}
            </span>
            <EventStatusBadge status={event.status} size='xs' />
            {userRole === 'admin' && event.hasConflict && <EventConflictBadge />}
            {isAdmin && (
              <div className='flex items-center gap-1'>
                <div className='w-3 h-3 flex justify-center items-center bg-zinc-400 rounded-xs'>
                  <Check className='size-2 text-white' />
                </div>
                <span className='text-xs text-zinc-400 font-normal'>
                  Attività completate: {activityCount}/10
                </span>
              </div>
            )}
          </div>

          {isAdmin && (
            <Popover>
              <PopoverTrigger className='h-10 w-10 flex justify-center items-center'>
                <Ellipsis className='size-4 text-zinc-700' />
              </PopoverTrigger>
              <PopoverContent
                align='end'
                className='w-48 space-y-2'
              >
                <UpdateButton event={event} />
                <DeleteEventButton event={event} />
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-xs text-zinc-700'>
            <CalendarDays className='size-3 text-zinc-700' />
            <span>{eventStartDate}</span>
            <span className='text-zinc-400'>•</span>
            <span>{eventStartTime}</span>
          </div>
          <div className='flex items-center gap-2 text-xs text-zinc-700'>
            <CalendarDays className='size-3 text-zinc-700' />
            <span>{eventEndDate}</span>
            <span className='text-zinc-400'>•</span>
            <span>{eventEndTime}</span>
          </div>
        </div>

        <Separator className='my-3' />

        {isAdmin && event.artistManager && (
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
              <span className='text-xs text-zinc-600'>Artist Manager</span>
            </div>

            <ManagersBadge
              userRole={userRole}
              managers={[event.artistManager]}
              pathSegment='manager-artisti'
            />
          </div>
        )}

        {event.venue.manager && (
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
              <span className='text-xs text-zinc-600'>Venue Manager</span>
            </div>

            <ManagersBadge
              userRole={userRole}
              managers={[event.venue.manager]}
              pathSegment='promoter-locali'
            />
          </div>
        )}

        {isAdmin && event.tourManagerEmail && (
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
            <span className='text-xs text-zinc-500 font-semibold'>{event.tourManagerEmail}</span>
          </div>
        )}

        <Separator className='my-3' />

        <div className={cn('grid gap-2', isVenueManager ? '' : 'grid-cols-2')}>
          <Button
            asChild
            variant='outline'
            size='xs'
            className='w-full'
          >
            <Link href={`/eventi/${event.id}`}>
              <Eye className='size-4' />
              Vedi Dettagli
            </Link>
          </Button>

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

          {isArtistManager && event.status === 'pre-confirmed' && (
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

          {isArtistManager && (event.status === 'proposed' || event.status === 'pre-confirmed') && (
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

          {isVenueManager && ['proposed', 'pre-confirmed'].includes(event.status) && (
            <DeleteEventButton event={event} />
          )}
        </div>
      </div>

      {/* DESKTOP */}
      <div className='max-h-max hidden xl:flex flex-col gap-3 hover:bg-zinc-50 rounded-2xl p-4'>
        <div className='flex justify-between items-start gap-3'>
          <div className='space-y-3'>
            <div className='flex flex-wrap items-center gap-2'>
              <ArtistsBadge
                artists={[event.artist]}
                userRole={userRole}
              />
              <span className='text-xs text-zinc-400'>x</span>
              <VenuesBadge
                userRole={userRole}
                venues={[event.venue]}
              />
              <span className='text-xs text-zinc-400'>—</span>
              <span className='text-[13px] font-semibold text-zinc-800'>
                {isSameDay ? eventStartDate : `${eventStartDate} - ${eventEndDate}`}
              </span>
              <EventStatusBadge status={event.status} size='xs' />
              {userRole === 'admin' && event.hasConflict && <EventConflictBadge />}
              {isAdmin && (
                <div className='flex items-center gap-1'>
                  <div className='w-3 h-3 flex justify-center items-center bg-zinc-400 rounded-xs'>
                    <Check className='size-2 text-white' />
                  </div>
                  <span className='text-xs text-zinc-400 font-normal'>
                    Attività completate: {activityCount}/10
                  </span>
                </div>
              )}
            </div>

            <div className='grid sm:grid-cols-2 gap-2'>
              <div className='flex items-center gap-2 text-xs text-zinc-700'>
                <CalendarDays className='size-3 text-zinc-700' />
                <span>{eventStartDate}</span>
                <span className='text-zinc-400'>•</span>
                <span>{eventStartTime}</span>
              </div>
              <div className='flex items-center gap-2 text-xs text-zinc-700'>
                <CalendarDays className='size-3 text-zinc-700' />
                <span>{eventEndDate}</span>
                <span className='text-zinc-400'>•</span>
                <span>{eventEndTime}</span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              {isAdmin && event.artistManager && (
                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-1'>
                    <Image
                      className='w-4 h-4'
                      src='/images/navbar-icons/artist-managers.svg'
                      alt='icona valigetta'
                      width={16}
                      height={16}
                      loading='lazy'
                    />
                    <span className='text-xs text-zinc-600'>Artist Manager</span>
                  </div>

                  <ManagersBadge
                    userRole={userRole}
                    managers={[event.artistManager]}
                    pathSegment='manager-artisti'
                  />
                </div>
              )}

              {event.venue.manager && (
                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-1'>
                    <Image
                      className='w-4 h-4'
                      src='/images/navbar-icons/artist-managers.svg'
                      alt='icona valigetta'
                      width={16}
                      height={16}
                      loading='lazy'
                    />
                    <span className='text-xs text-zinc-600'>Venue Manager</span>
                  </div>

                  <ManagersBadge
                    userRole={userRole}
                    managers={[event.venue.manager]}
                    pathSegment='promoter-locali'
                  />
                </div>
              )}

              {isAdmin && event.tourManagerEmail && (
                <div className='flex items-center gap-3'>
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
                    {event.tourManagerEmail}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className='flex items-center gap-1.5'>
            <Button
              asChild
              variant='outline'
              size='xs'
            >
              <Link href={`/eventi/${event.id}`}>
                <Eye className='size-4' />
                Vedi Dettagli
              </Link>
            </Button>

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

            {isArtistManager && event.status === 'pre-confirmed' && (
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

            {isAdmin && event.status === 'proposed' && (
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

            {isArtistManager && (event.status === 'proposed' || event.status === 'pre-confirmed') && (
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

            {isVenueManager && ['proposed', 'pre-confirmed'].includes(event.status) && (
              <DeleteEventButton event={event} />
            )}

            {isAdmin && (
              <Popover>
                <PopoverTrigger
                  className={cn(
                    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    'bg-zinc-200 text-secondary-foreground hover:bg-zinc-200/80', // secondary variant
                    'h-8 min-w-16 rounded-lg gap-1.5 px-2.5 has-[>svg]:px-2', // xs size
                    'text-xs',
                  )}
                >
                  Modifica <ChevronDown />
                </PopoverTrigger>

                <PopoverContent
                  align='end'
                  className='max-w-max flex flex-col items-start gap-2'
                >
                  <UpdateButton event={event} />
                  <DeleteEventButton event={event} />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
