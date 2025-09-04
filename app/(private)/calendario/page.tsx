import EventsCalendar from './_components/EventsCalendar/EventsCalendar';
import { getArtistsCached } from '@/lib/cache/artists';
import { getVenuesCached } from '@/lib/cache/venues';
import getSession from '@/lib/data/auth/get-session';
import { notFound, redirect } from 'next/navigation';
import { hasRole, resolveNextPath } from '@/lib/utils';
import { getUserProfileIdCached } from '@/lib/cache/users';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const { session, user } = await getSession();
  if (!session || !user) redirect('/accedi');

  if (!hasRole(user, ['artist-manager'])) {
    notFound();
  }

  const profileId = await getUserProfileIdCached(user.id);
  const isAdmin = user.role === 'admin';
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  const [artists, venues] = await Promise.all([
    getArtistsCached(isAdmin ? undefined : profileId),
    getVenuesCached(),
  ]);

  return (
    <>
      <h1 className='text-xl md:text-2xl font-bold'>Calendario</h1>

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
