import TourManagerBadge from '@/app/(private)/_components/badges/TourManagerBadge';
import UserBadge from '@/app/(private)/_components/badges/UserBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TabsContent } from '@/components/ui/tabs';
import { ArtistListData, ArtistManagerData } from '@/lib/types';
import RemoveManagedArtistButton from '../RemoveManagedArtistButton';

export default function ManagedArtistsTab({ tabValue, data }: { tabValue: string; data: ArtistManagerData<ArtistListData> }) {
  const { artists } = data;

  return (
    <TabsContent value={tabValue}>
      {artists.length > 0 ? (
        <Table className='w-full'>
          <TableHeader className='bg-zinc-50'>
            <TableRow>
              <TableHead>Nome completo</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Numero di telefono</TableHead>
              <TableHead>Tour manager</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {artists.map((artist, index) => {
              const isDisabled = artist.status === 'disabled';

              return (
                <TableRow
                  key={index}
                  className={isDisabled ? 'text-zinc-400' : ''}
                >
                  <TableCell>
                    <UserBadge
                      name={artist.name}
                      surname={artist.surname}
                      avatarUrl={artist.avatarUrl}
                      isDisabled={isDisabled}
                      href={`/artisti/${artist.slug}`}
                    />
                  </TableCell>
                  <TableCell>{artist.email}</TableCell>
                  <TableCell>{artist.phone}</TableCell>
                  <TableCell>
                    <TourManagerBadge
                      email={artist.tourManagerEmail}
                      name={artist.tourManagerName}
                      surname={artist.tourManagerSurname}
                      phone={artist.tourManagerPhone}
                    />
                  </TableCell>
                  <TableCell>
                    <RemoveManagedArtistButton
                      managerProfileId={data.profileId}
                      artistId={artist.id}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <section className='max-h-80 flex flex-col justify-center items-center bg-white rounded-2xl p-8'>
          <h2 className='text-base font-bold'>Nessun artista</h2>
          <div className='text-sm font-medium text-zinc-400'>Aggiungine uno per vederlo nella lista</div>
        </section>
      )}
    </TabsContent>
  );
}
