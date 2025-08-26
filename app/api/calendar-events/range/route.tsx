import { getCalendarEvents } from '@/lib/data/events/get-calendar-events';
import { splitCsv } from '@/lib/utils';
import { type NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { z } from 'zod/v4';
import { stringIdValidation } from '@/lib/validation/_general';
import { EventStatus } from '@/lib/types';
import { eventStatus } from '@/lib/database/schema';

export async function GET(request: NextRequest) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);

  const startDate = url.searchParams.get('sd');
  const endDate = url.searchParams.get('ed');

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'Date calendario mancanti.' }, { status: 400 });
  }

  const artistParam = url.searchParams.get('a');
  const venueParam = url.searchParams.get('v');
  const statusParam = url.searchParams.get('s');

  const status = splitCsv(statusParam) as EventStatus[];
  const artistIds = splitCsv(artistParam);
  const venueIds = splitCsv(venueParam);

  const schema = z.object({
    startDate: z
      .string()
      .transform((val) => new Date(val))
      .refine((date) => !isNaN(date.getTime())),
    endDate: z
      .string()
      .transform((val) => new Date(val))
      .refine((date) => !isNaN(date.getTime())),
    artistIds: z.array(stringIdValidation),
    venueIds: z.array(stringIdValidation),
    status: z.array(z.enum(eventStatus.enumValues)),
  });

  const validation = schema.safeParse({ startDate, endDate, status, artistIds, venueIds });

  if (!validation.success) {
    return NextResponse.json({ error: validation.error.issues[0] }, { status: 400 });
  }

  try {
    const events = await getCalendarEvents({
      artistIds,
      venueIds,
      status,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Errore nel recupero degli eventi:', error);
    return NextResponse.json({ error: 'Recupero degli eventi non riuscito.' }, { status: 500 });
  }
}
