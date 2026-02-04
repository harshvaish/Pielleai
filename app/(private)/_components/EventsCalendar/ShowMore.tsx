'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { ShowMoreProps as RBCShowMoreProps } from 'react-big-calendar';
import { format } from 'date-fns';
import { CalendarEvent, UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';
import EventContent from './EventContent';
import ConfirmDialog from '@/app/_components/ConfirmDialog';
import { useState } from 'react';
import EventStatusBadge from '../Badges/EventStatusBadge';
import { HostedEventBadge } from '../Badges/HostedEventBadge';
import { generateEventTitle } from '@/lib/utils/generate-event-title';

type ShowMoreProps = RBCShowMoreProps<CalendarEvent> & {
  userRole: UserRole;
};

export default function ShowMore({ slotDate, events, count, userRole }: ShowMoreProps) {
  const [open, setOpen] = useState<boolean>(false);
  const date = format(slotDate, 'dd/MM/yyyy');

  return (
    <>
      <Button
        variant='ghost'
        className='max-w-full h-auto self-end py-1 px-1 shadow-none hover:bg-zinc-100 overflow-hidden'
        onClick={() => setOpen(true)}
      >
        <span className='text-[10px] font-semibold line-clamp-1'>+{count} altri eventi</span>
        <ChevronDown
          width={14}
          height={14}
        />
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Eventi del ${date}`}
        description=''
        isDescriptionHidden
      >
        {events.map((event, index) => {
          const eventTitle =
            event.title?.trim() ||
            generateEventTitle(
              event.artist.stageName?.trim() || `${event.artist.name} ${event.artist.surname}`.trim(),
              event.venue.name,
              event.start,
              event.end,
            );

          return (
            <div
              key={index}
              className={cn('mb-4 rounded-xl', event.status)}
            >
              <div className='flex items-start justify-between gap-3 px-4 pt-4'>
                <div className='min-w-0 text-sm font-semibold text-zinc-900 truncate'>
                  {eventTitle}
                </div>
                <div className='flex items-center gap-1.5'>
                  {event.hostedEvent && <HostedEventBadge size='xs' />}
                  <EventStatusBadge
                    status={event.status}
                    size='xs'
                  />
                </div>
              </div>
              <EventContent
                userRole={userRole}
                event={event}
                showHostedBadge={false}
              />
            </div>
          );
        })}
      </ConfirmDialog>
    </>
  );
}
