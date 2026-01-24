'use client';

import { Button } from '@/components/ui/button';
import { VenueSelectData } from '@/lib/types';
import { ListFilter } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import ResponsivePopover from '@/app/_components/ResponsivePopover';
import VenueSelect from '@/app/(private)/_components/filters/VenueSelect';

type ArtistEventsVenueFilterProps = {
  venues: VenueSelectData[];
};

export default function ArtistEventsVenueFilter({ venues }: ArtistEventsVenueFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const venueParam = searchParams.get('venue') ?? '';
  const initialVenueIds = venueParam.split(',').filter(Boolean);
  const [venueIds, setVenueIds] = useState<string[]>(initialVenueIds);

  const active = venueIds.length > 0;

  useEffect(() => {
    setVenueIds(initialVenueIds);
  }, [venueParam]);

  const submitHandler = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (venueIds.length > 0) {
      params.set('venue', venueIds.join(','));
    } else {
      params.delete('venue');
    }

    params.set('page', '1');
    setOpen(false);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <ResponsivePopover
      open={open}
      onOpenChange={setOpen}
      title='Filtro locali'
      description=''
      isDescriptionHidden={true}
      trigger={
        <Button
          variant={active ? 'secondary' : 'outline'}
          size='xs'
          disabled={isPending}
        >
          <ListFilter />
          Locali
        </Button>
      }
    >
      <div className='py-4'>
        <VenueSelect
          initialValue={venueIds}
          venues={venues}
          onConfirm={setVenueIds}
        />
      </div>
      <div className='grid grid-cols-2 gap-2'>
        <Button
          variant='ghost'
          size='xs'
          onClick={() => setVenueIds([])}
        >
          Pulisci
        </Button>
        <Button
          size='xs'
          onClick={submitHandler}
          disabled={isPending}
        >
          {isPending ? 'Filtro...' : 'Conferma'}
        </Button>
      </div>
    </ResponsivePopover>
  );
}
