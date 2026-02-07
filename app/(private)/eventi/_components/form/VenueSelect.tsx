'use client';

import * as React from 'react';

import { Controller, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VenueSelectData } from '@/lib/types';
import { EventFormSchema } from '@/lib/validation/event-form-schema';
import { AVATAR_FALLBACK } from '@/lib/constants';
import ResponsivePopover from '@/app/_components/ResponsivePopover';

type VenueSelectProps = { venues: VenueSelectData[] };

export default function VenueSelect({ venues }: VenueSelectProps) {
  const {
    watch,
    control,
    formState: { errors },
  } = useFormContext<EventFormSchema>();

  const selectedVenueId = watch('venueId');
  const selectedVenue = venues.find((v) => v.id === selectedVenueId);
  const [open, setOpen] = React.useState(false);

  const formatVenueLabel = (venue: Pick<VenueSelectData, 'name' | 'city'>) => {
    const city = (venue.city || '').trim();
    return city ? `${venue.name} - ${city}` : venue.name;
  };

  return (
    <Controller
      control={control}
      name='venueId'
      render={({ field }) => {
        const selectedId = typeof field.value === 'number' ? field.value : undefined;

        const onSelectHandler = (value: string): void => {
          const nextId = parseInt(value);
          if (!Number.isFinite(nextId)) return;
          field.onChange(nextId);
          setOpen(false);
        };

        return (
          <ResponsivePopover
            open={open}
            onOpenChange={setOpen}
            title='Seleziona locale'
            description=''
            isDescriptionHidden={true}
            align='start'
            trigger={
              <Button
                variant='outline'
                size='sm'
                type='button'
                className={cn(
                  'w-full justify-start text-sm font-normal',
                  errors.venueId && 'border-destructive',
                )}
              >
                <span
                  className={cn(
                    'w-full flex justify-between items-center gap-2',
                    !selectedVenue && 'text-zinc-400',
                  )}
                >
                  <span className='truncate'>
                    {selectedVenue ? formatVenueLabel(selectedVenue) : 'Seleziona un locale'}
                  </span>
                  <ChevronDown
                    className={cn('transition-transform', open ? 'rotate-180' : '')}
                  />
                </span>
              </Button>
            }
          >
            <div className='mt-4 border-t'>
              <Command>
                <CommandInput placeholder='Ricerca locale' />
                <CommandList
                  className='max-h-60 overflow-y-auto overscroll-contain'
                  onWheel={(event) => event.stopPropagation()}
                  onTouchMove={(event) => event.stopPropagation()}
                >
                  <CommandEmpty>Nessun risultato.</CommandEmpty>
                  <CommandGroup>
                    {venues.map((venue) => {
                      const isSelected = venue.id === selectedId;
                      const keywords = [
                        venue.name,
                        venue.city,
                        venue.address,
                        venue.company,
                        venue.zipCode,
                      ].filter(Boolean) as string[];

                      return (
                        <CommandItem
                          key={venue.id}
                          value={venue.id.toString()}
                          onSelect={onSelectHandler}
                          keywords={keywords}
                          disabled={isSelected}
                        >
                          <div className='w-full flex justify-between items-center gap-2 hover:cursor-pointer'>
                            <div className='flex items-center gap-2 truncate'>
                              <Avatar className='w-6 h-6'>
                                <AvatarImage src={venue.avatarUrl || AVATAR_FALLBACK} />
                                <AvatarFallback>
                                  {venue.name.substring(0, 1).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className='truncate'>{formatVenueLabel(venue)}</span>
                            </div>
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
              </Command>
            </div>
          </ResponsivePopover>
        );
      }}
    />
  );
}
