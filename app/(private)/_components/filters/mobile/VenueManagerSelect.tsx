'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { VenueManagerSelectData } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import ResponsivePopover from '@/app/_components/ResponsivePopover';

export default function VenueManagerSelect({ initialValue, venueManagers, onConfirm }: { initialValue: string[]; venueManagers: VenueManagerSelectData[]; onConfirm: (selected: string[]) => void }) {
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
            <span className='text-zinc-500 font-normal'>Seleziona uno o più manager</span>
          )}
        </Button>
      }
      open={open}
      onOpenChange={setOpen}
      title='Seleziona uno o più manager'
      description='Pannello di filtraggio dati per manager locali'
      isDescriptionHidden={true}
    >
      <div className='mt-4 border-t'>
        <Command className='relative'>
          <CommandInput placeholder='Ricerca artista' />
          <CommandList>
            <CommandEmpty>Nessun risultato.</CommandEmpty>
            <CommandGroup>
              {venueManagers.map((manager) => {
                const id = manager.profileId.toString();
                const isSelected = value.includes(id);

                return (
                  <CommandItem
                    key={id}
                    value={id}
                    onSelect={() => onSelectHandler(id)}
                    keywords={[manager.name, manager.surname]}
                  >
                    <div className='w-full flex justify-between items-center gap-2 hover:cursor-pointer'>
                      <div className='flex items-center gap-2 truncate'>
                        <Avatar className='w-6 h-6'>
                          <AvatarImage src={manager.avatarUrl} />
                          <AvatarFallback>{manager.name.substring(0, 1)}</AvatarFallback>
                        </Avatar>
                        <span className='truncate'>
                          {manager.name} {manager.surname}
                        </span>
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
              variant='ghost'
              size='sm'
              className='text-destructive'
              onClick={resetHandler}
            >
              <X />
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
