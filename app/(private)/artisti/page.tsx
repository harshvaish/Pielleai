import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NEW_USER_TIME } from '@/lib/constants';
import { TablePagination } from '../_components/form/TablePagination';
import { ArtistsTableFilters } from '@/lib/types';
import FiltersButton from './_components/filters/FiltersButton';
import CreateButton from './_components/create/CreateButton';
import { hasRole, resolveNextPath, splitCsv } from '@/lib/utils';
import { getLanguagesCached } from '@/lib/cache/languages';
import { getCountriesCached } from '@/lib/cache/countries';
import { getArtistManagersCached } from '@/lib/cache/artist-managers';
import { getZonesCached } from '@/lib/cache/zones';
import { artistsTableFiltersSchema } from '@/lib/validation/filters/artists-table-filters-schema';
import { notFound, redirect } from 'next/navigation';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { getPaginatedArtists } from '@/lib/data/artists/get-paginated-artists';
import { getVenuesCached } from '@/lib/cache/venues';
import { getRecommendedArtists } from '@/lib/data/artists/get-recommended-artists';
import ArtistsBadge from '../_components/Badges/ArtistsBadge';
import StatusBadge from '../_components/Badges/StatusBadge';
import ManagersBadge from '../_components/Badges/ManagersBadge';
import ZonesBadge from '../_components/Badges/ZonesBadge';
import ArtistCard from './_components/ArtistCard';
import ExportButton from '../_components/ExportButton';
import { endOfDay, format, startOfDay } from 'date-fns';

export const dynamic = 'force-dynamic';

type ArtistsPageProps = {
  searchParams?: Promise<{
    page?: string;
    showFilters?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    manager?: string;
    zone?: string;
    recDate?: string;
    recBudget?: string;
    recVenueId?: string;
    debug?: string;
  }>;
};

