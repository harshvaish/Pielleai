'use client';

import useSWR from 'swr';
import { Controller, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { cn, fetcher } from '@/lib/utils';
import { ArtistAvailability } from '@/lib/types';
import { useEffect } from 'react';
import { EventFormSchema } from '@/lib/validation/eventFormSchema';
import { format } from 'date-fns';

export default function ArtistAvailabilitySelect() {
  const { watch, control, formState } = useFormContext<EventFormSchema>();

  const artistId = watch('artistId');

  const { data, error, isLoading } = useSWR(
    artistId ? `/api/artist-availabilities?artist=${artistId}` : null,
    fetcher
  );

  const availabilities: ArtistAvailability[] = data?.availabilities || [];

  useEffect(() => {
    if (error) {
      toast.error('Recupero delle disponibilità artista non riuscito.');
    }
  }, [error]);

  return (
    <Controller
      control={control}
      name='availabilityId'
      render={({ field }) => (
        <Select
          value={field.value ? field.value.toString() : undefined}
          onValueChange={(v) => field.onChange(parseInt(v))}
          disabled={isLoading || !availabilities.length}
        >
          <SelectTrigger
            id='availabilityId'
            className={cn(
              'w-full',
              formState.errors.availabilityId &&
                'border-destructive text-destructive'
            )}
            size='sm'
          >
            {(() => {
              const selected = availabilities.find(
                (av) => av.id === field.value
              );
              return selected
                ? `${format(selected.startDate, 'dd/MM/yyyy HH:mm')} - ${format(selected.endDate, 'HH:mm')}`
                : availabilities.length
                  ? 'Seleziona una disponibilità'
                  : 'Nessuna disponibilità';
            })()}
          </SelectTrigger>
          <SelectContent>
            {availabilities.map((av) => (
              <SelectItem
                key={av.id}
                value={av.id.toString()}
              >
                {format(av.startDate, 'dd/MM/yyyy HH:mm')} -{' '}
                {format(av.endDate, 'HH:mm')}
              </SelectItem>
            ))}
            {availabilities.length === 0 && 'Nessuna disponibilità.'}
          </SelectContent>
        </Select>
      )}
    />
  );
}
