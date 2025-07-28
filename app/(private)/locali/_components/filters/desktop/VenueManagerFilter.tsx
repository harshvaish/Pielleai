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
import { VenueManagerSelectData } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, ListFilter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SpinnerLoading } from '@/app/_components/SpinnerLoading';

export default function VenueManagerFilter({
  venueManagers,
}: {
  venueManagers: VenueManagerSelectData[];
}) {
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
        align='center'
      >
        <VenueManagersList
          venueManagers={venueManagers}
          setOpen={setOpen}
        />
      </PopoverContent>
    </Popover>
  );
}

function VenueManagersList({
  venueManagers,
  setOpen,
}: {
  venueManagers: VenueManagerSelectData[];
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const managerParam = searchParams.get('manager');
  const initialValue = managerParam ? managerParam.split(',') : [];

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
      params.set('manager', value.join(','));
    } else {
      params.delete('manager');
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
        placeholder='Ricerca manager'
        disabled={isPending}
      />
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
                      <AvatarFallback>
                        {manager.name.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <span className='truncate'>
                      {manager.name} {manager.surname}
                    </span>
                  </div>
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
