'use client';

import ResponsivePopover from '@/app/_components/ResponsivePopover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Check, Eraser } from 'lucide-react';
import VenueTypeBadge from '../badges/VenueTypeBadge';
import { venueTypes } from '@/lib/database/schema';

type VenueTypeSelectProps = { initialValue: string[]; onConfirm: (selected: string[]) => void };

export default function VenueTypeSelect({ initialValue, onConfirm }: VenueTypeSelectProps) {
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
              {value.length} selezionat{value.length > 1 ? 'e' : 'a'}
            </span>
          ) : (
            <span className='text-zinc-400 font-normal'>Seleziona tipologia</span>
          )}
        </Button>
      }
      open={open}
      onOpenChange={setOpen}
      title='Seleziona una o più tipologie'
      description='Pannello di filtraggio dati per tipologie'
      isDescriptionHidden={true}
    >
      <div className='mt-4 border-t'>
        <Command className='relative'>
          <CommandInput placeholder='Ricerca area' />
          <CommandList>
            <CommandEmpty>Nessun risultato.</CommandEmpty>
            <CommandGroup>
              {venueTypes.enumValues.map((type) => {
                const isSelected = value.includes(type);

                return (
                  <CommandItem
                    key={type}
                    value={type}
                    onSelect={() => onSelectHandler(type)}
                    keywords={[type]}
                  >
                    <div className='w-full flex justify-between items-center gap-2 hover:cursor-pointer'>
                      <VenueTypeBadge type={type} />
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
