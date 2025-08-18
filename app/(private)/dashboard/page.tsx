import { Separator } from '@/components/ui/separator';
import { getUsersToApprove } from '@/lib/data/users/get-users-to-approve';
import UserToApproveTile from './_components/UserToApproveTile';
import { getEvents } from '@/lib/data/events/get-events';
import EventTile from '../eventi/_components/EventTile/EventTile';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getArtists } from '@/lib/data/artists/get-artists';
import { getMoCoordinators } from '@/lib/data/get-mo-coordinators';
import { getVenues } from '@/lib/data/venues/get-venues';
import EventsCalendar from './_components/EventsCalendar/EventsCalendar';

export default async function DashboardPage() {
  const [usersToApprove, eventResponse, artists, moCoordinators, venues] = await Promise.all([
    getUsersToApprove(),
    getEvents({
      currentPage: null,
      status: ['proposed'],
      artistIds: [],
      artistManagerIds: [],
      venueIds: [],
      startDate: null,
      endDate: null,
    }),
    getArtists(),
    getMoCoordinators(),
    getVenues(),
  ]);

  return (
    <>
      <h1 className='text-xl md:text-2xl font-bold'>Dashboard</h1>
      {/* signup requests section */}
      {usersToApprove.length > 0 && (
        <section className='bg-white p-4 rounded-2xl'>
          <h2 className='text-base font-bold'>Richieste registrazione</h2>
          <Separator className='bg-zinc-50 my-4' />
          <div className='max-h-80 overflow-y-auto'>
            {usersToApprove.map((user) => (
              <UserToApproveTile
                key={user.id}
                user={user}
              />
            ))}
          </div>
        </section>
      )}

      {/* events requests section */}
      {eventResponse.data.length > 0 && (
        <section className='bg-white p-4 rounded-2xl'>
          <div className='flex justify-between items-center gap-2'>
            <h2 className='text-base font-bold'>Richieste di evento</h2>
            <Link
              href='/eventi'
              prefetch={false}
              className='flex items-center gap-2 text-sm font-medium transition-all hover:gap-1'
            >
              Vedi tutto
              <ChevronRight className='size-4' />
            </Link>
          </div>
          <Separator className='bg-zinc-50 my-4' />
          <div className='max-h-80 overflow-y-auto space-y-4'>
            {eventResponse.data.map((event) => (
              <EventTile
                key={event.id}
                event={event}
                artists={artists}
                moCoordinators={moCoordinators}
                venues={venues}
              />
            ))}
          </div>
        </section>
      )}
      {/* calendar section */}
      <section className='bg-white p-4 rounded-2xl'>
        <EventsCalendar />
      </section>
    </>
  );
}
