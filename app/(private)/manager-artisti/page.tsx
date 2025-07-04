import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import CreateArtistManagerButton from './_components/CreateArtistsManagerButton';
import { getPaginatedArtistManagers } from '@/lib/data/artist-manager/get-paginated-artist-managers';
import { getLanguages } from '@/lib/data/get-languages';
import { getCountries } from '@/lib/data/get-countries';
import { notFound } from 'next/navigation';
import { TablePagination } from './_components/TablePagination';
import UserBadge from './_components/UserBadge';
import StatusBadge from './_components/StatusBadge';
import { NEW_USER_TIME } from '@/lib/constants';

export default async function ArtistManagersPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const currentPage = Number(sp?.page ?? '1');

  const [{ data: managers, totalPages }, languages, countries] =
    await Promise.all([
      getPaginatedArtistManagers(currentPage),
      getLanguages(),
      getCountries(),
    ]).catch((error) => {
      console.error('❌ Error fetching:', error);
      notFound();
    });

  return (
    <div className='h-full grid grid-rows-[min-content_1fr_min-content] gap-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Manager Artisti</h1>
        <CreateArtistManagerButton
          languages={languages}
          countries={countries}
        />
      </div>
      {/* artist managers table section */}
      {managers.length > 0 ? (
        <section className='bg-white overflow-auto rounded-2xl border group-has-[[data-pending]]:animate-pulse'>
          <Table className='w-full'>
            <TableHeader className='bg-zinc-50'>
              <TableRow>
                <TableHead>Nome completo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Numero di telefono</TableHead>
                <TableHead>Artisti</TableHead>
                <TableHead>Ragione sociale</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {managers.map((manager, index) => {
                const isDisabled = manager.status === 'disabled';
                const isNew =
                  new Date().getTime() - new Date(manager.createdAt).getTime() <
                  NEW_USER_TIME;

                const badgeStatus = isDisabled
                  ? 'disabled'
                  : isNew
                    ? 'new'
                    : undefined;

                return (
                  <TableRow
                    key={index}
                    className={isDisabled ? 'text-zinc-400' : ''}
                  >
                    <TableCell>
                      <div className='flex items-center flex-nowrap gap-3'>
                        <UserBadge
                          name={manager.name}
                          surname={manager.surname}
                          avatarUrl={manager.avatarUrl}
                          isDisabled={isDisabled}
                          href={`/manager-artisti/${manager.id}`}
                        />
                        {badgeStatus && <StatusBadge status={badgeStatus} />}
                      </div>
                    </TableCell>
                    <TableCell>{manager.email}</TableCell>
                    <TableCell>{manager.phone}</TableCell>
                    <TableCell>Nessun artista</TableCell>
                    <TableCell>{manager.company}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </section>
      ) : (
        <section className='bg-white rounded-2xl'>
          <h2 className='text-base font-bold'>Nessun manager artista</h2>
          <div className='text-sm font-medium text-zinc-400'>
            Aggiungine uno per vederlo nella lista
          </div>
        </section>
      )}
      {managers.length > 0 && (
        <TablePagination
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}
