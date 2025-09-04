import { getCalendarEvents } from '@/lib/data/events/get-calendar-events';
import { splitCsv } from '@/lib/utils';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { stringDateValidation, stringIdValidation } from '@/lib/validation/_general';
import { ApiResponse, CalendarEvent, EventStatus } from '@/lib/types';
import { eventStatus, managerArtists } from '@/lib/database/schema';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileId } from '@/lib/data/profiles/get-user-profile-id';
import { database } from '@/lib/database/connection';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<CalendarEvent[]>>> {
  try {
    const { session, user } = await getSession();
    if (!session || !user) {
      return NextResponse.json(
        { success: false, message: 'Non sei autorizzato.', data: null },
        { status: 401 },
      );
    }

    const url = new URL(request.url);

    const startDate = url.searchParams.get('sd');
    const endDate = url.searchParams.get('ed');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: 'Date di filtraggio mancanti.', data: null },
        { status: 400 },
      );
    }

    const artistParam = url.searchParams.get('a');
    const venueParam = url.searchParams.get('v');
    const statusParam = url.searchParams.get('s');

    const status = splitCsv(statusParam) as EventStatus[];
    const artistIds = splitCsv(artistParam);
    const venueIds = splitCsv(venueParam);

    const schema = z.object({
      startDate: stringDateValidation,
      endDate: stringDateValidation,
      artistIds: z.array(stringIdValidation),
      venueIds: z.array(stringIdValidation),
      status: z.array(z.enum(eventStatus.enumValues)),
    });

    const validation = schema.safeParse({ startDate, endDate, status, artistIds, venueIds });

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Dati forniti non validi.', data: null },
        { status: 400 },
      );
    }

    let managedArtistIds: number[] = [];

    if (user.role != 'admin') {
      const profileId = await getUserProfileId(user.id);

      if (!profileId) {
        return NextResponse.json(
          { success: false, message: 'Utenza non valida.', data: null },
          { status: 400 },
        );
      }

      const managedArtists = await database
        .select({ artistId: managerArtists.artistId })
        .from(managerArtists)
        .where(eq(managerArtists.managerProfileId, profileId));

      managedArtistIds = [...new Set(managedArtists.map((r) => r.artistId))];
    }

    const managedArtistIdsStr = managedArtistIds.map(String);
    const artistIdsFilter: string[] = Array.from(new Set([...artistIds, ...managedArtistIdsStr]));

    const events = await getCalendarEvents({
      artistIds: artistIdsFilter,
      venueIds,
      status,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return NextResponse.json({ success: true, message: null, data: events }, { status: 200 });
  } catch (error) {
    console.error('Errore nel recupero degli eventi:', error);
    return NextResponse.json(
      { success: false, message: 'Recupero degli eventi non riuscito.', data: null },
      { status: 500 },
    );
  }
}
