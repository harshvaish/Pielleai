import { getCalendarEvents } from '@/lib/data/events/get-calendar-events';
import { toUTCRange } from '@/lib/utils';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const startDate = url.searchParams.get('start');
  const endDate = url.searchParams.get('end');

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!startDate || !dateRegex.test(startDate)) {
    return NextResponse.json({ error: 'Data inizio range mancante o non valida.' }, { status: 400 });
  }

  if (!endDate || !dateRegex.test(endDate)) {
    return NextResponse.json({ error: 'Data fine range mancante o non valida.' }, { status: 400 });
  }

  const { startUtc, endUtc } = toUTCRange(startDate, endDate);

  try {
    const events = await getCalendarEvents({
      artistIds: [],
      artistManagerIds: [],
      venueIds: [],
      status: [],
      startDate: startUtc,
      endDate: endUtc,
    });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Errore nel recupero degli eventi:', error);
    return NextResponse.json({ error: 'Recupero degli eventi non riuscito.' }, { status: 500 });
  }
}
