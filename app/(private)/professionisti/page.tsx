import { notFound, redirect } from 'next/navigation';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { hasRole, resolveNextPath } from '@/lib/utils';
import { ProfessionalsTableFilters } from '@/lib/types';
import { professionalsFiltersSchema } from '@/lib/validation/filters/professionals-filters-schema';
import { getPaginatedProfessionals } from '@/lib/data/professionals/get-paginated-professionals';
import { TablePagination } from '../_components/form/TablePagination';
import ProfessionalsTable from './_components/ProfessionalsTable';
import { getEventOptions } from '@/lib/data/events/get-event-options';
import ExportButton from '../_components/ExportButton';
import FiltersButton from './_components/filters/FiltersButton';
import CreateButton from './_components/create/CreateButton';

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
    <div className='h-full min-h-0 grid grid-rows-[min-content_1fr_min-content] gap-2'>
      <div className='md:flex justify-between items-center gap-2'>
        <h1 className='text-2xl font-bold'>Professionisti</h1>
        <div className='flex items-center gap-2 mt-2 md:mt-0'>
          {isAdmin && (
            <ExportButton
              endpoint='/api/professionals/export'
              filename='export-professionisti.csv'
            />
          )}
          <FiltersButton
            filters={filters}
            showEventFilter={isAdmin}
            eventOptions={eventOptions}
          />
          {isAdmin && <CreateButton />}
        </div>
      </div>

      <div className='min-h-0 overflow-y-auto pr-1'>
        <ProfessionalsTable initialProfessionals={data} isAdmin={isAdmin} />
      </div>

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
