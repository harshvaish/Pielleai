import BackButton from '@/app/_components/BackButton';
import getSession from '@/lib/data/auth/get-session';
import { notFound, redirect } from 'next/navigation';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { hasRole, resolveNextPath } from '@/lib/utils';
import { getArtistsCached } from '@/lib/cache/artists';
import { getVenuesCached } from '@/lib/cache/venues';
import { getMoCoordinatorsCached } from '@/lib/cache/mo-coordinators';
import { getProfessionalsCached } from '@/lib/cache/professionals';
import UpdateEventForm from '../../_components/update/UpdateEventForm';
import { getEventById } from '@/lib/data/events/get-event-by-id';
import CreateRevisionDialog from '../_components/CreateRevisionDialog';

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

  if (event.status === 'ended' && !event.masterEventId) {
    return (
      <div className='max-w-3xl space-y-2'>
        <div className='flex items-center justify-between -mt-2'>
          <BackButton />
        </div>
        <section className='bg-white p-6 rounded-2xl space-y-4'>
          <h1 className='text-2xl font-bold'>Evento concluso</h1>
          <p className='text-sm text-zinc-600'>
            Questo evento e concluso e non puo essere modificato direttamente. Crea una
            revisione per apportare correzioni mantenendo lo storico.
          </p>
          <CreateRevisionDialog eventId={event.id} />
        </section>
      </div>
    );
  }
  const [artists, venues, moCoordinators, professionals] = await Promise.all([
    getArtistsCached(),
    getVenuesCached(),
    getMoCoordinatorsCached(),
    getProfessionalsCached(),
  ]);

  return (
    <div className='max-w-5xl space-y-1'>
      <div className='flex items-center justify-between -mt-2'>
        <BackButton />
      </div>
      <UpdateEventForm
        event={event}
        artists={artists}
        venues={venues}
        moCoordinators={moCoordinators}
        professionals={professionals}
        userRole={user.role}
      />
    </div>
  );
}
