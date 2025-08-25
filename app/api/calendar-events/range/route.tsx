import { getCalendarEvents } from '@/lib/data/events/get-calendar-events';
import { splitCsv, toUTCRange } from '@/lib/utils';
import { EVENTS_STATUS, type EventStatus } from '@/lib/constants';
import { type NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: NextRequest) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);

  const startDate = url.searchParams.get('start');
  const endDate = url.searchParams.get('end');

  const statusParam = url.searchParams.get('status');
  const artistParam = url.searchParams.get('artist');
  const venueParam = url.searchParams.get('venue');

  // --- Validate date params ---
  if (!startDate || !dateRegex.test(startDate)) {
    return NextResponse.json({ error: 'Data inizio range mancante o non valida.' }, { status: 400 });
  }
  if (!endDate || !dateRegex.test(endDate)) {
    return NextResponse.json({ error: 'Data fine range mancante o non valida.' }, { status: 400 });
  }

  const { startUtc, endUtc } = toUTCRange(startDate, endDate);
  if (startUtc! >= endUtc!) {
    return NextResponse.json({ error: "L'intervallo di date non è valido." }, { status: 400 });
  }

  // --- Parse & validate filters ---
  const rawStatuses = splitCsv(statusParam);
  const allowedStatuses = new Set<EventStatus>(EVENTS_STATUS);

  const invalidStatuses = rawStatuses.filter((s) => !allowedStatuses.has(s as EventStatus));
  if (rawStatuses.length > 0 && invalidStatuses.length > 0) {
    return NextResponse.json(
      {
        error: 'Valori di status non validi.',
        invalid: invalidStatuses,
        allowed: Array.from(allowedStatuses),
      },
      { status: 400 }
    );
  }
  const status: EventStatus[] = rawStatuses.filter((s) => allowedStatuses.has(s as EventStatus)) as EventStatus[];

  // IDs: keep it permissive (non-empty trimmed strings), cap list size to avoid abuse
  const artistIds = splitCsv(artistParam).slice(0, 100);
  const venueIds = splitCsv(venueParam).slice(0, 100);

  try {
    const events = await getCalendarEvents({
      artistIds,
      venueIds,
      status,
      startDate: startUtc,
      endDate: endUtc,
    });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Errore nel recupero degli eventi:', error);
    return NextResponse.json({ error: 'Recupero degli eventi non riuscito.' }, { status: 500 });
  }
}
