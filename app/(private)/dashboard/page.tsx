import { Separator } from '@/components/ui/separator';
import UserToApproveTile from './_components/UserToApproveTile';
import EventTile from '../eventi/_components/EventTile/EventTile';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import EventsCalendar from './_components/EventsCalendar/EventsCalendar';
import { getUsersToApproveCached } from '@/lib/cache/users';
import { getEventsCached } from '@/lib/cache/events';
import { getArtistsCached } from '@/lib/cache/artists';
import { getMoCoordinatorsCached } from '@/lib/cache/mo-coordinators';
import { getVenuesCached } from '@/lib/cache/venues';
import getSession from '@/lib/data/auth/get-session';
import { redirect } from 'next/navigation';
import { userHasProfile } from '@/lib/data/profiles/userHasProfile';
import { resolveNextPath } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { session, user } = await getSession();
  if (!session || !user) redirect('/accedi');
  const hasProfile = await userHasProfile(user.id);
  const target = resolveNextPath({ user, hasProfile });
  if (target && target != '/dahsboard') redirect(target);

  const [usersToApprove, eventsToApprove, artists, moCoordinators, venues] = await Promise.all([
    getUsersToApproveCached(),
    getEventsCached({
      currentPage: null,
      status: ['proposed'],
      artistIds: [],
      artistManagerIds: [],
      venueIds: [],
      startDate: null,
      endDate: null,
    }),
    getArtistsCached(),
    getMoCoordinatorsCached(),
    getVenuesCached(),
  ]);

  return (
    <>
      <h1 className='text-xl md:text-2xl font-bold'>Dashboard</h1>
      {/* signup requests section */}
      {usersToApprove.length > 0 && (
        <section className='bg-white p-4 rounded-2xl'>
          <h2 className='text-base font-bold'>Richieste registrazione</h2>
          <Separator className='my-4' />
          <div className='max-h-80 space-y-4 overflow-y-auto'>
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
      {eventsToApprove.data.length > 0 && (
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
          <Separator className='my-4' />
          <div className='max-h-80 space-y-4 overflow-y-auto'>
            {eventsToApprove.data.map((event) => (
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
        <EventsCalendar
          artists={artists}
          venues={venues}
        />
      </section>
    </>
  );
}
