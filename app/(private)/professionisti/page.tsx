import { notFound, redirect } from 'next/navigation';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { hasRole, resolveNextPath } from '@/lib/utils';
import { ProfessionalsTableFilters } from '@/lib/types';
import { professionalsFiltersSchema } from '@/lib/validation/filters/professionals-filters-schema';
import { getPaginatedProfessionals } from '@/lib/data/professionals/get-paginated-professionals';
import { TablePagination } from '../_components/form/TablePagination';
import ProfessionalsFilters from './_components/ProfessionalsFilters';
import ProfessionalsTable from './_components/ProfessionalsTable';
import { getEventOptions } from '@/lib/data/events/get-event-options';

export const dynamic = 'force-dynamic';

type ProfessionalsPageProps = {
  searchParams?: Promise<{
    page?: string;
    fullName?: string;
    role?: string;
    event?: string;
  }>;
};

export default async function ProfessionalsPage({ searchParams }: ProfessionalsPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['admin', 'artist-manager'])) {
    notFound();
  }

  const sp = await searchParams;
  const currentPage = Number(sp?.page ?? '1');

  const filters: ProfessionalsTableFilters = {
    currentPage,
    fullName: sp?.fullName || null,
    role: (sp?.role as ProfessionalsTableFilters['role']) ?? null,
    eventId: sp?.event ?? null,
  };

  const validation = professionalsFiltersSchema.safeParse(filters);
  if (!validation.success) {
    notFound();
  }

  const isAdmin = user.role === 'admin';

  const [{ data, totalPages }, eventOptions] = await Promise.all([
    getPaginatedProfessionals(filters),
    isAdmin ? getEventOptions() : Promise.resolve([]),
  ]);

  return (
    <div className='h-full grid grid-rows-[min-content_min-content_1fr_min-content] gap-3'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl md:text-2xl font-bold'>Professionisti</h1>
      </div>

      <ProfessionalsFilters showEventFilter={isAdmin} eventOptions={eventOptions} />

      <ProfessionalsTable initialProfessionals={data} isAdmin={isAdmin} />

      {totalPages > 1 && (
        <TablePagination
          currentPage={filters.currentPage}
          totalPages={totalPages}
          searchParams={{
            fullName: filters.fullName ?? undefined,
            role: filters.role ?? undefined,
            event: filters.eventId ?? undefined,
          }}
        />
      )}
    </div>
  );
}
