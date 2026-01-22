'server only';

import { desc, eq } from 'drizzle-orm';

import { database } from '@/lib/database/connection';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { generateEventTitle } from '@/lib/utils/generate-event-title';

import { events, artists, venues, artistAvailabilities } from '../../../drizzle/schema';

export type EventOption = {
  id: number;
  title: string;
  dateLabel: string;
  artistLabel: string;
  venueLabel: string;
};

const formatDateLabel = (start?: string | null): string => {
  if (!start) return '-';
  const parsed = new Date(start);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export async function getEventOptions(limit = 1000): Promise<EventOption[]> {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    throw new AppError('Non sei autenticato.');
  }

  if (user.role !== 'admin') {
    throw new AppError('Non sei autorizzato.');
  }

  const rows = await database
    .select({
      id: events.id,
      title: events.title,
      availability: {
        startDate: artistAvailabilities.startDate,
        endDate: artistAvailabilities.endDate,
      },
      artist: {
        name: artists.name,
        surname: artists.surname,
        stageName: artists.stageName,
      },
      venue: {
        name: venues.name,
      },
    })
    .from(events)
    .innerJoin(artists, eq(events.artistId, artists.id))
    .innerJoin(venues, eq(events.venueId, venues.id))
    .leftJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
    .orderBy(desc(artistAvailabilities.startDate))
    .limit(limit);

  return rows.map((row) => {
    const artistLabel =
      row.artist.stageName?.trim() ||
      `${row.artist.name ?? ''} ${row.artist.surname ?? ''}`.trim() ||
      'Artista';
    const dateLabel = formatDateLabel(row.availability?.startDate ?? null);
    const title =
      row.title?.trim() ||
      (row.availability?.startDate
        ? generateEventTitle(
            artistLabel,
            row.venue.name,
            new Date(row.availability.startDate),
            row.availability.endDate ? new Date(row.availability.endDate) : new Date(row.availability.startDate),
          )
        : `Evento #${row.id}`);

    return {
      id: row.id,
      title,
      dateLabel,
      artistLabel,
      venueLabel: row.venue.name,
    };
  });
}
