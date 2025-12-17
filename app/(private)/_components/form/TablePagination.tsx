import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type TablePaginationProps = {
  currentPage: number;
  totalPages: number;
  searchParams?: Record<string, string | string[] | undefined>;
};

export function TablePagination({ currentPage, totalPages, searchParams }: TablePaginationProps) {
  const buildHref = (page: number) => {
    const params = new URLSearchParams();

    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (!value || key === 'page') return;

        if (Array.isArray(value)) {
          const joined = value.join(',');
          if (joined) params.set(key, joined);
        } else {
          params.set(key, value);
        }
      });
    }

    params.set('page', String(page));
    const query = params.toString();
    return query ? `?${query}` : `?page=${page}`;
  };

  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage === 1) return [1, 2, 3];
    if (currentPage === totalPages) return [totalPages - 2, totalPages - 1, totalPages];

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const pages = getVisiblePages();

  return (
    <div className='flex items-center justify-center gap-2 text-xs md:text-sm font-medium'>
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        className={cn('flex items-center gap-2 p-2', currentPage === 1 && 'pointer-events-none text-zinc-400')}
      >
        <ChevronLeft className='size-4' /> Precedente
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={cn('w-8 aspect-square flex justify-center items-center rounded-lg transition-all', currentPage === page ? 'pointer-events-none bg-white border' : '')}
        >
          {page}
        </Link>
      ))}

      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        className={cn('flex items-center gap-2 p-2', currentPage === totalPages && 'pointer-events-none text-zinc-400')}
      >
        Successiva <ChevronRight className='size-4' />
      </Link>
    </div>
  );
}