export default async function ArtistsPage({ searchParams }: ArtistsPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['admin', 'artist-manager', 'venue-manager'])) {
    notFound();
  }

  const isAdmin = user.role === 'admin';
  const isArtistManager = user.role === 'artist-manager';
  const isVenueManager = user.role === 'venue-manager';

  const sp = await searchParams;
  const currentPage = Number(sp?.page ?? '1');

  const managersFilter = isAdmin
    ? splitCsv(sp?.manager)
    : isArtistManager
      ? [profileId!.toString()]
      : [];

  const filters: ArtistsTableFilters = {
    currentPage: currentPage,
    fullName: isVenueManager ? null : sp?.fullName || null,
    email: isVenueManager ? null : sp?.email || null,
    phone: isVenueManager ? null : sp?.phone || null,
    managerIds: isVenueManager ? [] : managersFilter,
    zoneIds: isVenueManager ? [] : splitCsv(sp?.zone),
  };

  const validation = artistsTableFiltersSchema.safeParse(filters);

  if (!validation.success) {
    notFound();
  }

  const [
    { data: artists, totalPages },
    languages,
    countries,
    artistManagers,
    zones,
    venuesList,
  ] = await Promise.all([
    getPaginatedArtists(filters),
    isVenueManager ? Promise.resolve([]) : getLanguagesCached(),
    isVenueManager ? Promise.resolve([]) : getCountriesCached(),
    isVenueManager ? Promise.resolve([]) : getArtistManagersCached(),
    isVenueManager ? Promise.resolve([]) : getZonesCached(),
    isVenueManager ? getVenuesCached(profileId as number) : Promise.resolve([]),
  ]);

  const recommendedDate = sp?.recDate ?? format(new Date(), 'yyyy-MM-dd');
  const recommendedVenueId = sp?.recVenueId ?? venuesList[0]?.id?.toString();
  const recommendedBudget = sp?.recBudget;
  const debugEnabled = sp?.debug === '1';

  const hasRecommendedBudget =
    recommendedBudget !== undefined && recommendedBudget !== null && recommendedBudget !== '';

  const recommendedResult =
    isVenueManager && recommendedVenueId && recommendedDate && hasRecommendedBudget
      ? await getRecommendedArtists({
          venueId: Number(recommendedVenueId),
          startDate: startOfDay(new Date(recommendedDate)),
          endDate: endOfDay(new Date(recommendedDate)),
          budget: Number(recommendedBudget),
          limit: 6,
          includeDebug: debugEnabled,
        })
      : { data: [], debug: undefined };

  const recommendedArtists = recommendedResult.data;
  const recommendedDebug = recommendedResult.debug;

  const preservedParams = Object.entries(sp ?? {}).filter(
    ([key]) => !['recDate', 'recBudget', 'recVenueId'].includes(key),
  );

  return (
    <div className='h-full grid grid-rows-[min-content_1fr_min-content] gap-2'>
      <div className='md:flex justify-between items-center gap-2'>
        <h1 className='text-2xl font-bold'>Artisti</h1>
        {!isVenueManager && (
          <div className='flex items-center gap-2 mt-2 md:mt-0'>
            {isAdmin && (
              <ExportButton
                endpoint='/api/artists/export'
                filename='export-artisti.csv'
              />
            )}
            <FiltersButton
              isAdmin={isAdmin}
              filters={filters}
              artistManagers={artistManagers}
              zones={zones}
            />

            <CreateButton
              userRole={user.role}
              userProfileId={profileId as number}
              languages={languages}
              countries={countries}
              zones={zones}
              artistManagers={artistManagers}
            />
          </div>
        )}
      </div>

      {/* artists table section */}
      {artists.length > 0 ? (
        isVenueManager ? (
          <div className='flex flex-col gap-6'>
            <section className='bg-white rounded-2xl p-4 border border-zinc-100'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='text-sm font-semibold'>Artisti consigliati</div>
              </div>

              {venuesList.length === 0 ? (
                <div className='text-sm text-zinc-500 mt-3'>
                  Nessun locale associato al profilo.
                </div>
              ) : (
                <form
                  method='get'
                  className='mt-4 grid gap-3 md:grid-cols-[minmax(140px,200px)_minmax(140px,200px)_minmax(180px,1fr)_auto]'
                >
                  {preservedParams.map(([key, value]) => (
                    <input
                      key={key}
                      type='hidden'
                      name={key}
                      value={value ?? ''}
                    />
                  ))}
                  <div className='flex flex-col gap-1'>
                    <label className='text-xs font-semibold text-zinc-600'>Data</label>
                    <input
                      type='date'
                      name='recDate'
                      defaultValue={recommendedDate}
                      className='h-9 rounded-md border border-zinc-200 px-3 text-sm'
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-xs font-semibold text-zinc-600'>Budget (€)</label>
                    <input
                      type='number'
                      name='recBudget'
                      min='0'
                      step='1'
                      defaultValue={recommendedBudget ?? ''}
                      placeholder='Es. 800'
                      className='h-9 rounded-md border border-zinc-200 px-3 text-sm'
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-xs font-semibold text-zinc-600'>Locale</label>
                    <select
                      name='recVenueId'
                      defaultValue={recommendedVenueId}
                      className='h-9 rounded-md border border-zinc-200 px-3 text-sm bg-white'
                    >
                      {venuesList.map((venue) => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='flex items-end'>
                    <button className='h-9 px-4 rounded-md bg-zinc-900 text-white text-sm font-semibold'>
                      Applica
                    </button>
                  </div>
                </form>
              )}

              {recommendedVenueId && hasRecommendedBudget && (
                <div className='mt-4 grid gap-3 md:grid-cols-2'>
                  {recommendedArtists.length === 0 ? (
                    <div className='text-sm text-zinc-500'>
                      Nessun artista corrisponde ai filtri per questa data.
                    </div>
                  ) : (
                    recommendedArtists.map((artist) => (
                      <div
                        key={artist.id}
                        className='flex items-center justify-between gap-4 rounded-xl border border-zinc-100 p-3'
                      >
                        <div className='min-w-0'>
                          <div className='text-sm font-semibold truncate'>{artist.stageName}</div>
                          <div className='text-xs text-zinc-500 truncate'>{artist.bio}</div>
                        </div>
                        <a
                          className='text-sm font-semibold text-zinc-900 hover:underline'
                          href={`/artisti/${artist.slug}`}
                        >
                          Dettagli
                        </a>
                      </div>
                    ))
                  )}
                </div>
              )}

              {!hasRecommendedBudget && (
                <div className='text-sm text-zinc-500 mt-3'>
                  Inserisci un budget per vedere i consigliati.
                </div>
              )}

              {debugEnabled && recommendedDebug && (
                <div className='mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600'>
                  <div className='text-xs font-semibold text-zinc-700 mb-2'>
                    Debug filtri consigliati
                  </div>
                  <div className='grid gap-1'>
                    <div>Artisti attivi: {recommendedDebug.totalActive}</div>
                    <div>
                      Capienza match ({recommendedDebug.venueType}):{" "}
                      {recommendedDebug.capacityMatch}
                    </div>
                    <div>Disponibili (dopo conflitti): {recommendedDebug.availabilityOk}</div>
                    <div>Blocchi indisponibilità: {recommendedDebug.blockedAvailabilityCount}</div>
                    <div>Conflitti eventi: {recommendedDebug.eventConflictCount}</div>
                    <div>Candidati pre-budget: {recommendedDebug.candidatesBeforeBudget}</div>
                    <div>Cachet disponibili: {recommendedDebug.cachetKnownCount}</div>
                    <div>Cachet mancanti: {recommendedDebug.missingCachetCount}</div>
                    <div>
                      Budget ok{" "}
                      {recommendedDebug.budget !== null ? `(${recommendedDebug.budget}€)` : ""}:
                      {recommendedDebug.budgetOk}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <details className='group'>
              <summary className='list-none inline-flex items-center h-9 px-4 rounded-md bg-zinc-900 text-white text-sm font-semibold cursor-pointer'>
                <span className='group-open:hidden'>Vedi tutti gli artisti</span>
                <span className='hidden group-open:inline'>Nascondi elenco</span>
              </summary>
              <div className='mt-4 grid xl:grid-cols-2 gap-8'>
                {artists.map((artist, index) => (
                  <ArtistCard
                    key={index}
                    artist={artist}
                  />
                ))}
              </div>
              {artists.length > 0 && (
                <div className='mt-6'>
                  <TablePagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    searchParams={sp ?? {}}
                  />
                </div>
              )}
            </details>
          </div>
        ) : (
          <Table className='w-full'>
            <TableHeader className='bg-zinc-50'>
              <TableRow>
                <TableHead>Nome completo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Numero di telefono</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Area di interesse</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {artists.map((artist, index) => {
                const isDisabled = artist.status === 'disabled';
                const isNew =
                  new Date().getTime() - new Date(artist.createdAt).getTime() < NEW_USER_TIME;

                const badgeStatus = isDisabled ? 'disabled' : isNew ? 'new' : undefined;

                return (
                  <TableRow
                    key={index}
                    className={isDisabled ? 'text-zinc-400' : ''}
                  >
                    <TableCell>
                      <div className='flex items-center flex-nowrap gap-3'>
                        <ArtistsBadge
                          artists={[artist]}
                          userRole={user.role}
                        />
                        {badgeStatus && <StatusBadge status={badgeStatus} />}
                      </div>
                    </TableCell>
                    <TableCell>{artist.email}</TableCell>
                    <TableCell>{artist.phone}</TableCell>
                    <TableCell>
                      <ManagersBadge
                        userRole={user.role}
                        managers={artist.managers}
                        pathSegment='manager-artisti'
                      />
                    </TableCell>
                    <TableCell>
                      <ZonesBadge zones={artist.zones} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )
      ) : (
        <section className='max-h-80 flex flex-col justify-center items-center bg-white rounded-2xl p-8'>
          <h2 className='text-base font-bold'>Nessun artista</h2>
          <div className='text-sm font-medium text-zinc-400'>
            Aggiungine uno per vederlo nella lista
          </div>
        </section>
      )}

      {!isVenueManager && artists.length > 0 && (
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
          searchParams={sp ?? {}}
        />
      )}
    </div>
  );
}
