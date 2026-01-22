'server only';

import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import {
  artistAvailabilities,
  artists,
  eventNotes,
  events,
  moCoordinators,
  profiles,
  users,
  venues,
} from '@/lib/database/schema';
import { EventStatus } from '@/lib/types';
import { asc, eq, inArray, or, sql } from 'drizzle-orm';
import { getEventRevisionContext } from './get-event-revision-context';

export type RevisionChange = {
  field: string;
  before: string;
  after: string;
};

export type RevisionHistoryEntry = {
  id: number;
  revisionNumber: number;
  protocolNumber: string | null;
  reason: string | null;
  description: string | null;
  createdAt: Date | string | null;
  createdBy: string | null;
  changes: RevisionChange[];
};

type RevisionRow = {
  id: number;
  masterEventId: number | null;
  revisionNumber: number;
  protocolNumber: string | null;
  revisionReason: string | null;
  revisionDescription: string | null;
  revisionCreatedAt: Date | string | null;
  revisionCreatedByName: string | null;
  title: string | null;
  status: EventStatus;
  eventType: string | null;
  availabilityStart: Date | string;
  availabilityEnd: Date | string;
  artistId: number;
  artistLabel: string;
  venueId: number;
  venueLabel: string;
  artistManagerProfileId: number | null;
  artistManagerLabel: string | null;
  tourManagerEmail: string | null;
  payrollConsultantEmail: string | null;
  moCost: string | null;
  venueManagerCost: string | null;
  depositCost: string | null;
  depositInvoiceNumber: string | null;
  bookingPercentage: string | null;
  moArtistAdvancedExpenses: string | null;
  artistNetCost: string | null;
  artistUpfrontCost: string | null;
  hotel: string | null;
  hotelCost: string | null;
  restaurant: string | null;
  restaurantCost: string | null;
  eveningContact: string | null;
  moCoordinatorId: number | null;
  moCoordinatorLabel: string | null;
  totalCost: string | null;
  transportationsCost: string | null;
  cashBalanceCost: string | null;
  soundCheckStart: string | null;
  soundCheckEnd: string | null;
  tecnicalRiderUrl: string | null;
  tecnicalRiderName: string | null;
  paymentDate: Date | string | null;
  contractSigning: boolean;
  depositInvoiceIssuing: boolean;
  depositReceiptVerification: boolean;
  techSheetSubmission: boolean;
  artistEngagement: boolean;
  professionalsEngagement: boolean;
  accompanyingPersonsEngagement: boolean;
  performance: boolean;
  postDateFeedback: boolean;
  bordereau: boolean;
  notes: string[];
};

const formatBoolean = (value: boolean | null | undefined): string => (value ? 'Si' : 'No');

const formatDateTime = (value: Date | string | null | undefined): string => {
  if (!value) return '-';
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return '-';
  return format(parsed, 'dd/MM/yyyy HH:mm', { locale: it });
};

const formatDate = (value: Date | string | null | undefined): string => {
  if (!value) return '-';
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return '-';
  return format(parsed, 'dd/MM/yyyy', { locale: it });
};

const formatText = (value: string | null | undefined): string =>
  value && value.trim() ? value.trim() : '-';

const formatNotes = (notes: string[] | null | undefined): string =>
  notes && notes.length ? notes.join(' | ') : '-';

