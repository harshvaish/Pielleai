'server only';

import { database } from '@/lib/database/connection';
import { artistAvailabilities, artists, eventProfessionals, events, professionals, venues } from '@/lib/database/schema';
import { Professional, ProfessionalEvent } from '@/lib/types';
import { desc, eq } from 'drizzle-orm';
import { generateEventTitle } from '@/lib/utils/generate-event-title';

export async function getProfessionalById(
  professionalId: number,
): Promise<(Professional & { events: ProfessionalEvent[] }) | null> {
  try {
    const [professional] = await database
      .select({
        id: professionals.id,
        fullName: professionals.fullName,
        role: professionals.role,
        roleDescription: professionals.roleDescription,
        email: professionals.email,
        phone: professionals.phone,
        competencies: professionals.competencies,
        createdAt: professionals.createdAt,
        updatedAt: professionals.updatedAt,
      })
      .from(professionals)
      .where(eq(professionals.id, professionalId))
      .limit(1);

    if (!professional) return null;

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
      .from(eventProfessionals)
      .innerJoin(events, eq(eventProfessionals.eventId, events.id))
      .leftJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
      .leftJoin(artists, eq(events.artistId, artists.id))
      .leftJoin(venues, eq(events.venueId, venues.id))
      .where(eq(eventProfessionals.professionalId, professionalId))
      .orderBy(desc(artistAvailabilities.startDate));

    const eventItems = rows.map((row) => {
      const artistLabel =
        row.artist?.stageName?.trim() ||
        `${row.artist?.name ?? ''} ${row.artist?.surname ?? ''}`.trim() ||
        'Artista';
      const title =
        row.title?.trim() ||
        (row.availability?.startDate
          ? generateEventTitle(
              artistLabel,
              row.venue?.name ?? 'Locale',
              new Date(row.availability.startDate),
              row.availability.endDate ? new Date(row.availability.endDate) : new Date(row.availability.startDate),
            )
          : `Evento #${row.id}`);

      return { id: row.id, title };
    });

    return { ...(professional as Professional), events: eventItems };
  } catch (error) {
    console.error('[getProfessionalById] - Error:', error);
    throw new Error('Recupero professionista non riuscito.');
  }
}
