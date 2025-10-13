'use client';

import { Button } from '@/components/ui/button';
import { AlertCircleIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function ConflictFilterButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isActive = searchParams.get('conflict') === 'true';

  const onClickHandler = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (isActive) {
      // Remove the conflict filter
      params.delete('conflict');
    } else {
      // Add the conflict filter
      params.set('conflict', 'true');
    }

    params.set('page', '1'); // Reset to page 1 when filtering

    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`);
    });
  };

  return (
    <Button
      variant={isActive ? 'secondary' : 'outline'}
      size='sm'
      onClick={onClickHandler}
      disabled={isPending}
    >
      <AlertCircleIcon className='size-4' />
      Conflitto
    </Button>
  );
}
