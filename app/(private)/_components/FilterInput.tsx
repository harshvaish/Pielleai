'use client';

import { SpinnerLoading } from '@/app/_components/SpinnerLoading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { HTMLInputTypeAttribute, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterInput({
  paramKey,
  defaultValue,
  type = 'text',
  placeholder = 'Cerca',
}: {
  paramKey: string;
  defaultValue: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState<string>(defaultValue);
  const [isPending, startTransition] = useTransition();

  const applyFilter = () => {
    if (!value || !value.trim().length) return;

    const params = new URLSearchParams(searchParams.toString());

    // Update param value
    if (value.trim()) {
      params.set(paramKey, value.trim());
    } else {
      params.delete(paramKey);
    }

    // Reset page to 1 when filtering
    params.set('page', '1');

    // Apply filter
    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`);
    });
  };

  return (
    <div className='relative min-w-40 mt-2'>
      <Input
        type={type}
        name={paramKey}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        className='bg-white pr-10'
        placeholder={placeholder}
        autoComplete='off'
        onKeyDown={(e) => {
          if (e.key === 'Enter') applyFilter();
        }}
      />
      <Button
        variant='ghost'
        size='icon'
        className='absolute top-1/2 right-1 transform -translate-y-1/2'
        onClick={applyFilter}
        disabled={isPending}
      >
        {isPending ? <SpinnerLoading /> : <Search className='h-4 w-4' />}
      </Button>
    </div>
  );
}
