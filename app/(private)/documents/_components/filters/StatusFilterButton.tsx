'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export type ContractFilterStatus =
  | 'all'
  | 'to-sign'
  | 'signed'
  | 'refused'
  | 'error'
  | 'archived';

type StatusFilterButtonProps = {
  status: ContractFilterStatus;
  label: string;
};

export default function StatusFilterButton({ status, label }: StatusFilterButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectedStatuses = searchParams.get('status')?.split(',') ?? [];
  const noStatusSelected = selectedStatuses.length === 0;
  const isDeclined = status === 'refused' && selectedStatuses.includes('declined');
  const isActive =
    status === 'all'
      ? noStatusSelected || selectedStatuses.includes('all')
      : selectedStatuses.includes(status) || isDeclined;

  const onClickHandler = () => {
    const params = new URLSearchParams(searchParams.toString());
    const apiStatus = status === 'refused' ? 'declined' : status;

    if (status === 'all') {
      params.delete('status'); // default view shows all
    } else {
      params.set('status', apiStatus);
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
