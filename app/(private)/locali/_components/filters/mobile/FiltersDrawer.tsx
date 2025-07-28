'use client';

import { useState, useTransition } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { VenueManagerSelectData, VenuesTableFilters } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ListFilter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import VenueManagerSelect from './VenueManagerSelect';

export default function FiltersDrawer({
  filters,
  venueManagers,
}: {
  filters: VenuesTableFilters;
  venueManagers: VenueManagerSelectData[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState<string>(filters.name || '');
  const [address, setAddress] = useState<string>(filters.address || '');
  const [managerIds, setManagerIds] = useState<string[]>(
    filters.managerIds || []
  );

  const resetHandler = () => {
    setName('');
    setAddress('');
    setManagerIds([]);
  };

  const submitHandler = async () => {
    const params = new URLSearchParams();

    if (name.trim().length > 0) {
      params.set('name', name.trim());
    } else {
      params.delete('name');
    }

    if (address.trim().length > 0) {
      params.set('address', address.trim());
    } else {
      params.delete('address');
    }

    if (managerIds.length > 0) {
      params.set('manager', managerIds.join(','));
    } else {
      params.delete('manager');
    }

    params.set('page', '1');

    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`);
      setIsOpen(false);
    });
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DrawerTrigger asChild>
        <Button
          variant='secondary'
          size='sm'
        >
          <ListFilter />
          Filtri
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='flex flex-col gap-4 py-8 px-4'>
          <div className='flex justify-between items-center gap-2'>
            <DrawerTitle className='text-xl'>Filtri</DrawerTitle>
            <Button
              variant='ghost'
              size='sm'
              className='text-destructive'
              onClick={resetHandler}
            >
              Resetta
              <X />
            </Button>
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Nome</div>
            <Input
              placeholder='La Madunina'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Indirizzo</div>
            <Input
              type='address'
              placeholder='Via Duomo 1'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Manager</div>
            <VenueManagerSelect
              initialValue={managerIds}
              venueManagers={venueManagers}
              onConfirm={setManagerIds}
            />
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              disabled={isPending}
              onClick={() => setIsOpen(false)}
            >
              Annulla
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
      </DrawerContent>
    </Drawer>
  );
}
