'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VenueManagerSelectData } from '@/lib/types';
import { useEffect, useState, useTransition } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { updateVenueManagerAssignment } from '@/lib/server-actions/venues/update-venue-manager-assignment';
import { toast } from 'sonner';
import Image from 'next/image';
import { AVATAR_FALLBACK } from '@/lib/constants';
import { UserRoundCog } from 'lucide-react';

type ManageVenueManagerButtonProps = {
  venueId: number;
  venueManagers: VenueManagerSelectData[];
  initialManagerProfileId?: number | null;
};

export default function ManageVenueManagerButton({
  venueId,
  venueManagers,
  initialManagerProfileId = null,
}: ManageVenueManagerButtonProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number | null>(initialManagerProfileId);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(initialManagerProfileId ?? null);
  }, [initialManagerProfileId]);

  const onSave = () => {
    startTransition(async () => {
      const response = await updateVenueManagerAssignment(venueId, value);
      if (response.success) {
        toast.success('Promoter aggiornato!');
        setOpen(false);
      } else {
        toast.error(response.message || 'Aggiornamento promoter non riuscito.');
      }
    });
  };

  const selectedManager = venueManagers.find((manager) => manager.profileId === value);

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
          <UserRoundCog />
          Associa / disassocia promoter
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-xl'>
        <DialogTitle>Gestione promoter</DialogTitle>
        <DialogDescription>
          Seleziona un promoter da associare o rimuovi l&apos;associazione corrente.
        </DialogDescription>

        <div className='flex flex-col gap-3'>
          <Select
            value={value?.toString() ?? ''}
            onValueChange={(next) => setValue(next ? parseInt(next, 10) : null)}
          >
            <SelectTrigger size='sm'>
              {selectedManager
                ? `${selectedManager.name} ${selectedManager.surname}`
                : 'Seleziona un promoter'}
            </SelectTrigger>
            <SelectContent>
              {venueManagers.map((manager) => (
                <SelectItem
                  key={manager.profileId}
                  value={manager.profileId.toString()}
                >
                  <div className='flex items-center gap-2 flex-nowrap'>
                    <Image
                      src={manager.avatarUrl || AVATAR_FALLBACK}
                      alt='Immagine profilo promoter'
                      height={24}
                      width={24}
                      sizes='24px'
                      className='w-6 h-6 rounded-full'
                    />
                    {manager.name} {manager.surname}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className='flex justify-between gap-2'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => setValue(null)}
              disabled={isPending}
            >
              Rimuovi associazione
            </Button>
            <div className='flex gap-2'>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
