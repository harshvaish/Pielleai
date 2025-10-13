'use client';

import ResponsivePopover from '@/app/_components/ResponsivePopover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Check, Eraser } from 'lucide-react';
import { Zone } from '@/lib/types';
import { ZoneBadge } from '../Badges/ZonesBadge';

type ZoneSelectProps = {
  initialValue: string[];
  zones: Zone[];
  onConfirm: (selected: string[]) => void;
};

export default function ZoneSelect({ initialValue, zones, onConfirm }: ZoneSelectProps) {
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
            <span className='text-zinc-400 font-normal'>Seleziona area</span>
          )}
        </Button>
      }
      open={open}
      onOpenChange={setOpen}
      title='Seleziona una o più aree'
      description='Pannello di filtraggio dati per aree di interesse'
      isDescriptionHidden={true}
    >
      <div className='mt-4 border-t'>
        <Command className='relative'>
          <CommandInput placeholder='Ricerca area' />
          <CommandList>
            <CommandEmpty>Nessun risultato.</CommandEmpty>
            <CommandGroup>
              {zones.map((zone) => {
                const id = zone.id.toString();
                const isSelected = value.includes(id);

                return (
                  <CommandItem
                    key={id}
                    value={id}
                    onSelect={() => onSelectHandler(id)}
                    keywords={[zone.name]}
                  >
                    <div className='w-full flex justify-between items-center gap-2 hover:cursor-pointer'>
                      <ZoneBadge zone={zone} />
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
