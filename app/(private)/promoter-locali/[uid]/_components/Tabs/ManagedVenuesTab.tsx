import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TabsContent } from '@/components/ui/tabs';
import { VenueListData, VenueManagerData } from '@/lib/types';
import RemoveManagedVenueButton from '../RemoveManagedVenueButton';
import VenueTypeBadge from '@/app/(private)/_components/Badges/VenueTypeBadge';
import UserBadge from '@/app/(private)/_components/Badges/UserBadge';
import { AVATAR_FALLBACK } from '@/lib/constants';

type ManagedVenuesTabProps = { tabValue: string; data: VenueManagerData<VenueListData> };

export default function ManagedVenuesTab({ tabValue, data }: ManagedVenuesTabProps) {
  const { venues } = data;

  return (
    <TabsContent value={tabValue}>
      {venues.length > 0 ? (
        <Table className='w-full'>
          <TableHeader className='bg-zinc-50'>
            <TableRow>
              <TableHead>Nome locale</TableHead>
              <TableHead>Ragione sociale</TableHead>
              <TableHead>Codice fiscale</TableHead>
              <TableHead>Indirizzo</TableHead>
              <TableHead>Tipologia locale</TableHead>
              <TableHead>Capienza</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {venues.map((venue, index) => {
              const isDisabled = venue.status === 'disabled';

              return (
                <TableRow
                  key={index}
                  className={isDisabled ? 'text-zinc-400' : ''}
                >
                  <TableCell>
                    <UserBadge
                      name={venue.name}
                      surname={''}
                      avatarUrl={venue.avatarUrl || AVATAR_FALLBACK}
                      isDisabled={isDisabled}
                      href={`/locali/${venue.slug}`}
                    />
                  </TableCell>
                  <TableCell>{venue.company}</TableCell>
                  <TableCell>{venue.taxCode}</TableCell>
                  <TableCell>{venue.address}</TableCell>
                  <TableCell>
                    <VenueTypeBadge type={venue.type} />
                  </TableCell>
                  <TableCell>{venue.capacity}</TableCell>
                  <TableCell>
                    <RemoveManagedVenueButton
                      managerProfileId={data.profileId}
                      venueId={venue.id}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <section className='max-h-80 flex flex-col justify-center items-center bg-white rounded-2xl p-8'>
          <h2 className='text-base font-bold'>Nessun locale</h2>
          <div className='text-sm font-medium text-zinc-400'>
            Aggiungine uno per vederlo nella lista
          </div>
        </section>
      )}
    </TabsContent>
  );
}
