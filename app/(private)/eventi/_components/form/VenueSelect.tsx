'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { VenueSelectData } from '@/lib/types';
import Image from 'next/image';
import { EventFormSchema } from '@/lib/validation/eventFormSchema';

type VenueSelectProps = { venues: VenueSelectData[] };

export default function VenueSelect({ venues }: VenueSelectProps) {
  const {
    watch,
    control,
    formState: { errors },
  } = useFormContext<EventFormSchema>();

  const selectedVenueId = watch('venueId');
  const selectedVenue = venues.find((v) => v.id === selectedVenueId);

  return (
    <Controller
      control={control}
      name='venueId'
      render={({ field }) => (
        <Select
          value={field.value ? field.value.toString() : undefined}
          onValueChange={(v) => field.onChange(parseInt(v))}
        >
          <SelectTrigger
            className={cn('w-full', errors.venueId && 'border-destructive text-destructive')}
            size='sm'
          >
            {selectedVenue ? selectedVenue.name : 'Seleziona un locale'}
          </SelectTrigger>
          <SelectContent>
            {venues.map((venue) => (
              <SelectItem
                key={venue.id}
                value={venue.id.toString()}
              >
                <div className='flex items-center gap-2 flex-nowrap'>
                  <Image
                    src={venue.avatarUrl}
                    alt='Immagine profilo locale'
                    height={24}
                    width={24}
                    sizes='24px'
                    className='w-6 h-6 rounded-full'
                  />
                  {venue.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
