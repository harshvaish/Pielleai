'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { ArtistSelectData } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { EventFormSchema } from '@/lib/validation/eventFormSchema';

export default function SearchArtistSelect({
  artists,
  value,
  setValue,
  hasError,
}: {
  artists: ArtistSelectData[];
  value: number; // artistId
  setValue: (newValue: number) => void;
  hasError: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const selectedArtist = artists.find((artist) => artist.id === value) ?? undefined;

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
            className={cn('min-w-40 justify-start', hasError && 'border-destructive')}
          >
            {selectedArtist ? (
              selectedArtist.stageName
            ) : (
              <span className='flex justify-start items-center gap-2 text-sm font-medium text-zinc-500'>
                Seleziona artista <ChevronDown className={cn('transition-transform', open ? 'rotate-180' : '')} />
              </span>
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
          className={cn('min-w-40 justify-start', hasError && 'text-destructive border-destructive')}
        >
          {selectedArtist ? (
            selectedArtist.stageName
          ) : (
            <span className='flex items-center gap-2 text-sm font-medium text-zinc-500'>
              Seleziona artista <ChevronDown className={cn('transition-transform', open ? 'rotate-180' : '')} />
            </span>
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

function ArtistsList({ artists, setOpen, value, setValue }: { artists: ArtistSelectData[]; setOpen: (open: boolean) => void; value: number | undefined; setValue: (newValue: number) => void }) {
  const { resetField } = useFormContext<EventFormSchema>();

  const onSelectHandler = (value: string): void => {
    setValue(parseInt(value));
    resetField('artistManagerProfileId');
    resetField('availability');
    setOpen(false);
  };

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
                onSelect={onSelectHandler}
                keywords={[artist.stageName]} // to enable filtering with stageName
                disabled={isSelected}
              >
                <div className='w-full flex justify-between items-center gap-2 hover:cursor-pointer'>
                  <div className='flex items-center gap-2 flex-nowrap'>
                    <Avatar className='w-6 h-6'>
                      <AvatarImage src={artist.avatarUrl} />
                      <AvatarFallback>{artist.stageName.substring(0, 1)}</AvatarFallback>
                    </Avatar>
                    {artist.stageName}
                  </div>
                  <Check className={cn(isSelected ? 'opacity-100' : 'opacity-0')} />
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
