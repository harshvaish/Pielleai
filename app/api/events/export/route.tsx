import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/lib/data/events/get-events';
import { formatInTimeZone } from 'date-fns-tz';
import { EVENT_STATUS_LABELS, TIME_ZONE } from '@/lib/constants';
import { unparse } from 'papaparse';
import { Event } from '@/lib/types';
import { eventsExportFiltersSchema } from '@/lib/validation/event-export-filters-schema';
import getSession from '@/lib/data/auth/get-session';

type CSVRow = {
  evento_id: number;
  evento_inizio: string;
  evento_fine: string;
  evento_stato: string;
  evento_conflitto: boolean;

  artista_id: number;
  artista_nome: string;
  artista_cognome: string;
  artista_nome_arte: string;
  artista_stato: string;

  manager_artista_id: string;
  manager_artista_nome: string;
  manager_artista_cognome: string;
  manager_artista_stato: string;

  locale_id: number;
  locale_nome: string;
  locale_indirizzo: string;
  locale_stato: string;

  tour_manager_email: string;

  ingaggi: string;

  cachet_lordo: string;
  acconto: string;
  fee_promoter: string;
  numero_fattura_acconto: string;
  percentuale_booking: string;
  spese_anticipate: string;
  netto_artista: string;
  anticipo_artista: string;

  hotel: string;
  costo_hotel: string;
  ristorante: string;
  costo_ristorante: string;
  referente_serata: string;

  coordinatore_nome: string;
  coordinatore_cognome: string;

  incasso_totale: string;
  saldo_trasporti: string;
  saldo_cassa: string;

  sound_check_inizio: string;
  sound_check_fine: string;

  rider_tecnico_nome: string;
  rider_tecnico_link: string;

  firma_contratto: boolean;
  emissione_fattura_acconto: boolean;
  verifica_ricezione_acconto: boolean;
  scheda_tecnica: boolean;
  incarico_artista: boolean;
  incarico_professionisti: boolean;
  ingaggio_accompagnatori: boolean;
  performance: boolean;
  feedback_post_evento: boolean;
  bordereau: boolean;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.role !== 'admin') {
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

    const { s, c, a, m, v, sd, ed } = validation.data;

    const result = await getEvents(user, {
      currentPage: null,
      status: s,
      conflict: c,
      artistIds: a,
      artistManagerIds: m,
      venueIds: v,
      startDate: sd,
      endDate: ed,
    });

    const events = result?.data ?? [];

    const csvData: CSVRow[] = events.map((event: Event) => ({
      evento_id: event.id,
      evento_inizio: formatInTimeZone(event.availability.startDate, TIME_ZONE, 'dd/MM/yyyy HH:mm'),
      evento_fine: formatInTimeZone(event.availability.endDate, TIME_ZONE, 'dd/MM/yyyy HH:mm'),
      evento_stato: EVENT_STATUS_LABELS[event.status],
      evento_conflitto: event.hasConflict,

      artista_id: event.artist.id,
      artista_nome: event.artist.name,
      artista_cognome: event.artist.surname,
      artista_nome_arte: event.artist.stageName,
      artista_stato: event.artist.status,

      manager_artista_id: event?.artistManager?.id ?? '',
      manager_artista_nome: event?.artistManager?.name ?? '',
      manager_artista_cognome: event?.artistManager?.surname ?? '',
      manager_artista_stato: event?.artistManager?.status ?? '',

      locale_id: event.venue.id,
      locale_nome: event.venue.name,
      locale_indirizzo: event.venue.address,
      locale_stato: event.venue.status,

      tour_manager_email: event?.tourManagerEmail ?? '',

      ingaggi: event?.payrollConsultantEmail ?? '',

      cachet_lordo: event?.moCost ?? '',
      acconto: event?.depositCost ?? '',
      fee_promoter: event?.venueManagerCost ?? '',
      numero_fattura_acconto: event?.depositInvoiceNumber ?? '',
      percentuale_booking: event?.bookingPercentage ?? '',
      spese_anticipate: event?.moArtistAdvancedExpenses ?? '',
      netto_artista: event?.artistNetCost ?? '',
      anticipo_artista: event?.artistUpfrontCost ?? '',

      hotel: event?.hotel ?? '',
      costo_hotel: event?.hotelCost ?? '',
      ristorante: event?.restaurant ?? '',
      costo_ristorante: event?.restaurantCost ?? '',
      referente_serata: event?.eveningContact ?? '',

      coordinatore_nome: event?.moCoordinator?.name ?? '',
      coordinatore_cognome: event?.moCoordinator?.surname ?? '',

      incasso_totale: event?.totalCost ?? '',
      saldo_trasporti: event?.transportationsCost ?? '',
      saldo_cassa: event?.cashBalanceCost ?? '',

      sound_check_inizio: event?.soundCheckStart ?? '',
      sound_check_fine: event?.soundCheckEnd ?? '',

      rider_tecnico_nome: event?.tecnicalRiderName ?? '',
      rider_tecnico_link: event?.tecnicalRiderUrl ?? '',

      firma_contratto: event.contractSigning,
      emissione_fattura_acconto: event.depositInvoiceIssuing,
      verifica_ricezione_acconto: event.depositReceiptVerification,
      scheda_tecnica: event.techSheetSubmission,
      incarico_artista: event.artistEngagement,
      incarico_professionisti: event.professionalsEngagement,
      ingaggio_accompagnatori: event.accompanyingPersonsEngagement,

      performance: event.performance,

      feedback_post_evento: event.postDateFeedback,
      bordereau: event.bordereau,
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
