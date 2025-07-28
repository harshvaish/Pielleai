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
import { ArtistSelectData } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, ListFilter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SpinnerLoading } from '@/app/_components/SpinnerLoading';

export default function ArtistFilter({
  artists,
}: {
  artists: ArtistSelectData[];
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
        <ArtistsList
          artists={artists}
          setOpen={setOpen}
        />
      </PopoverContent>
    </Popover>
  );
}

function ArtistsList({
  artists,
  setOpen,
}: {
  artists: ArtistSelectData[];
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const artistParam = searchParams.get('artist');
  const initialValue = artistParam ? artistParam.split(',') : [];

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
      params.set('artist', value.join(','));
    } else {
      params.delete('artist');
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
        placeholder='Ricerca artista'
        disabled={isPending}
      />
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
                      <AvatarFallback>
                        {artist.stageName.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <span className='truncate'>{artist.stageName}</span>
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
