'use client';

import useSWR from 'swr';
import { Controller, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { cn, fetcher } from '@/lib/utils';
import { ArtistManagerSelectData } from '@/lib/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { EventFormSchema } from '@/lib/validation/event-form-schema';

export default function ArtistManagerSelect() {
  const { watch, control, formState } = useFormContext<EventFormSchema>();
  const [managers, setManagers] = useState<ArtistManagerSelectData[]>([]);

  const artistId = watch('artistId');

  const { data: response, isLoading } = useSWR(
    artistId ? `/api/artist-managers?a=${artistId}` : null,
    fetcher,
  );

  useEffect(() => {
    if (!response) return;

    if (!response.success) {
      toast.error(response.message || 'Recupero disponibilità artista non riuscito.');
      return;
    }

    setManagers(response.data);
  }, [response]);

  return (
    <Controller
      control={control}
      name='artistManagerProfileId'
      render={({ field }) => (
        <Select
          value={field.value ? field.value.toString() : undefined}
          onValueChange={(v) => field.onChange(parseInt(v))}
          disabled={isLoading || !managers.length}
        >
          <SelectTrigger
            id='artistManagerProfileId'
            className={cn(
              'w-full',
              formState.errors.artistManagerProfileId && 'border-destructive text-destructive',
            )}
            size='sm'
          >
            {(() => {
              const selected = managers.find((m) => m.profileId === field.value);
              return selected ? `${selected.name} ${selected.surname}` : 'Seleziona un manager';
            })()}
          </SelectTrigger>
          <SelectContent>
            {managers.map((manager) => (
              <SelectItem
                key={manager.id}
                value={manager.profileId.toString()}
              >
                <div className='flex items-center gap-2 flex-nowrap'>
                  <Image
                    src={manager.avatarUrl}
                    alt='Immagine profilo utente'
                    height={24}
                    width={24}
                    sizes='24px'
                    className='w-6 h-6 rounded-full'
                  />
                  {manager.name} {manager.surname}
                </div>
              </SelectItem>
            ))}
            {managers.length === 0 && 'Nessun manager disponibile'}
          </SelectContent>
        </Select>
      )}
    />
  );
}
