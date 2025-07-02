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

export default async function ArtistManagersPage() {
  const managers = await getPaginatedArtistManagers();
  return (
    <>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Manager Artisti</h1>
        <CreateArtistManagerButton />
      </div>
      {/* artist managers table section */}

      <section className='min-h-80 bg-white overflow-auto border border-muted rounded-2xl group-has-[[data-pending]]:animate-pulse'>
        {managers.length > 0 ? (
          <Table className='w-full border-separate border-spacing-1'>
            <TableHeader>
              <TableRow className='hover:bg-background'>
                <TableHead>ID</TableHead>
                <TableHead>Nome completo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Numero di telefono</TableHead>
                <TableHead>Artisti</TableHead>
                <TableHead>Ragione sociale</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {managers.map((manager, index) => {
                return (
                  <TableRow
                    key={index}
                    // onClick={() => router.push(`/manager-artisti/${manager.id}`)}
                    className='cursor-pointer'
                  >
                    <TableCell>{manager.id}</TableCell>
                    <TableCell>
                      {manager.name} {manager.surname}
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
        ) : (
          <>
            <h2 className='text-base font-bold'>Nessun manager artista</h2>
            <div className='text-sm font-medium text-zinc-400'>
              Aggiungine uno per vederlo nella lista
            </div>
          </>
        )}
      </section>
    </>
  );
}
