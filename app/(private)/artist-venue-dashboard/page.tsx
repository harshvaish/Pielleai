import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '../_components/form/TablePagination';
import RatingDashboardFilters from './_components/RatingDashboardFilters';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { hasRole, resolveNextPath } from '@/lib/utils';
import { ratingDashboardFiltersSchema } from '@/lib/validation/filters/rating-dashboard-filters-schema';
import { RatingDashboardFilters as RatingFilters } from '@/lib/types';
import { getRatingDashboard } from '@/lib/data/ratings/get-rating-dashboard';

export const dynamic = 'force-dynamic';

type ArtistVenueDashboardPageProps = {
  searchParams?: Promise<{
    page?: string;
    type?: string;
    sort?: string;
  }>;
};

const ratingFormatter = new Intl.NumberFormat('it-IT', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default async function ArtistVenueDashboardPage({ searchParams }: ArtistVenueDashboardPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['admin'])) {
    notFound();
  }

  const sp = await searchParams;
  const currentPage = Number(sp?.page ?? '1');

  const filters: RatingFilters = {
    currentPage,
    type: (sp?.type as RatingFilters['type']) ?? 'artist',
    sort: (sp?.sort as RatingFilters['sort']) ?? 'desc',
  };

  const validation = ratingDashboardFiltersSchema.safeParse(filters);
  if (!validation.success) {
    notFound();
  }

  const { data, totalPages } = await getRatingDashboard(filters);

  const tableTitle = filters.type === 'artist' ? 'Artist' : 'Venue';
  const profileBasePath = filters.type === 'artist' ? '/artisti' : '/locali';

  return (
    <div className='h-full grid grid-rows-[min-content_min-content_1fr_min-content] gap-3'>
      <div className='flex items-center justify-between gap-3'>
        <h1 className='text-xl md:text-2xl font-bold'>Artist & Venue Dashboard</h1>
      </div>

      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3'>
        <RatingDashboardFilters />
      </div>

      <div className='bg-white rounded-2xl border border-zinc-100 overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{tableTitle}</TableHead>
              <TableHead className='w-40 text-right'>Rating medio</TableHead>
              <TableHead className='w-40 text-right'>Recensioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row) => (
                <TableRow key={`${filters.type}-${row.id}`}>
                  <TableCell>
                    <Link
                      href={`${profileBasePath}/${row.slug}`}
                      className='font-medium text-zinc-900 hover:underline'
                      prefetch={false}
                    >
                      {row.name}
                    </Link>
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {ratingFormatter.format(row.averageRating)}
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>
                    {row.totalReviews}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className='text-center text-sm text-zinc-500 py-8'>
                  Nessun elemento disponibile.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <TablePagination
          currentPage={filters.currentPage}
          totalPages={totalPages}
          searchParams={{
            type: filters.type,
            sort: filters.sort,
          }}
        />
      )}
    </div>
  );
}
