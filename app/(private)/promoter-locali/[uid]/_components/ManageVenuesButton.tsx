'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VenueSelectData } from '@/lib/types';
import { useEffect, useState, useTransition } from 'react';
import { updateManagedVenues } from '@/lib/server-actions/venue-managers/update-managed-venues';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

type ManageVenuesButtonProps = {
  managerProfileId: number;
  venues: VenueSelectData[];
  initialVenueIds: number[];
};

export default function ManageVenuesButton({
  managerProfileId,
  venues,
  initialVenueIds,
}: ManageVenuesButtonProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number[]>(initialVenueIds);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(initialVenueIds);
  }, [initialVenueIds]);

  const handleAddVenue = (venueId: string) => {
    const id = parseInt(venueId, 10);
    if (value.includes(id)) return;
    setValue((prev) => [...prev, id]);
  };

  const handleRemoveVenue = (venueId: number) => {
    setValue((prev) => prev.filter((id) => id !== venueId));
  };

  const onSave = () => {
    startTransition(async () => {
      const response = await updateManagedVenues(managerProfileId, value);
      if (response.success) {
        toast.success('Locali gestiti aggiornati!');
        setOpen(false);
      } else {
        toast.error(response.message || 'Aggiornamento locali gestiti non riuscito.');
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      modal
    >
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
        >
          <MapPin />
          Associa / disassocia locali
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-xl'>
        <DialogTitle>Gestione locali</DialogTitle>
        <DialogDescription>
          Seleziona i locali da associare o rimuovere dalla gestione.
        </DialogDescription>

        <div className='flex flex-col gap-3'>
          <Select onValueChange={handleAddVenue}>
            <SelectTrigger size='sm'>Seleziona uno o piu&apos; locali</SelectTrigger>
            <SelectContent>
              {venues.map((venue) => {
                const isSelected = value.includes(venue.id);
                return (
                  <SelectItem
                    key={venue.id}
                    value={venue.id.toString()}
                    disabled={isSelected}
                  >
                    {venue.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {value.length > 0 && (
            <div className='w-full flex flex-nowrap gap-1 overflow-x-auto'>
              {value.map((venueId) => {
                const venue = venues.find((item) => item.id === venueId);
                if (!venue) return null;
                return (
                  <Badge
                    key={venueId}
                    variant='outline'
                    className='group transition-colors hover:cursor-pointer hover:text-destructive hover:border-destructive'
                    onClick={() => handleRemoveVenue(venueId)}
                  >
                    {venue.name}
                  </Badge>
                );
              })}
            </div>
          )}

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Annulla
            </Button>
            <Button
              type='button'
              onClick={onSave}
              disabled={isPending}
            >
              {isPending ? 'Salvataggio...' : 'Salva'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
