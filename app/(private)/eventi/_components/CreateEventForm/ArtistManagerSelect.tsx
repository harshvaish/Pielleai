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
import { ArtistManagerSelectData } from '@/lib/types';
import Image from 'next/image';
import { useEffect } from 'react';
import { EventFormSchema } from '@/lib/validation/eventFormSchema';

export default function ArtistManagerSelect() {
  const { watch, control, formState } = useFormContext<EventFormSchema>();

  const artistId = watch('artistId');

  const { data, error, isLoading } = useSWR(
    artistId ? `/api/artist-managers?artist=${artistId}` : null,
    fetcher
  );

  const managers: ArtistManagerSelectData[] = data?.managers || [];

  useEffect(() => {
    if (error) {
      toast.error('Recupero dei managers artista non riuscito.');
    }
  }, [error]);

  return (
    <Controller
      control={control}
      name='artistManagerId'
      render={({ field }) => (
        <Select
          value={field.value ? field.value.toString() : undefined}
          onValueChange={(v) => field.onChange(parseInt(v))}
          disabled={isLoading || !managers.length}
        >
          <SelectTrigger
            id='artistManagerId'
            className={cn(
              'w-full',
              formState.errors.artistManagerId &&
                'border-destructive text-destructive'
            )}
            size='sm'
          >
            {(() => {
              const selected = managers.find(
                (m) => m.profileId === field.value
              );
              return selected
                ? `${selected.name} ${selected.surname}`
                : 'Seleziona un manager';
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
