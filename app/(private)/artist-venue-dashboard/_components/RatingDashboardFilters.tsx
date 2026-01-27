'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function RatingDashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentType = searchParams.get('type') ?? 'artist';
  const currentSort = searchParams.get('sort') ?? 'desc';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.set('page', '1');

    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`);
    });
  };

  return (
    <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
      <div className='flex items-center gap-2'>
        <span className='text-xs uppercase text-zinc-500'>Tipo</span>
        <Select
          value={currentType}
          onValueChange={(value) => updateParam('type', value)}
          disabled={isPending}
        >
          <SelectTrigger className='min-w-40'>
            <SelectValue placeholder='Seleziona' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='artist'>Artist</SelectItem>
            <SelectItem value='venue'>Venue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center gap-2'>
        <span className='text-xs uppercase text-zinc-500'>Ordina</span>
        <Select
          value={currentSort}
          onValueChange={(value) => updateParam('sort', value)}
          disabled={isPending}
        >
          <SelectTrigger className='min-w-40'>
            <SelectValue placeholder='Seleziona' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='desc'>Rating (DESC)</SelectItem>
            <SelectItem value='asc'>Rating (ASC)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
