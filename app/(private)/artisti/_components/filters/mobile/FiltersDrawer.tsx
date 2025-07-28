'use client';

import { useState, useTransition } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ArtistsTableFilters, ArtistManagerSelectData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ListFilter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import ArtistManagerSelect from './ArtistManagerSelect';

export default function FiltersDrawer({
  filters,
  artistManagers,
}: {
  filters: ArtistsTableFilters;
  artistManagers: ArtistManagerSelectData[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState<string>(filters.fullName || '');
  const [email, setEmail] = useState<string>(filters.email || '');
  const [managerIds, setManagerIds] = useState<string[]>(
    filters.managerIds || []
  );

  const resetHandler = () => {
    setFullName('');
    setEmail('');
    setManagerIds([]);
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

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Manager</div>
            <ArtistManagerSelect
              initialValue={managerIds}
              artistManagers={artistManagers}
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
