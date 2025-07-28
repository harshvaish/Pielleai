import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function TablePagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage === 1) return [1, 2, 3];
    if (currentPage === totalPages)
      return [totalPages - 2, totalPages - 1, totalPages];

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const pages = getVisiblePages();

  return (
    <div className='flex items-center justify-center gap-2 text-xs md:text-sm font-medium'>
      <Link
        href={`?page=${Math.max(1, currentPage - 1)}`}
        className={cn(
          'flex items-center gap-2 p-2',
          currentPage === 1 && 'pointer-events-none text-zinc-400'
        )}
      >
        <ChevronLeft size={16} /> Precedente
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={`?page=${page}`}
          className={cn(
            'w-8 aspect-square flex justify-center items-center rounded-lg transition-all',
            currentPage === page ? 'pointer-events-none bg-white border' : ''
          )}
        >
          {page}
        </Link>
      ))}

      <Link
        href={`?page=${Math.min(totalPages, currentPage + 1)}`}
        className={cn(
          'flex items-center gap-2 p-2',
          currentPage === totalPages && 'pointer-events-none text-zinc-400'
        )}
      >
        Successiva <ChevronRight size={16} />
      </Link>
    </div>
  );
}
