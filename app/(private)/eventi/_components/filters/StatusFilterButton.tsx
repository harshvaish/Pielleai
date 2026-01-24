'use client';

import { Button } from '@/components/ui/button';
import { EventStatus } from '@/lib/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

type StatusFilterButtonProps = {
  status: EventStatus;
  label: string;
  singleSelect?: boolean;
};

export default function StatusFilterButton({
  status,
  label,
  singleSelect = false,
}: StatusFilterButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectedStatuses = searchParams.get('status')?.split(',') ?? [];
  const isActive = selectedStatuses.includes(status);

  const onClickHandler = () => {
    const params = new URLSearchParams(searchParams.toString());

    let newStatuses: string[];

    if (isActive) {
      // Remove the clicked status
      newStatuses = selectedStatuses.filter((s) => s !== status);
    } else if (singleSelect) {
      // Replace previous selection when behaving like tabs
      newStatuses = [status];
    } else {
      // Add the clicked status
      newStatuses = [...selectedStatuses, status];
    }

    if (newStatuses.length > 0) {
      params.set('status', newStatuses.join(','));
    } else {
      params.delete('status');
    }

    params.set('page', '1'); // Reset to page 1 when filtering

    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`);
    });
  };

  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      size='xs'
      onClick={onClickHandler}
      disabled={isPending}
    >
      {label}
    </Button>
  );
}
