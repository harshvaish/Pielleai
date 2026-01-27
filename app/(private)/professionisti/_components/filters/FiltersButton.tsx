'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Eraser, ListFilter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ResponsivePopover from '@/app/_components/ResponsivePopover';
import { ProfessionalRole } from '@/lib/types';
import type { EventOption } from '@/lib/data/events/get-event-options';

const ROLE_LABELS: Record<ProfessionalRole, string> = {
  journalist: 'Giornalista',
  technician: 'Tecnico',
  photographer: 'Fotografo',
  backstage: 'Backstage',
  other: 'Altro',
};

type FiltersButtonProps = {
  filters: {
    fullName: string | null;
    role: ProfessionalRole | null;
    eventId: string | null;
  };
  showEventFilter: boolean;
  eventOptions: EventOption[];
};

export default function FiltersButton({
  filters,
  showEventFilter,
  eventOptions,
}: FiltersButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState(filters.fullName ?? '');
  const [role, setRole] = useState(filters.role ?? 'all');
  const [eventId, setEventId] = useState(filters.eventId ?? 'all');

  const active =
    Boolean(fullName.trim()) ||
    role !== 'all' ||
    (showEventFilter && eventId !== 'all');

  const resetHandler = () => {
    setFullName('');
    setRole('all');
    setEventId('all');
  };

  const submitHandler = () => {
    const params = new URLSearchParams();

    if (fullName.trim()) {
      params.set('fullName', fullName.trim());
    }

    if (role !== 'all') {
      params.set('role', role);
    }

    if (showEventFilter && eventId !== 'all') {
      params.set('event', eventId);
    }

    params.set('page', '1');

    setOpen(false);
    startTransition(() => {
      router.push(`${window.location.pathname}?${params.toString()}`);
    });
  };

  return (
    <ResponsivePopover
      open={open}
      onOpenChange={setOpen}
      title='Filtri'
      description=''
      isDescriptionHidden={true}
      trigger={
        <Button
          variant={active ? 'secondary' : 'outline'}
          size='xs'
          disabled={isPending}
        >
          <ListFilter />
          Filtri
        </Button>
      }
    >
      <div className='flex flex-col gap-4 py-4'>
        <div className='flex flex-col gap-2'>
          <div className='text-sm font-semibold'>Nome</div>
          <Input
            placeholder='Cerca nome'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <div className='text-sm font-semibold'>Ruolo</div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder='Tutti' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Tutti</SelectItem>
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showEventFilter && (
          <div className='flex flex-col gap-2'>
            <div className='text-sm font-semibold'>Evento</div>
            <Select value={eventId} onValueChange={setEventId}>
              <SelectTrigger>
                <SelectValue placeholder='Tutti' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tutti</SelectItem>
                {eventOptions.map((event) => (
                  <SelectItem key={event.id} value={String(event.id)}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <Button
          variant='ghost'
          size='xs'
          onClick={resetHandler}
        >
          <Eraser />
          Pulisci
        </Button>
        <Button
          size='xs'
          disabled={isPending}
          onClick={submitHandler}
        >
          {isPending ? 'Filtro...' : 'Conferma'}
        </Button>
      </div>
    </ResponsivePopover>
  );
}
