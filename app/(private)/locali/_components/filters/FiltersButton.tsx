'use client';

import { Button } from '@/components/ui/button';
import { Eraser, ListFilter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { UserRole, VenueManagerSelectData, VenuesTableFilters } from '@/lib/types';
import ResponsivePopover from '@/app/_components/ResponsivePopover';
import { Input } from '@/components/ui/input';
import VenueManagerSelect from '@/app/(private)/_components/filters/VenueManagerSelect';
import VenueTypeSelect from '@/app/(private)/_components/filters/VenueTypeSelect';

type FiltersButtonProps = {
  userRole: UserRole;
  filters: VenuesTableFilters;
  venueManagers: VenueManagerSelectData[];
};

export default function FiltersButton({ userRole, filters, venueManagers }: FiltersButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const isAdmin = userRole === 'admin';

  const active = Boolean(
    filters.name ||
      filters.company ||
      filters.taxCode ||
      filters.address ||
      filters.types.length ||
      (isAdmin ? filters.managerIds.length : false) ||
      filters.capacity,
  );

  const [name, setName] = useState<string>(filters.name || '');
  const [company, setcompany] = useState<string>(filters.company || '');
  const [taxCode, setTaxCode] = useState<string>(filters.taxCode || '');
  const [address, setAddress] = useState<string>(filters.address || '');
  const [types, setTypes] = useState<string[]>(filters.types || []);
  const [managerIds, setManagerIds] = useState<string[]>(filters.managerIds || []);
  const [capacity, setCapacity] = useState<string>(filters.capacity || '');

  const resetHandler = () => {
    setName('');
    setcompany('');
    setTaxCode('');
    setAddress('');
    setTypes([]);
    setManagerIds([]);
    setCapacity('');
  };

  const submitHandler = async () => {
    const params = new URLSearchParams();

    if (name.trim().length > 0) {
      params.set('name', name.trim());
    } else {
      params.delete('name');
    }

    if (company.trim().length > 0) {
      params.set('company', company.trim());
    } else {
      params.delete('company');
    }

    if (taxCode.trim().length > 0) {
      params.set('taxCode', taxCode.trim());
    } else {
      params.delete('taxCode');
    }

    if (types.length > 0) {
      params.set('type', types.join(','));
    } else {
      params.delete('type');
    }

    if (isAdmin && managerIds.length > 0) {
      params.set('manager', managerIds.join(','));
    } else {
      params.delete('manager');
    }

    if (capacity.trim().length > 0) {
      params.set('capacity', capacity.trim());
    } else {
      params.delete('capacity');
    }

    params.set('page', '1');

    setOpen(false);

    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`);
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
          size='xs'
        >
          <ListFilter />
          Filtri
        </Button>
      }
    >
      <div className='py-4 space-y-4'>
        <div className='grid sm:grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Nome</div>
            <Input
              placeholder='Inserisci il nome del locale'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Ragione sociale</div>
            <Input
              type='company'
              placeholder='Inserisci la ragione sociale'
              value={company}
              onChange={(e) => setcompany(e.target.value)}
            />
          </div>
        </div>

        <div className='grid sm:grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Codice fiscale</div>
            <Input
              placeholder='Inserisci il codice fiscale'
              value={taxCode}
              onChange={(e) => setTaxCode(e.target.value)}
            />
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Indirizzo</div>
            <Input
              placeholder="Inserisci l'indirizzo"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <div className='grid sm:grid-cols-2 gap-4'>
          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Tipologia</div>
            <VenueTypeSelect
              initialValue={types}
              onConfirm={setTypes}
            />
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Capienza minima</div>
            <Input
              type='number'
              min={0}
              step={1}
              placeholder='Inserisci la capienza minima'
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
        </div>

        {isAdmin && (
          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Manager</div>
            <VenueManagerSelect
              initialValue={managerIds}
              venueManagers={venueManagers}
              onConfirm={setManagerIds}
            />
          </div>
        )}

        <div className='grid grid-cols-2 gap-4'>
          <Button
            variant='ghost'
            size='xs'
            onClick={resetHandler}
          >
            <Eraser />
            Pulisci
          </Button>
          <Button
            size='xs'
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
