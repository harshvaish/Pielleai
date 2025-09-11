import { getArtistsCached } from '@/lib/cache/artists';
import { getVenuesCached } from '@/lib/cache/venues';
import getSession from '@/lib/data/auth/get-session';
import { notFound, redirect } from 'next/navigation';
import { hasRole, resolveNextPath } from '@/lib/utils';
import EventsCalendar from '../_components/EventsCalendar/EventsCalendar';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const target = resolveNextPath({ user, hasProfile: Boolean(user.profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['artist-manager'])) {
    notFound();
  }

  const [artists, venues] = await Promise.all([
    getArtistsCached(user.profileId!),
    getVenuesCached(),
  ]);

  return (
    <>
      <h1 className='text-xl md:text-2xl font-bold'>Calendario</h1>

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
