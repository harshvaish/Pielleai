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

type ShowMoreProps = RBCShowMoreProps<CalendarEvent> & {
  userRole: UserRole;
};

export default function ShowMore({ slotDate, events, userRole }: ShowMoreProps) {
  const [open, setOpen] = useState<boolean>(false);
  const date = format(slotDate, 'dd/MM/yyyy');

  const isAdmin = userRole === 'admin';

  return (
    <>
      <Button
        variant='ghost'
        className='max-w-full h-auto self-end py-1 px-1 shadow-none hover:bg-zinc-100 overflow-hidden'
        onClick={() => setOpen(true)}
      >
        <span className='text-[10px] font-semibold line-clamp-1'>Altri eventi</span>
        <ChevronDown
          width={14}
          height={14}
        />
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={`Eventi del ${date}`}
        description={`Consulta i dati principali dell'evento, per vederne tutti i dettagli ${isAdmin ? 'o per fare modifiche ' : ''}vai alla sezione eventi.`}
      >
        {events.map((event, index) => {
          return (
            <div
              key={index}
              className={cn('mb-4 rounded-xl', event.status)}
            >
              <EventContent
                userRole={userRole}
                event={event}
              />
            </div>
          );
        })}
      </ConfirmDialog>
    </>
  );
}
