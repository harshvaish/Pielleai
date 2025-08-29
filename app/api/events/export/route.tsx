import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getEvents } from '@/lib/data/events/get-events';
import { formatInTimeZone } from 'date-fns-tz';
import { EVENT_STATUS_LABELS, TIME_ZONE } from '@/lib/constants';
import { unparse } from 'papaparse';
import { Event } from '@/lib/types';
import { eventsExportFiltersSchema } from '@/lib/validation/event-export-filters-schema';

type CSVRow = {
  id: string | number;
  artista: string;
  locale: string;
  indirizzo_locale: string;
  data_inizio: string;
  data_fine: string;
  stato: string;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Non sei autorizzato.', data: null },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validation = eventsExportFiltersSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Dati forniti non validi.', data: null },
        { status: 400 },
      );
    }

    const { s, a, m, v, sd, ed } = validation.data;

    const result = await getEvents({
      currentPage: null,
      status: s,
      artistIds: a,
      artistManagerIds: m,
      venueIds: v,
      startDate: sd,
      endDate: ed,
    });

    const events = result?.data ?? [];

    const csvData: CSVRow[] = events.map((event: Event) => ({
      id: event?.id ?? '',
      artista: event?.artist?.stageName ?? '',
      locale: event?.venue?.name ?? '',
      indirizzo_locale: event?.venue?.address ?? '',
      data_inizio: formatInTimeZone(event?.availability?.startDate, TIME_ZONE, 'dd/MM/yyyy HH:mm'),
      data_fine: formatInTimeZone(event?.availability?.endDate, TIME_ZONE, 'dd/MM/yyyy HH:mm'),
      stato: event?.status ? EVENT_STATUS_LABELS[event.status] : '',
    }));

    const csv = unparse(csvData, {
      header: true,
      delimiter: ';',
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="events-export.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Errore nella creazione della url di upload:', error);
    return NextResponse.json(
      { success: false, message: 'Recupero url di upload non riuscito.', data: null },
      { status: 500 },
    );
  }
}
