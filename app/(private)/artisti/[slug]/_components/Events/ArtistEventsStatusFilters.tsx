'use client';

import { Button } from '@/components/ui/button';
import { EVENT_STATUS_LABELS } from '@/lib/constants';
import { EventStatus } from '@/lib/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const DEFAULT_STATUSES: EventStatus[] = ['proposed', 'pre-confirmed', 'confirmed'];
const ALL_STATUSES: EventStatus[] = [...DEFAULT_STATUSES, 'ended', 'rejected'];

export default function ArtistEventsStatusFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const rawStatuses = searchParams.get('status')?.split(',').filter(Boolean) ?? [];
  const selectedStatuses =
    rawStatuses.length > 0 ? (rawStatuses as EventStatus[]) : DEFAULT_STATUSES;

  const onToggle = (status: EventStatus) => {
    const isActive = selectedStatuses.includes(status);
    if (isActive && selectedStatuses.length === 1) return;

    const nextStatuses = isActive
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];

    const params = new URLSearchParams(searchParams.toString());
    params.set('status', nextStatuses.join(','));
    params.set('page', '1');

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className='max-w-full bg-white flex items-center gap-1 p-1 rounded-2xl overflow-auto'>
      {ALL_STATUSES.map((status) => {
        const isActive = selectedStatuses.includes(status);
        return (
          <Button
            key={status}
            variant={isActive ? 'secondary' : 'ghost'}
            size='sm'
            onClick={() => onToggle(status)}
            disabled={isPending}
          >
            {EVENT_STATUS_LABELS[status]}
          </Button>
        );
      })}
    </div>
  );
}
