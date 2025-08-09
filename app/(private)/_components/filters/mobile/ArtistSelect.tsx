'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ArtistSelectData } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function ArtistSelect({ initialValue, artists, onConfirm }: { initialValue: string[]; artists: ArtistSelectData[]; onConfirm: (selected: string[]) => void }) {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string[]>(initialValue);

  const onSelectHandler = (id: string): void => {
    setValue((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const resetFilter = () => {
    setValue([]);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
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
            <span className='text-zinc-500 font-normal'>Seleziona uno o più artisti</span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className='hidden'>Pannello di selezione artisti</DrawerTitle>
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
                      onSelect={() => onSelectHandler(id)}
                      keywords={[artist.stageName]}
                    >
                      <div className='w-full flex justify-between items-center gap-2 hover:cursor-pointer'>
                        <div className='flex items-center gap-2 truncate'>
                          <Avatar className='w-6 h-6'>
                            <AvatarImage src={artist.avatarUrl} />
                            <AvatarFallback>{artist.stageName.substring(0, 1)}</AvatarFallback>
                          </Avatar>
                          <span className='truncate'>{artist.stageName}</span>
                        </div>
                        <Check className={cn('transition-opacity', isSelected ? 'opacity-100' : 'opacity-0')} />
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            <div className='grid grid-cols-2 gap-2 p-2 border-t'>
              <Button
                variant='outline'
                onClick={resetFilter}
                size='sm'
              >
                Reset
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
      </DrawerContent>
    </Drawer>
  );
}
