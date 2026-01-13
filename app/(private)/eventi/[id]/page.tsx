import BackButton from '@/app/_components/BackButton';
import { Separator } from '@/components/ui/separator';
import EventStatusBadge from '@/app/(private)/_components/Badges/EventStatusBadge';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { notFound, redirect } from 'next/navigation';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { hasRole, resolveNextPath } from '@/lib/utils';
import { getEventSummary } from '@/lib/data/events/get-event-summary';
import { EventType } from '@/lib/types';
import { TIME_ZONE } from '@/lib/constants';

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  'dj-set': 'DJ set',
  live: 'Live',
  festival: 'Festival',
};

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['admin', 'artist-manager', 'venue-manager'])) {
    notFound();
  }

  const { id } = await params;
  const eventId = Number(id);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    notFound();
  }

  const event = await getEventSummary(eventId);
  if (!event) {
    notFound();
  }

  const startLabel = format(toZonedTime(event.startDate, TIME_ZONE), 'dd/MM/yyyy, HH:mm');
  const endLabel = format(toZonedTime(event.endDate, TIME_ZONE), 'dd/MM/yyyy, HH:mm');
  const artistName = `${event.artist.name} ${event.artist.surname}`.trim();
  const eventTypeLabel = event.eventType ? EVENT_TYPE_LABELS[event.eventType] : null;

  return (
    <div className='max-w-3xl space-y-6'>
      <div className='flex justify-between items-center'>
        <BackButton />
      </div>

      <section className='bg-white p-6 rounded-2xl space-y-4'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4'>
          <div className='space-y-1'>
            <div className='text-xl font-bold'>Evento #{event.id}</div>
            <div className='text-sm text-zinc-500'>{event.venue.name}</div>
          </div>
          <div className='flex items-center gap-2'>
            <EventStatusBadge status={event.status} />
            {eventTypeLabel && <Badge variant='secondary'>{eventTypeLabel}</Badge>}
          </div>
        </div>

        <Separator />

        <div className='grid grid-cols-[minmax(180px,max-content)_1fr] gap-3 text-sm'>
          <span className='font-semibold text-zinc-600'>Inizio evento</span>
          <span className='font-medium text-zinc-500'>{startLabel}</span>
          <span className='font-semibold text-zinc-600'>Fine evento</span>
          <span className='font-medium text-zinc-500'>{endLabel}</span>
          <span className='font-semibold text-zinc-600'>Artista</span>
          <span className='font-medium text-zinc-500'>
            {artistName}
            {event.artist.stageName ? ` (@${event.artist.stageName})` : ''}
          </span>
          <span className='font-semibold text-zinc-600'>Locale</span>
          <span className='font-medium text-zinc-500'>{event.venue.name}</span>
          <span className='font-semibold text-zinc-600'>Città</span>
          <span className='font-medium text-zinc-500'>{event.venue.city || '-'}</span>
          <span className='font-semibold text-zinc-600'>Indirizzo</span>
          <span className='font-medium text-zinc-500'>{event.venue.address || '-'}</span>
        </div>
      </section>
    </div>
  );
}
