'use server';

import { desc, eq } from 'drizzle-orm';

import { ServerActionResponse } from '@/lib/types';
import { database } from '@/lib/database/connection';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';

import {
  contracts,
  contractEmailCcs,
  contractHistory,
  artists,
  venues,
  events,
  artistAvailabilities,
} from '../../../drizzle/schema';

// ----- constants -----
const CONTRACT_STATUS = ['draft', 'queued', 'sent', 'viewed', 'signed', 'voided', 'declined'] as const;
type ContractStatus = (typeof CONTRACT_STATUS)[number];

// ----- input (NO ZOD) -----
export type ContractEditInput = {
  contractId: number;

  // contract fields
  status?: ContractStatus;
  contractDate?: string | number | Date; // normalized to YYYY-MM-DD
  fileUrl?: string | null;
  fileName?: string | null;
  recipientEmail?: string | null;

  // replace CCs if provided
  ccEmails?: string[];

  // history note
  note?: string;

  // write-through payload fields (same as create)
  artistName?: string;
  artistStageName?: string;

  venueName?: string;
  venueCompanyName?: string;
  venueVatNumber?: string;
  venueAddress?: string;

  eventType?: string;
  eventDate?: string | number | Date;
  perfomanceTime?: string;

  transfortCost?: string | number;
  totalCost?: string | number;
  upfrontPayment?: string | number;
  paymentDate?: string | number | Date;
};

// ----- output -----
export type EditContractResult = {
  id: number;
  status: ContractStatus;
  contractDate: string;
  fileUrl: string | null;
  fileName: string | null;
  recipientEmail: string | null;
  createdAt: string | null;
  updatedAt: string | null;

  artist: {
    id: number;
    name: string | null;
    surname: string | null;
    stageName: string | null;
    avatarUrl: string | null;
    status: string | null;
    slug: string | null;
  };

  venue: {
    id: number;
    name: string | null;
    address: string | null;
    status: string | null;
    slug: string | null;
    avatarUrl: string | null;
  };

  event: {
    id: number;
    status: string | null;
  };

  ccs: string[];

  history: Array<{
    id: number;
    fromStatus: ContractStatus | null;
    toStatus: ContractStatus | null;
    fileUrl: string | null;
    fileName: string | null;
    note: string | null;
    changedByUserId: string | null;
    createdAt: string;
  }>;
};

// ----- helpers -----
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanStr(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim().replace(/\s+/g, ' ');
  return s.length ? s : null;
}

function toNumericString(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : null;
  if (typeof v === 'string') {
    const s = v.trim();
    return s.length ? s : null;
  }
  return null;
}

function normalizeToYyyyMmDd(input: string | number | Date, errMsg: string): string {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) throw new AppError(errMsg);
  return d.toISOString().slice(0, 10);
}

function toISOStringOrThrow(input: string | number | Date, errMsg: string): string {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) throw new AppError(errMsg);
  return d.toISOString();
}

/**
 * Rule:
 * - if artistName has 2+ words -> first word = name, remaining = surname
 * - if artistName has 1 word -> update only name
 */
function splitArtistName(full: unknown): { name?: string; surname?: string } {
  const cleaned = cleanStr(full);
  if (!cleaned) return {};
  const parts = cleaned.split(' ');
  if (parts.length === 1) return { name: parts[0] };
  return { name: parts[0], surname: parts.slice(1).join(' ') };
}

function hasKeys(obj: Record<string, unknown>) {
  return Object.keys(obj).length > 0;
}

/**
 * Combines eventDate + perfomanceTime ("HH:mm") into a Date.
 * If perfomanceTime invalid/missing -> keep date as-is.
 */
function buildEventStartDate(eventDate: string | number | Date, perfomanceTime?: string | null): Date {
  const d = eventDate instanceof Date ? new Date(eventDate) : new Date(eventDate);
  if (Number.isNaN(d.getTime())) throw new AppError('Data evento non valida.');

  const t = cleanStr(perfomanceTime);
  if (!t) return d;

  const m = /^(\d{1,2}):(\d{2})$/.exec(t);
  if (!m) return d;

  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (Number.isNaN(hh) || Number.isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) return d;

  d.setHours(hh, mm, 0, 0);
  return d;
}

