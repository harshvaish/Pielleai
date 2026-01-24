import { Separator } from '@/components/ui/separator';
import UserToApproveTile from './_components/UserToApproveTile';
import EventTile from '../_components/EventTile/EventTile';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import EventsCalendar from '../_components/EventsCalendar/EventsCalendar';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { getArtistsCached } from '@/lib/cache/artists';
import { getMoCoordinatorsCached } from '@/lib/cache/mo-coordinators';
import { getVenuesCached } from '@/lib/cache/venues';
import getSession from '@/lib/data/auth/get-session';
import { notFound, redirect } from 'next/navigation';
import { hasRole, resolveNextPath } from '@/lib/utils';
import { getVenueManagerEvents } from '@/lib/data/events/get-venue-manager-events';
import { getUsersToApprove } from '@/lib/data/users/get-users-to-approve';
import { getEventsToApprove } from '@/lib/data/events/get-events-to-approve';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['admin', 'venue-manager'])) {
    notFound();
  }

  const isAdmin = user.role === 'admin';

  const [usersToApprove, eventsToApprove, artists, moCoordinators, venues] = await Promise.all([
    isAdmin ? getUsersToApprove() : Promise.resolve([]),
    isAdmin ? getEventsToApprove() : getVenueManagerEvents(profileId!),
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
        <section className='bg-white p-3 rounded-2xl'>
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
          <Separator className='my-3' />
          <div className='max-h-80 space-y-2 overflow-y-auto'>
            {eventsToApprove.data.map((event) => (
              <EventTile
                key={event.id}
                userRole={user.role}
                event={event}
                artists={artists}
                venues={venues}
              />
            ))}
          </div>
        </section>
      )}
      {/* calendar section */}
      <section className='bg-white p-4 rounded-2xl'>
        <EventsCalendar
          userRole={user.role}
          artists={artists}
          venues={venues}
        />
      </section>
    </>
  );
}
