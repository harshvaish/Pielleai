'use client';

import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { VenueManagerSelectData, VenuesTableFilters } from '@/lib/types';
import FiltersDrawer from './mobile/FiltersDrawer';

export default function FiltersButton({
  filters,
  showFilters,
  venueManagers,
}: {
  filters: VenuesTableFilters;
  showFilters: boolean;
  venueManagers: VenueManagerSelectData[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const onClick = () => {
    const params = new URLSearchParams();

    if (showFilters) {
      params.delete('showFilters');
    } else {
      params.set('showFilters', 'true');
    }

    // Redirect to current route with new query params
    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`);
    });
  };

  if (isDesktop)
    return (
      <Button
        onClick={onClick}
        disabled={isPending}
        variant='secondary'
        size='sm'
        data-pending={isPending ? true : null}
      >
        <Search />
        {showFilters ? 'Nascondi ricerca' : 'Mostra ricerca'}
      </Button>
    );

  return (
    <FiltersDrawer
      filters={filters}
      venueManagers={venueManagers}
    />
  );
}
