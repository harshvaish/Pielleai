'use client';

import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function CategoriesBadge({ categories }: { categories: string[] }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const count = categories.length;

  if (!count) return <span className='text-sm font-medium text-zinc-500'>-</span>;

  if (count === 1) {
    return (
      <Badge variant='secondary'>
        {categories[0]}
      </Badge>
    );
  }

  const firstCategory = categories[0];

  return (
    <DropdownMenu
      open={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
    >
      <DropdownMenuTrigger className='w-max max-w-60 flex flex-nowrap items-center gap-2 bg-zinc-50 hover:bg-zinc-100 p-2 rounded-md transition-colors'>
        <Badge
          variant='secondary'
          className='max-w-40 truncate'
        >
          {firstCategory}
        </Badge>
        <span className='text-xs font-semibold text-zinc-700 whitespace-nowrap'>
          +{count - 1}
        </span>
        <ChevronDown
          className={cn('size-4 transition-transform', isDropdownOpen ? 'rotate-180' : '')}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className='flex flex-col gap-2 p-2'>
        {categories.map((category, index) => (
          <Badge
            key={`${category}-${index}`}
            variant='secondary'
            className='w-full justify-start'
          >
            {category}
          </Badge>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