// ----- action -----
export const editContract = async (
  data: ContractEditInput,
): Promise<ServerActionResponse<EditContractResult>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[editContract] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role !== 'admin') {
      console.error('[editContract] - Error: unauthorized', user.role);
      throw new AppError('Non sei autorizzato.');
    }

    // --- manual validation (no zod) ---
    if (!data || !Number.isInteger(data.contractId) || data.contractId <= 0) {
      throw new AppError('Contratto non valido.');
    }

    if (data.status !== undefined && !CONTRACT_STATUS.includes(data.status)) {
      throw new AppError('Stato contratto non valido.');
    }

    if (data.recipientEmail !== undefined && data.recipientEmail !== null) {
      const email = cleanStr(data.recipientEmail);
      if (email && !isValidEmail(email)) throw new AppError('Email destinatario non valida.');
    }

    if (data.ccEmails !== undefined && !Array.isArray(data.ccEmails)) {
      throw new AppError('CC emails non validi.');
    }

    if (data.note !== undefined && typeof data.note !== 'string') {
      throw new AppError('Nota non valida.');
    }

    const updated = await database.transaction(async (tx) => {
      // STEP 1: load existing contract (and ids needed)
      const existing = await tx.query.contracts.findFirst({
        where: (c, { eq }) => eq(c.id, data.contractId),
        columns: {
          id: true,
          status: true,
          contractDate: true,
          fileUrl: true,
          fileName: true,
          recipientEmail: true,
          artistId: true,
          venueId: true,
          eventId: true,
        },
      });

      if (!existing) throw new AppError('Contratto non trovato.');

      // also need availabilityId for eventDate/perfomanceTime updates
      const ev = await tx.query.events.findFirst({
        where: (e, { eq }) => eq(e.id, existing.eventId),
        columns: { id: true, availabilityId: true },
      });

      // STEP 2: update contract fields
      const updateValues: Partial<typeof contracts.$inferInsert> = {};

      if (data.status !== undefined) updateValues.status = data.status as any;

      if (data.contractDate !== undefined) {
        updateValues.contractDate = normalizeToYyyyMmDd(data.contractDate, 'Data contratto non valida.') as any;
      }

      if (data.fileUrl !== undefined) updateValues.fileUrl = data.fileUrl ?? null;
      if (data.fileName !== undefined) updateValues.fileName = data.fileName ?? null;

      if (data.recipientEmail !== undefined) {
        const email = data.recipientEmail === null ? null : cleanStr(data.recipientEmail);
        updateValues.recipientEmail = email ?? null;
      }

      if (Object.keys(updateValues).length > 0) {
        // updatedAt type varies by drizzle config; string is safest in your project pattern
        (updateValues as any).updatedAt = new Date().toISOString();
        await tx.update(contracts).set(updateValues).where(eq(contracts.id, data.contractId));
      }

      // STEP 3: write-through updates (artists/venues/events/availability)
      // --- artists ---
      const artistPatch: Partial<typeof artists.$inferInsert> = {};
      const split = splitArtistName(data.artistName);
      if (split.name) artistPatch.name = split.name;
      if (split.surname) artistPatch.surname = split.surname;

      const stageName = cleanStr(data.artistStageName);
      if (stageName) artistPatch.stageName = stageName;

      if (hasKeys(artistPatch)) {
        await tx.update(artists).set(artistPatch).where(eq(artists.id, existing.artistId));
      }

      // --- venues ---
      const venuePatch: Partial<typeof venues.$inferInsert> = {};
      const venueName = cleanStr(data.venueName);
      if (venueName) venuePatch.name = venueName;

      const venueCompanyName = cleanStr(data.venueCompanyName);
      if (venueCompanyName) venuePatch.company = venueCompanyName;

      const venueVatNumber = cleanStr(data.venueVatNumber);
      if (venueVatNumber) venuePatch.vatCode = venueVatNumber;

      const venueAddress = cleanStr(data.venueAddress);
      if (venueAddress) venuePatch.address = venueAddress;

      if (hasKeys(venuePatch)) {
        await tx.update(venues).set(venuePatch).where(eq(venues.id, existing.venueId));
      }

      // --- events ---
      const eventPatch: Partial<typeof events.$inferInsert> = {};
      const eventType = cleanStr(data.eventType);
      if (eventType) (eventPatch as any).eventType = eventType; // requires column exists in DB

      const transportCost = toNumericString(data.transfortCost);
      if (transportCost !== null) eventPatch.transportationsCost = transportCost as any;

      const totalCost = toNumericString(data.totalCost);
      if (totalCost !== null) eventPatch.totalCost = totalCost as any;

      const upfrontPayment = toNumericString(data.upfrontPayment);
      if (upfrontPayment !== null) eventPatch.artistUpfrontCost = upfrontPayment as any;

      if (data.paymentDate) {
        // your events.paymentDate is mode:'string' in schema
        (eventPatch as any).paymentDate = toISOStringOrThrow(data.paymentDate, 'Data pagamento non valida.');
      }

      if (hasKeys(eventPatch)) {
        await tx.update(events).set(eventPatch).where(eq(events.id, existing.eventId));
      }

      // --- availability.startDate (eventDate + perfomanceTime) ---
      if (data.eventDate && ev?.availabilityId) {
        const start = buildEventStartDate(data.eventDate, data.perfomanceTime);
        await tx
          .update(artistAvailabilities)
          .set({ startDate: start.toISOString() }) // string
          .where(eq(artistAvailabilities.id, ev.availabilityId));
      }

      // STEP 4: replace CCs (if provided)
      if (data.ccEmails !== undefined) {
        const deduped = Array.from(
          new Set(
            data.ccEmails
              .filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
              .map((e) => e.toLowerCase().trim())
              .filter((e) => isValidEmail(e)),
          ),
        );

        await tx.delete(contractEmailCcs).where(eq(contractEmailCcs.contractId, data.contractId));

        if (deduped.length) {
          await tx.insert(contractEmailCcs).values(
            deduped.map((email) => ({
              contractId: data.contractId,
              email,
            })),
          );
        }
      }

      // STEP 5: history row
      const toStatus = (data.status ?? existing.status) as ContractStatus;

      await tx.insert(contractHistory).values({
        contractId: data.contractId,
        fromStatus: existing.status as any,
        toStatus: toStatus as any,
        fileUrl: (data.fileUrl ?? existing.fileUrl ?? null) as any,
        fileName: (data.fileName ?? existing.fileName ?? null) as any,
        changedByUserId: user.id,
        note: (typeof data.note === 'string' && data.note.trim().length ? data.note.slice(0, 10_000) : 'Contratto aggiornato') as any,
      });

      // STEP 6: hydrate response
      const [base] = await tx
        .select({
          id: contracts.id,
          status: contracts.status,
          contractDate: (contracts as any).contractDate,
          fileUrl: contracts.fileUrl,
          fileName: contracts.fileName,
          recipientEmail: (contracts as any).recipientEmail,
          createdAt: (contracts as any).createdAt,
          updatedAt: (contracts as any).updatedAt,

          artist: {
            id: artists.id,
            name: artists.name,
            surname: artists.surname,
            stageName: artists.stageName,
            avatarUrl: artists.avatarUrl,
            status: artists.status,
            slug: artists.slug,
          },

          venue: {
            id: venues.id,
            name: venues.name,
            address: venues.address,
            status: venues.status,
            slug: venues.slug,
            avatarUrl: venues.avatarUrl,
          },

          event: {
            id: events.id,
            status: events.status,
          },
        })
        .from(contracts)
        .innerJoin(artists, eq(contracts.artistId, artists.id))
        .innerJoin(venues, eq(contracts.venueId, venues.id))
        .innerJoin(events, eq(contracts.eventId, events.id))
        .where(eq(contracts.id, data.contractId));

      if (!base) throw new AppError('Aggiornamento riuscito ma contratto non recuperabile.');

      const ccs = await tx
        .select({ email: contractEmailCcs.email })
        .from(contractEmailCcs)
        .where(eq(contractEmailCcs.contractId, data.contractId));

      const historyRows = await tx
        .select({
          id: contractHistory.id,
          fromStatus: contractHistory.fromStatus,
          toStatus: contractHistory.toStatus,
          fileUrl: contractHistory.fileUrl,
          fileName: contractHistory.fileName,
          note: contractHistory.note,
          changedByUserId: contractHistory.changedByUserId,
          createdAt: contractHistory.createdAt,
        })
        .from(contractHistory)
        .where(eq(contractHistory.contractId, data.contractId))
        .orderBy(desc(contractHistory.createdAt));

      return {
        ...base,
        contractDate: String((base as any).contractDate),
        recipientEmail: (base as any).recipientEmail ?? null,
        createdAt: (base as any).createdAt ? String((base as any).createdAt) : null,
        updatedAt: (base as any).updatedAt ? String((base as any).updatedAt) : null,
        ccs: ccs.map((c) => c.email),
        history: historyRows.map((h) => ({
          id: h.id,
          fromStatus: (h.fromStatus ?? null) as ContractStatus | null,
          toStatus: (h.toStatus ?? null) as ContractStatus | null,
          fileUrl: h.fileUrl ?? null,
          fileName: h.fileName ?? null,
          note: h.note ?? null,
          changedByUserId: (h.changedByUserId ?? null) as any,
          createdAt: String(h.createdAt),
        })),
      } satisfies EditContractResult;
    });

    return { success: true, message: null, data: updated };
  } catch (error) {
    console.error('[editContract] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento contratto non riuscito.',
      data: null,
    };
  }
};
