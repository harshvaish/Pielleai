'use client';

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
import { Check, Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import ResponsivePopover from '@/app/_components/ResponsivePopover';

export default function ArtistSelect({
  initialValue,
  artists,
  onConfirm,
}: {
  initialValue: string[];
  artists: ArtistSelectData[];
  onConfirm: (selected: string[]) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string[]>(initialValue);

  const onSelectHandler = (id: string): void => {
    setValue((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const resetHandler = () => {
    setValue([]);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <ResponsivePopover
      trigger={
        <Button
          variant='outline'
          size='sm'
          className={cn('min-w-40 w-full justify-between text-sm bg-white')}
        >
          {value.length > 0 ? (
            <span className='font-medium'>
              {value.length} selezionat{value.length > 1 ? 'i' : 'o'}
            </span>
          ) : (
            <span className='text-zinc-400 font-normal'>Seleziona artista</span>
          )}
        </Button>
      }
      open={open}
      onOpenChange={setOpen}
      title='Seleziona uno o più artisti'
      description='Pannello di filtraggio dati per artista'
      isDescriptionHidden={true}
    >
      <div className='mt-4 border-t'>
        <Command className='relative'>
          <CommandInput placeholder='Ricerca artista' />
          <CommandList>
            <CommandEmpty>Nessun risultato.</CommandEmpty>
            <CommandGroup>
              {artists.map((artist) => {
                const id = artist.id.toString();
                const isSelected = value.includes(id);

                return (
                  <CommandItem
                    key={id}
                    value={id}
                    onSelect={onSelectHandler}
                    keywords={[artist.stageName]}
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
          <div className='grid grid-cols-2 gap-2 p-2 border-t'>
            <Button
              variant='ghost'
              size='sm'
              onClick={resetHandler}
            >
              <Eraser />
              Pulisci
            </Button>
            <Button
              onClick={() => {
                onConfirm(value);
                setOpen(false);
              }}
              size='sm'
            >
              Conferma
            </Button>
          </div>
        </Command>
      </div>
    </ResponsivePopover>
  );
}
