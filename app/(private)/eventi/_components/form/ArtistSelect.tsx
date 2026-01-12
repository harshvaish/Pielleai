'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ArtistSelectData } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import ResponsivePopover from '@/app/_components/ResponsivePopover';

type ArtistSelectProps = {
  artists: ArtistSelectData[];
  value: number; // artistId
  setValue: (newValue: number) => void;
  hasError: boolean;
};

export default function ArtistSelect({ artists, value, setValue, hasError }: ArtistSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selectedArtist = artists.find((artist) => artist.id === value) ?? undefined;

  const { setValue: setFormValue } = useFormContext();

  const onSelectHandler = (value: string): void => {
    setValue(parseInt(value));
    setFormValue('artistManagerProfileId', undefined);
    setFormValue('availability', { startDate: undefined, endDate: undefined });

    setOpen(false);
  };

  return (
    <ResponsivePopover
      open={open}
      onOpenChange={setOpen}
      title='Seleziona artista'
      description=''
      isDescriptionHidden={true}
      align='start'
      trigger={
        <Button
          variant='outline'
          size='sm'
          className={cn(
            'min-w-40 justify-start text-sm font-normal',
            hasError && 'border-destructive',
          )}
        >
          {selectedArtist ? (
            selectedArtist.stageName
          ) : (
            <span className='w-full flex justify-between items-center gap-2 text-zinc-400'>
              Seleziona artista{' '}
              <ChevronDown className={cn('transition-transform', open ? 'rotate-180' : '')} />
            </span>
          )}
        </Button>
      }
    >
      <div className='mt-4 border-t'>
        <Command>
          <CommandInput placeholder='Ricerca artista' />
          <CommandList
            className='max-h-60 overflow-y-auto overscroll-contain'
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            <CommandEmpty>Nessun risultato.</CommandEmpty>
            <CommandGroup>
              {artists.map((artist) => {
                const isSelected = artist.id === value;
                return (
                  <CommandItem
                    key={artist.id}
                    value={artist.id?.toString()}
                    onSelect={onSelectHandler}
                    keywords={[artist.stageName]} // to enable filtering with stageName
                    disabled={isSelected}
                  >
                    <div className='w-full flex justify-between items-center gap-2 hover:cursor-pointer'>
                      <div className='flex items-center gap-2 truncate'>
                        <Avatar className='w-6 h-6'>
                          <AvatarImage src={artist.avatarUrl} />
                          <AvatarFallback>
                            {artist.stageName.substring(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className='truncate'>{artist.stageName}</span>
                      </div>
                      <Check
                        className={cn(
                          'transition-opacity',
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </ResponsivePopover>
  );
}
