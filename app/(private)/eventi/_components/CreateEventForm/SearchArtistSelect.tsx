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
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { ArtistSelectData } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SearchArtistSelect({
  artists,
  value,
  setValue,
}: {
  artists: ArtistSelectData[];
  value: number; // artistId
  setValue: (newValue: number) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const selectedArtist =
    artists.find((artist) => artist.id === value) ?? undefined;

  if (isDesktop) {
    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='min-w-40 justify-start'
          >
            {selectedArtist ? (
              selectedArtist.stageName
            ) : (
              <>
                Seleziona artista{' '}
                <ChevronUp
                  className={cn(
                    'transition-transform',
                    open ? 'rotate-180' : ''
                  )}
                />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-[200px] p-1 rounded-2xl'
          align='start'
        >
          <ArtistsList
            artists={artists}
            setOpen={setOpen}
            value={value}
            setValue={setValue}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='min-w-40 justify-start'
        >
          {selectedArtist ? (
            selectedArtist.stageName
          ) : (
            <>
              Seleziona artista{' '}
              <ChevronUp
                className={cn('transition-transform', open ? 'rotate-180' : '')}
              />
            </>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='mt-4 border-t'>
          <ArtistsList
            artists={artists}
            setOpen={setOpen}
            value={value}
            setValue={setValue}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ArtistsList({
  artists,
  setOpen,
  value,
  setValue,
}: {
  artists: ArtistSelectData[];
  setOpen: (open: boolean) => void;
  value: number | undefined;
  setValue: (newValue: number) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder='Ricerca artista' />
      <CommandList>
        <CommandEmpty>Nessun risultato.</CommandEmpty>
        <CommandGroup>
          {artists.map((artist) => {
            const isSelected = artist.id === value;
            return (
              <CommandItem
                key={artist.id}
                value={artist.id.toString()}
                onSelect={(value) => {
                  setValue(parseInt(value));
                  setOpen(false);
                }}
                keywords={[artist.stageName]} // to enable filtering with stageName
                disabled={isSelected}
              >
                <div className='w-full flex justify-between items-center gap-2 hover:cursor-pointer'>
                  <div className='flex items-center gap-2 flex-nowrap'>
                    <Avatar className='w-6 h-6'>
                      <AvatarImage src={artist.avatarUrl} />
                      <AvatarFallback>
                        {artist.stageName.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    {artist.stageName}
                  </div>
                  <Check
                    className={cn(isSelected ? 'opacity-100' : 'opacity-0')}
                  />
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
