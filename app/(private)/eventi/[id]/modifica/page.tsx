import BackButton from '@/app/_components/BackButton';
import getSession from '@/lib/data/auth/get-session';
import { notFound, redirect } from 'next/navigation';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { hasRole, resolveNextPath } from '@/lib/utils';
import { getArtistsCached } from '@/lib/cache/artists';
import { getVenuesCached } from '@/lib/cache/venues';
import { getMoCoordinatorsCached } from '@/lib/cache/mo-coordinators';
import UpdateEventForm from '../../_components/update/UpdateEventForm';
import { getEventById } from '@/lib/data/events/get-event-by-id';

type UpdateEventPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

export default async function UpdateEventPage({ params }: UpdateEventPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['admin'])) {
    notFound();
  }

  const { id } = await params;
  const eventId = Number(id);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    notFound();
  }

  const event = await getEventById(user, eventId);
  if (!event) {
    notFound();
  }

  const [artists, venues, moCoordinators] = await Promise.all([
    getArtistsCached(),
    getVenuesCached(),
    getMoCoordinatorsCached(),
  ]);

  return (
    <div className='max-w-5xl space-y-6'>
      <div className='flex items-center justify-between'>
        <BackButton />
      </div>
      <section className='bg-white p-6 rounded-2xl'>
        <UpdateEventForm
          event={event}
          artists={artists}
          venues={venues}
          moCoordinators={moCoordinators}
          userRole={user.role}
        />
      </section>
    </div>
  );
}
