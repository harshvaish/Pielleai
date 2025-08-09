'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { VenueSelectData } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, ListFilter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SpinnerLoading } from '@/app/_components/SpinnerLoading';

export default function VenueFilter({ venues }: { venues: VenueSelectData[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const venueParam = searchParams.get('venue');
  const initialValue = venueParam ? venueParam.split(',') : [];
  const selectedCount = initialValue.length;

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string[]>(initialValue);

  const onSelectHandler = (id: string): void => {
    setValue((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.length > 0) {
      params.set('venue', value.join(','));
    } else {
      params.delete('venue');
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
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn('min-w-40 w-full justify-between text-sm bg-white mt-2')}
        >
          {selectedCount > 0 ? (
            <span className='font-medium'>
              {selectedCount} Selezionat{selectedCount == 1 ? 'o' : 'i'}
            </span>
          ) : (
            <span className='text-zinc-500 font-normal'>Filtra</span>
          )}
          <ListFilter />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[280px] p-1 rounded-2xl'
        align='end'
      >
        <Command className='relative'>
          <CommandInput
            placeholder='Ricerca locale'
            disabled={isPending}
          />
          <CommandList>
            <CommandEmpty>Nessun risultato.</CommandEmpty>
            <CommandGroup>
              {venues.map((venue) => {
                const id = venue.id.toString();
                const isSelected = value.includes(id);

                return (
                  <CommandItem
                    key={id}
                    value={id}
                    onSelect={() => onSelectHandler(id)}
                    keywords={[venue.name]}
                  >
                    <div className='w-full flex justify-between items-center gap-2 hover:cursor-pointer'>
                      <div className='flex items-center gap-2 truncate'>
                        <Avatar className='w-6 h-6'>
                          <AvatarImage src={venue.avatarUrl} />
                          <AvatarFallback>{venue.name.substring(0, 1)}</AvatarFallback>
                        </Avatar>
                        <span className='truncate'>{venue.name}</span>
                      </div>
                      <Check className={cn('transition-opacity', isSelected ? 'opacity-100' : 'opacity-0')} />
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
      </PopoverContent>
    </Popover>
  );
}