const DIFF_FIELDS: Array<{
  key: keyof RevisionRow;
  label: string;
  format: (value: any) => string;
}> = [
  { key: 'title', label: 'Titolo', format: formatText },
  { key: 'status', label: 'Stato', format: formatText },
  { key: 'eventType', label: 'Tipologia evento', format: formatText },
  { key: 'availabilityStart', label: 'Inizio evento', format: formatDateTime },
  { key: 'availabilityEnd', label: 'Fine evento', format: formatDateTime },
  { key: 'artistLabel', label: 'Artista', format: formatText },
  { key: 'venueLabel', label: 'Locale', format: formatText },
  { key: 'artistManagerLabel', label: 'Manager artista', format: formatText },
  { key: 'tourManagerEmail', label: 'Email tour manager', format: formatText },
  { key: 'payrollConsultantEmail', label: 'Email consulente paghe', format: formatText },
  { key: 'moCost', label: 'Costo MO', format: formatText },
  { key: 'venueManagerCost', label: 'Costo manager locale', format: formatText },
  { key: 'depositCost', label: 'Costo caparra', format: formatText },
  { key: 'depositInvoiceNumber', label: 'Numero fattura caparra', format: formatText },
  { key: 'bookingPercentage', label: 'Percentuale booking', format: formatText },
  { key: 'moArtistAdvancedExpenses', label: 'Anticipi artista', format: formatText },
  { key: 'artistNetCost', label: 'Cachet netto artista', format: formatText },
  { key: 'artistUpfrontCost', label: 'Acconto artista', format: formatText },
  { key: 'hotel', label: 'Hotel', format: formatText },
  { key: 'hotelCost', label: 'Costo hotel', format: formatText },
  { key: 'restaurant', label: 'Ristorante', format: formatText },
  { key: 'restaurantCost', label: 'Costo ristorante', format: formatText },
  { key: 'eveningContact', label: 'Contatto serata', format: formatText },
  { key: 'moCoordinatorLabel', label: 'Coordinatore MO', format: formatText },
  { key: 'totalCost', label: 'Costo totale', format: formatText },
  { key: 'transportationsCost', label: 'Costo trasporti', format: formatText },
  { key: 'cashBalanceCost', label: 'Saldo cash', format: formatText },
  { key: 'soundCheckStart', label: 'Soundcheck inizio', format: formatText },
  { key: 'soundCheckEnd', label: 'Soundcheck fine', format: formatText },
  { key: 'tecnicalRiderUrl', label: 'Tech rider URL', format: formatText },
  { key: 'tecnicalRiderName', label: 'Tech rider nome', format: formatText },
  { key: 'paymentDate', label: 'Data pagamento', format: formatDate },
  { key: 'contractSigning', label: 'Contratto firmato', format: formatBoolean },
  { key: 'depositInvoiceIssuing', label: 'Emissione fattura caparra', format: formatBoolean },
  { key: 'depositReceiptVerification', label: 'Verifica ricevuta caparra', format: formatBoolean },
  { key: 'techSheetSubmission', label: 'Invio tech sheet', format: formatBoolean },
  { key: 'artistEngagement', label: 'Ingaggio artista', format: formatBoolean },
  { key: 'professionalsEngagement', label: 'Ingaggio professionisti', format: formatBoolean },
  { key: 'accompanyingPersonsEngagement', label: 'Ingaggio accompagnatori', format: formatBoolean },
  { key: 'performance', label: 'Performance', format: formatBoolean },
  { key: 'postDateFeedback', label: 'Feedback post evento', format: formatBoolean },
  { key: 'bordereau', label: 'Bordereau', format: formatBoolean },
  { key: 'notes', label: 'Note', format: formatNotes },
];

const buildChanges = (previous: RevisionRow | null, current: RevisionRow): RevisionChange[] => {
  if (!previous) return [];

  return DIFF_FIELDS.flatMap((field) => {
    const before = field.format(previous[field.key]);
    const after = field.format(current[field.key]);
    if (before === after) return [];
    return [{ field: field.label, before, after }];
  });
};

