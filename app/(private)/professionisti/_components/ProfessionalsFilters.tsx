'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfessionalRole } from '@/lib/types';
import type { EventOption } from '@/lib/data/events/get-event-options';

const ROLE_LABELS: Record<ProfessionalRole, string> = {
  journalist: 'Giornalista',
  technician: 'Tecnico',
  photographer: 'Fotografo',
  backstage: 'Backstage',
  other: 'Altro',
};

type ProfessionalsFiltersProps = {
  showEventFilter: boolean;
  eventOptions: EventOption[];
};

export default function ProfessionalsFilters({ showEventFilter, eventOptions }: ProfessionalsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState(searchParams.get('fullName') ?? '');
  const [role, setRole] = useState(searchParams.get('role') ?? 'all');
  const [eventId, setEventId] = useState(searchParams.get('event') ?? 'all');

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (fullName.trim()) {
      params.set('fullName', fullName.trim());
    } else {
      params.delete('fullName');
    }

    if (role && role !== 'all') {
      params.set('role', role);
    } else {
      params.delete('role');
    }

    if (showEventFilter) {
      if (eventId && eventId !== 'all') {
        params.set('event', eventId);
      } else {
        params.delete('event');
      }
    }

    params.set('page', '1');

    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setFullName('');
    setRole('all');
    setEventId('all');

    const params = new URLSearchParams(searchParams.toString());
    params.delete('fullName');
    params.delete('role');
    params.delete('event');
    params.set('page', '1');

    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`);
    });
  };

  return (
    <div className='flex flex-col lg:flex-row gap-3 lg:items-end'>
      <div className='flex flex-col gap-1'>
        <span className='text-xs uppercase text-zinc-500'>Nome</span>
        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder='Cerca nome' />
      </div>

      <div className='flex flex-col gap-1'>
        <span className='text-xs uppercase text-zinc-500'>Ruolo</span>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className='min-w-44'>
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
        <div className='flex flex-col gap-1'>
          <span className='text-xs uppercase text-zinc-500'>Evento</span>
          <Select value={eventId} onValueChange={setEventId}>
            <SelectTrigger className='min-w-56'>
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

      <div className='flex gap-2 self-end'>
        <Button size='sm' className='h-9 px-3' onClick={applyFilters} disabled={isPending}>
          Applica
        </Button>
        <Button size='sm' className='h-9 px-3' variant='ghost' onClick={clearFilters} disabled={isPending}>
          Reset
        </Button>
      </div>
    </div>
  );
}
