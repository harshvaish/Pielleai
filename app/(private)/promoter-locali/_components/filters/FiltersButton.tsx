'use client';

import { Button } from '@/components/ui/button';
import { Eraser, ListFilter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { VenueManagersTableFilters, VenueSelectData } from '@/lib/types';
import ResponsivePopover from '@/app/_components/ResponsivePopover';
import { Input } from '@/components/ui/input';
import VenueSelect from '@/app/(private)/_components/filters/VenueSelect';

type FiltersButtonProps = {
  filters: VenueManagersTableFilters;
  venues: VenueSelectData[];
};

export default function FiltersButton({ filters, venues }: FiltersButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const active = Boolean(filters.fullName || filters.email || filters.phone || filters.venueIds.length);

  const [fullName, setFullName] = useState<string>(filters.fullName || '');
  const [email, setEmail] = useState<string>(filters.email || '');
  const [phone, setPhone] = useState<string>(filters.phone || '');
  const [venueIds, setVenueIds] = useState<string[]>(filters.venueIds || []);

  const resetHandler = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setVenueIds([]);
  };

  const submitHandler = async () => {
    const params = new URLSearchParams();

    if (fullName.trim().length > 0) {
      params.set('fullName', fullName.trim());
    } else {
      params.delete('fullName');
    }

    if (email.trim().length > 0) {
      params.set('email', email.trim());
    } else {
      params.delete('email');
    }

    if (phone.trim().length > 0) {
      params.set('phone', phone.trim());
    } else {
      params.delete('phone');
    }

    if (venueIds.length > 0) {
      params.set('venue', venueIds.join(','));
    } else {
      params.delete('venue');
    }

    params.set('page', '1');

    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`);
      setOpen(false);
    });
  };

  return (
    <ResponsivePopover
      open={open}
      onOpenChange={setOpen}
      title='Filtri'
      description='Inserisci i dati di tuo interesse per vedere la tabella fitrata.'
      trigger={
        <Button
          disabled={isPending}
          variant={active ? 'secondary' : 'outline'}
          size='sm'
        >
          <ListFilter />
          Filtri
        </Button>
      }
    >
      <div className='py-4 space-y-4'>
        <div className='grid sm:grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Nome completo</div>
            <Input
              placeholder='Mario Rossi'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Email</div>
            <Input
              type='email'
              placeholder='info@eaglebooking.it'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className='grid sm:grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Numero di telefono</div>
            <Input
              placeholder='+39 123456789'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Locali</div>
            <VenueSelect
              initialValue={venueIds}
              venues={venues}
              onConfirm={setVenueIds}
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={resetHandler}
          >
            <Eraser />
            Pulisci
          </Button>
          <Button
            size='sm'
            disabled={isPending}
            onClick={submitHandler}
          >
            {isPending ? 'Filtro...' : 'Conferma'}
          </Button>
        </div>
      </div>
    </ResponsivePopover>
  );
}
