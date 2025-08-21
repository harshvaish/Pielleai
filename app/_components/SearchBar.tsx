'use client';

import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { SearchItem } from '@/lib/types';
import { fetcher } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';
import { SpinnerLoading } from './SpinnerLoading';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

export default function SearchBar() {
  const [search, setSearch] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [items, setItems] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (value: string) => {
    setSearch(value);
    setOpen(value.trim().length > 0);
  };

  const resetHandler = () => {
    setSearch('');
    setOpen(false);
    setItems([]);
  };

  const [debouncedSearch] = useDebounce(search, 500);
  const fetchUrl = `/api/search?value=${debouncedSearch}`;

  const { data, error, isLoading } = useSWR(debouncedSearch ? fetchUrl : null, fetcher);

  useEffect(() => {
    setItems(data?.items ?? []);
  }, [data]);

  useEffect(() => {
    if (error) toast.error('Recupero suggerimenti ricerca non riuscito.');
  }, [error]);

  return (
    <Popover open={open}>
      {/* Use the input as the anchor (no trigger behavior) */}
      <PopoverAnchor asChild>
        <div className='relative w-full max-w-xs'>
          <div className='absolute top-0 left-0 w-8 h-10 flex justify-center items-center pointer-events-none hover:cursor-text'>
            <Search className='size-4 text-zinc-700' />
          </div>
          <Input
            ref={inputRef}
            id='search-bar'
            type='text'
            autoComplete='off'
            value={search}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setOpen(false);
            }}
            onFocus={() => {
              if (search.trim().length > 0) setOpen(true);
            }}
            placeholder='Cerca per artista, manager o locale'
            aria-expanded={open}
            className='bg-white pl-8'
          />
          {search.trim().length > 0 && (
            <div
              className='absolute top-0 right-0 w-8 h-10 flex justify-center items-center hover:cursor-pointer'
              onClick={resetHandler}
            >
              <X className='size-4 text-zinc-500' />
            </div>
          )}
        </div>
      </PopoverAnchor>

      <PopoverContent
        // prevent the content from stealing focus from the input
        onOpenAutoFocus={(e) => e.preventDefault()}
        onEscapeKeyDown={() => setOpen(false)}
        onInteractOutside={(e) => {
          const target = e.target as Node;
          if (inputRef.current && inputRef.current.contains(target)) {
            e.preventDefault(); // don't close when clicking input/anchor
            return;
          }
          setOpen(false);
        }}
        align='center'
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        className='p-2'
      >
        {isLoading ? (
          <SpinnerLoading />
        ) : items.length > 0 ? (
          <div>
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                prefetch={false}
                className='w-full flex items-center gap-2 p-1 rounded-md hover:bg-zinc-50'
              >
                <Avatar className='shrink-0 w-5 h-5'>
                  <AvatarImage
                    src={item.avatarUrl}
                    className='w-full'
                  />
                  <AvatarFallback>{item.fullName.substring(0, 1)}</AvatarFallback>
                </Avatar>
                <span className='grow text-xs font-medium truncate'>{item.fullName}</span>
                <span className='text-xs font-light text-zinc-400 truncate'>{item.role}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-sm font-normal p-1'>Nessun risultato.</div>
        )}
      </PopoverContent>
    </Popover>
  );
}