export async function getEventRevisionHistory(eventId: number): Promise<RevisionHistoryEntry[]> {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    throw new AppError('Non sei autenticato.');
  }

  if (user.role !== 'admin') {
    throw new AppError('Non sei autorizzato.');
  }

  const context = await getEventRevisionContext(eventId);
  if (!context) return [];

  const rows = await database
    .select({
      id: events.id,
      masterEventId: events.masterEventId,
      revisionNumber: events.revisionNumber,
      protocolNumber: events.protocolNumber,
      revisionReason: events.revisionReason,
      revisionDescription: events.revisionDescription,
      revisionCreatedAt: events.revisionCreatedAt,
      revisionCreatedByName: users.name,
      title: events.title,
      status: events.status,
      eventType: events.eventType,
      availabilityStart: artistAvailabilities.startDate,
      availabilityEnd: artistAvailabilities.endDate,
      artistId: events.artistId,
      artistLabel: sql<string>`coalesce(${artists.stageName}, ${artists.name} || ' ' || ${artists.surname})`,
      venueId: events.venueId,
      venueLabel: venues.name,
      artistManagerProfileId: events.artistManagerProfileId,
      artistManagerLabel: sql<string>`case when ${profiles.id} is null then null else ${profiles.name} || ' ' || ${profiles.surname} end`,
      tourManagerEmail: events.tourManagerEmail,
      payrollConsultantEmail: events.payrollConsultantEmail,
      moCost: events.moCost,
      venueManagerCost: events.venueManagerCost,
      depositCost: events.depositCost,
      depositInvoiceNumber: events.depositInvoiceNumber,
      bookingPercentage: events.bookingPercentage,
      moArtistAdvancedExpenses: events.moArtistAdvancedExpenses,
      artistNetCost: events.artistNetCost,
      artistUpfrontCost: events.artistUpfrontCost,
      hotel: events.hotel,
      hotelCost: events.hotelCost,
      restaurant: events.restaurant,
      restaurantCost: events.restaurantCost,
      eveningContact: events.eveningContact,
      moCoordinatorId: events.moCoordinatorId,
      moCoordinatorLabel: sql<string>`case when ${moCoordinators.id} is null then null else ${moCoordinators.name} || ' ' || ${moCoordinators.surname} end`,
      totalCost: events.totalCost,
      transportationsCost: events.transportationsCost,
      cashBalanceCost: events.cashBalanceCost,
      soundCheckStart: events.soundCheckStart,
      soundCheckEnd: events.soundCheckEnd,
      tecnicalRiderUrl: events.tecnicalRiderUrl,
      tecnicalRiderName: events.tecnicalRiderName,
      paymentDate: events.paymentDate,
      contractSigning: events.contractSigning,
      depositInvoiceIssuing: events.depositInvoiceIssuing,
      depositReceiptVerification: events.depositReceiptVerification,
      techSheetSubmission: events.techSheetSubmission,
      artistEngagement: events.artistEngagement,
      professionalsEngagement: events.professionalsEngagement,
      accompanyingPersonsEngagement: events.accompanyingPersonsEngagement,
      performance: events.performance,
      postDateFeedback: events.postDateFeedback,
      bordereau: events.bordereau,
    })
    .from(events)
    .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
    .innerJoin(artists, eq(events.artistId, artists.id))
    .innerJoin(venues, eq(events.venueId, venues.id))
    .leftJoin(profiles, eq(events.artistManagerProfileId, profiles.id))
    .leftJoin(moCoordinators, eq(events.moCoordinatorId, moCoordinators.id))
    .leftJoin(users, eq(events.revisionCreatedByUserId, users.id))
    .where(or(eq(events.id, context.masterEventId), eq(events.masterEventId, context.masterEventId)))
    .orderBy(asc(events.revisionNumber));

  const eventIds = rows.map((row) => row.id);
  const notesByEvent: Record<number, string[]> = {};

  if (eventIds.length > 0) {
    const notes = await database
      .select({
        eventId: eventNotes.eventId,
        content: eventNotes.content,
      })
      .from(eventNotes)
      .where(inArray(eventNotes.eventId, eventIds))
      .orderBy(eventNotes.createdAt);

    for (const note of notes) {
      if (!notesByEvent[note.eventId]) notesByEvent[note.eventId] = [];
      notesByEvent[note.eventId].push(note.content);
    }
  }

  const normalizedRows: RevisionRow[] = rows.map((row) => ({
    ...row,
    notes: notesByEvent[row.id] ?? [],
  }));

  const history: RevisionHistoryEntry[] = [];
  let previous: RevisionRow | null = null;

  for (const row of normalizedRows) {
    history.push({
      id: row.id,
      revisionNumber: row.revisionNumber ?? 0,
      protocolNumber: row.protocolNumber,
      reason: row.revisionReason,
      description: row.revisionDescription,
      createdAt: row.revisionCreatedAt,
      createdBy: row.revisionCreatedByName,
      changes: buildChanges(previous, row),
    });
    previous = row;
  }

  return history;
}
