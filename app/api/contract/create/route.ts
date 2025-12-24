// app/api/contract/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { and, desc, eq, inArray } from 'drizzle-orm';

import { database } from '@/lib/database/connection';
// ⬇️ IMPORTANT: keep this path consistent with your connection.ts schema import
import {
  contracts,
  contractEmailCcs,
  contractHistory,
  artists,
  venues,
  events,
} from '../../../../drizzle/schema';

import getSession from '@/lib/data/auth/get-session';

export const runtime = 'nodejs';

// ---------- Validation ----------
const contractCreateSchema = z.object({
  artistId: z.number().int().positive(),
  venueId: z.number().int().positive(),
  eventId: z.number().int().positive(),
  contractDate: z.coerce.date().transform((d) => d.toISOString().slice(0, 10)),
  fileUrl: z.string().url(),
  fileName: z.string().min(1),
  recipientEmail: z.string().email().optional(),
  ccEmails: z.array(z.string().email()).optional(),
  status: z.enum(['draft', 'queued', 'sent', 'viewed', 'signed', 'voided','declined']).default('draft').optional(),
  note: z.string().max(10_000).optional(),
});

// ---------- Handler ----------
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Auth
    const { session, user } = await getSession();
    if (!session || !user /* || user.role !== 'admin' */) {
      return NextResponse.json(
        { success: false, message: 'Non sei autorizzato.', data: null },
        { status: 401 },
      );
    }

    // Validate body
    const body = await request.json();
    const parsed = contractCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Dati forniti non validi.', data: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const {
      artistId,
      venueId,
      eventId,
      contractDate,
      fileUrl,
      fileName,
      recipientEmail,
      ccEmails = [],
      status = 'draft',
      note,
    } = parsed.data;

    // Ensure referenced rows exist
    const [artistRow, venueRow, eventRow] = await Promise.all([
      database.query.artists.findFirst({ where: (a, { eq }) => eq(a.id, artistId), columns: { id: true } }),
      database.query.venues.findFirst({ where: (v, { eq }) => eq(v.id, venueId), columns: { id: true } }),
      database.query.events.findFirst({ where: (e, { eq }) => eq(e.id, eventId), columns: { id: true } }),
    ]);

    if (!artistRow) {
      return NextResponse.json(
        { success: false, message: 'Artista non trovato.', data: null },
        { status: 404 },
      );
    }
    if (!venueRow) {
      return NextResponse.json(
        { success: false, message: 'Venue non trovata.', data: null },
        { status: 404 },
      );
    }
    if (!eventRow) {
      return NextResponse.json(
        { success: false, message: 'Evento non trovato.', data: null },
        { status: 404 },
      );
    }

    // Deduplicate CCs
    const finalCcs = Array.from(new Set(ccEmails.map((e) => e.toLowerCase())));

    // --- Transaction: insert contract + ccs + history ---
    const created = await database.transaction(async (tx) => {
      // Insert contract
      const [contractRow] = await tx
        .insert(contracts)
        .values({
          status,
          artistId,
          venueId,
          eventId,
          contractDate, // YYYY-MM-DD
          fileUrl,
          fileName,
          recipientEmail,
        })
        .returning();

      // Insert CCs (if any)
      if (finalCcs.length) {
        await tx.insert(contractEmailCcs).values(
          finalCcs.map((email) => ({
            contractId: contractRow.id,
            email,
          })),
        );
      }

      // History entry
      await tx.insert(contractHistory).values({
        contractId: contractRow.id,
        toStatus: status,
        note: note ?? 'Contratto creato',
        changedByUserId: user.id,
        fileUrl,
        fileName,
      });

      // Hydrate response in the same explicit-join style
      // 1) Base join
      const [base] = await tx
        .select({
          id: contracts.id,
          status: contracts.status,
          contractDate: contracts.contractDate,
          fileUrl: contracts.fileUrl,
          fileName: contracts.fileName,
          recipientEmail: contracts.recipientEmail,

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
        .where(eq(contracts.id, contractRow.id));

      // 2) CCs
      const ccsRows = await tx
        .select({
          contractId: contractEmailCcs.contractId,
          email: contractEmailCcs.email,
        })
        .from(contractEmailCcs)
        .where(eq(contractEmailCcs.contractId, contractRow.id));

      // 3) Latest history
      const histRows = await tx
        .select({
          id: contractHistory.id,
          contractId: contractHistory.contractId,
          fromStatus: contractHistory.fromStatus,
          toStatus: contractHistory.toStatus,
          fileUrl: contractHistory.fileUrl,
          fileName: contractHistory.fileName,
          note: contractHistory.note,
          createdAt: contractHistory.createdAt,
        })
        .from(contractHistory)
        .where(eq(contractHistory.contractId, contractRow.id))
        .orderBy(desc(contractHistory.createdAt));

      const latest = histRows[0] ?? null;

      return {
        ...base,
        ccs: ccsRows.map((r) => r.email),
        latestHistory: latest
          ? {
              id: latest.id,
              fromStatus: latest.fromStatus ?? null,
              toStatus: latest.toStatus ?? null,
              fileUrl: latest.fileUrl ?? null,
              fileName: latest.fileName ?? null,
              note: latest.note ?? null,
              createdAt: latest.createdAt,
            }
          : null,
      };
    });

    return NextResponse.json(
      { success: true, message: 'Contratto creato con successo.', data: created },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Errore creazione contratto:', error);
    const msg =
      typeof error?.message === 'string' && /unique|duplicate key|constraint/i.test(error.message)
        ? 'Violazione vincolo di unicità (esiste già un contratto attivo per questo evento).'
        : 'Creazione contratto non riuscita.';
    return NextResponse.json({ success: false, message: msg, data: null }, { status: 500 });
  }
}
