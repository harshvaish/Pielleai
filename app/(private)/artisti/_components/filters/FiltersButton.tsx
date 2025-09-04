'use client';

import { Button } from '@/components/ui/button';
import { Eraser, ListFilter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { ArtistManagerSelectData, ArtistsTableFilters, Zone } from '@/lib/types';
import ResponsivePopover from '@/app/_components/ResponsivePopover';
import { Input } from '@/components/ui/input';
import ArtistManagerSelect from '@/app/(private)/_components/filters/ArtistManagerSelect';
import ZoneSelect from '@/app/(private)/_components/filters/ZoneSelect';

type FiltersButtonProps = {
  isAdmin: boolean;
  filters: ArtistsTableFilters;
  artistManagers: ArtistManagerSelectData[];
  zones: Zone[];
};

export default function FiltersButton({
  isAdmin,
  filters,
  artistManagers,
  zones,
}: FiltersButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const active = Boolean(
    filters.fullName ||
      filters.email ||
      filters.phone ||
      (isAdmin ? filters.managerIds.length : false) ||
      filters.zoneIds.length,
  );

  const [fullName, setFullName] = useState<string>(filters.fullName || '');
  const [email, setEmail] = useState<string>(filters.email || '');
  const [phone, setPhone] = useState<string>(filters.phone || '');
  const [managerIds, setManagerIds] = useState<string[]>(filters.managerIds || []);
  const [zoneIds, setZoneIds] = useState<string[]>(filters.zoneIds || '');

  const resetHandler = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setManagerIds([]);
    setZoneIds([]);
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

    if (isAdmin && managerIds.length > 0) {
      params.set('manager', managerIds.join(','));
    } else {
      params.delete('manager');
    }

    if (zoneIds.length > 0) {
      params.set('zone', zoneIds.join(','));
    } else {
      params.delete('zone');
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

        <div className='flex flex-col'>
          <div className='text-sm font-semibold mb-2'>Numero di telefono</div>
          <Input
            placeholder='+39 123456789'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {isAdmin && (
          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Manager</div>
            <ArtistManagerSelect
              initialValue={managerIds}
              artistManagers={artistManagers}
              onConfirm={setManagerIds}
            />
          </div>
        )}

        <div className='flex flex-col'>
          <div className='text-sm font-semibold mb-2'>Area di interesse</div>
          <ZoneSelect
            initialValue={zoneIds}
            zones={zones}
            onConfirm={setZoneIds}
          />
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
