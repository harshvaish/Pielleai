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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ListFilter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SpinnerLoading } from '@/app/_components/SpinnerLoading';
import { VENUE_TYPES } from '@/lib/constants';
import VenueTypeBadge from '../../../../_components/Badges/VenueTypeBadge';

export default function VenueTypeFilter() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn('min-w-40 w-full justify-between bg-white mt-2')}
        >
          <span className='text-sm font-medium text-zinc-400'>Filtra</span>
          <ListFilter />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[280px] p-1 rounded-2xl'
        align='end'
      >
        <TypesList setOpen={setOpen} />
      </PopoverContent>
    </Popover>
  );
}

function TypesList({ setOpen }: { setOpen: (open: boolean) => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParam = searchParams.get('type');
  const initialValue = typeParam ? typeParam.split(',') : [];

  const [value, setValue] = useState<string[]>(initialValue);
  const [isPending, startTransition] = useTransition();

  const onSelectHandler = (id: string): void => {
    setValue((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.length > 0) {
      params.set('type', value.join(','));
    } else {
      params.delete('type');
    }

    params.set('page', '1');

    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`);
    });

    setOpen(false);
  };

  const resetFilter = () => {
    setValue([]);
  };

  return (
    <Command className='relative'>
      <CommandInput
        placeholder='Ricerca tipologia'
        disabled={isPending}
      />
      <CommandList>
        <CommandEmpty>Nessun risultato.</CommandEmpty>
        <CommandGroup>
          {VENUE_TYPES.map((type) => {
            const isSelected = value.includes(type);

            return (
              <CommandItem
                key={type}
                value={type}
                onSelect={() => onSelectHandler(type)}
              >
                <div className='w-full flex justify-between items-center gap-2 hover:cursor-pointer'>
                  <VenueTypeBadge type={type} />
                  <Check
                    className={cn(
                      'transition-opacity',
                      isSelected ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
      <div className='flex justify-end items-center gap-2 pt-2 pb-1 border-t px-2'>
        <Button
          variant='ghost'
          onClick={resetFilter}
          disabled={isPending}
          size='xs'
        >
          {isPending ? <SpinnerLoading /> : 'Reset'}
        </Button>
        <Button
          onClick={applyFilter}
          disabled={isPending}
          size='xs'
        >
          {isPending ? <SpinnerLoading /> : 'Cerca'}
        </Button>
      </div>
    </Command>
  );
}
