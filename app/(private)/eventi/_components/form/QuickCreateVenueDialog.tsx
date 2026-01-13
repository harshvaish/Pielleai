'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UserRole, VenueSelectData } from '@/lib/types';
import { createVenueManager } from '@/lib/server-actions/venue-managers/create-venue-manager';
import { createVenue } from '@/lib/server-actions/venues/create-venue';

type QuickCreateVenueDialogProps = {
  onCreated: (venue: VenueSelectData) => void;
  userRole: UserRole;
};

export default function QuickCreateVenueDialog({
  onCreated,
  userRole,
}: QuickCreateVenueDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [shouldCreateManager, setShouldCreateManager] = useState(false);
  const [managerName, setManagerName] = useState('');
  const [managerSurname, setManagerSurname] = useState('');
  const [isPending, startTransition] = useTransition();

  const isAdmin = userRole === 'admin';

  const resetForm = () => {
    setName('');
    setAddress('');
    setShouldCreateManager(false);
    setManagerName('');
    setManagerSurname('');
  };

  const onSubmit = () => {
    const trimmedName = name.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName || trimmedName.length < 2) {
      toast.error('Inserisci il nome del locale.');
      return;
    }

    if (!trimmedAddress || trimmedAddress.length < 5) {
      toast.error("Inserisci l'indirizzo del locale.");
      return;
    }

    startTransition(async () => {
      let venueManagerId: number | undefined;

      if (isAdmin && shouldCreateManager) {
        if (!managerName.trim()) {
          toast.error('Inserisci il nome del promoter.');
          return;
        }

        const managerResponse = await createVenueManager({
          name: managerName.trim(),
          surname: managerSurname.trim(),
        });

        if (!managerResponse.success) {
          toast.error(managerResponse.message);
          return;
        }

        venueManagerId = managerResponse.data.profileId;
      }

      const response = await createVenue({
        name: trimmedName,
        address: trimmedAddress,
        ...(venueManagerId ? { venueManagerId } : {}),
      });

      if (response.success) {
        onCreated(response.data);
        toast.success('Locale creato!');
        resetForm();
        setOpen(false);
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          type='button'
          size='xs'
          variant='ghost'
          className='h-6 px-2 text-xs'
        >
          <Plus className='size-3' />
          Crea nuovo
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogTitle>Nuovo locale</DialogTitle>
        <div className='grid gap-3'>
          <Input
            placeholder='Nome locale *'
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            placeholder='Indirizzo *'
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
          {isAdmin && (
            <div className='grid gap-2'>
              <div className='flex items-center gap-2'>
                <Checkbox
                  checked={shouldCreateManager}
                  onCheckedChange={(checked) => setShouldCreateManager(Boolean(checked))}
                />
                <span className='text-sm'>Crea promoter per questo locale</span>
              </div>
              {shouldCreateManager && (
                <div className='grid grid-cols-2 gap-2'>
                  <Input
                    placeholder='Nome promoter *'
                    value={managerName}
                    onChange={(event) => setManagerName(event.target.value)}
                  />
                  <Input
                    placeholder='Cognome promoter'
                    value={managerSurname}
                    onChange={(event) => setManagerSurname(event.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              size='sm'
              variant='ghost'
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Annulla
            </Button>
            <Button
              type='button'
              size='sm'
              onClick={onSubmit}
              disabled={isPending}
            >
              {isPending ? 'Creo...' : 'Crea'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
