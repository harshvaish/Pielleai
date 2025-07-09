'use client';

import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function ToggleFiltersButton({
  showFilters,
}: {
  showFilters: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
}
