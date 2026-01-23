import BackButton from '@/app/_components/BackButton';
import getSession from '@/lib/data/auth/get-session';
import { notFound, redirect } from 'next/navigation';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { hasRole, resolveNextPath } from '@/lib/utils';
import { getArtistsCached } from '@/lib/cache/artists';
import { getVenuesCached } from '@/lib/cache/venues';
import { getMoCoordinatorsCached } from '@/lib/cache/mo-coordinators';
import CreateEventForm from '../_components/create/CreateEventForm';
import CreateEventRequestForm from '../_components/create/CreateEventRequestForm';

export const dynamic = 'force-dynamic';

export default async function CreateEventPage() {
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
  const isVenueManager = user.role === 'venue-manager';

  const [artists, venues, moCoordinators] = await Promise.all([
    getArtistsCached(),
    getVenuesCached(isVenueManager ? profileId! : undefined),
    getMoCoordinatorsCached(),
  ]);

  return (
    <div className='max-w-5xl space-y-2'>
      <div className='flex items-center justify-between -mt-2'>
        <BackButton />
      </div>
      {isAdmin ? (
        <CreateEventForm
          artists={artists}
          venues={venues}
          moCoordinators={moCoordinators}
          userRole={user.role}
        />
      ) : (
        <CreateEventRequestForm
          artists={artists}
          venues={venues}
          userRole={user.role}
        />
      )}
    </div>
  );
}
