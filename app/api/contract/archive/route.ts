import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';

import { database } from '@/lib/database/connection';
import {
  contracts,
  contractEmailCcs,
  contractHistory,
  artists,
  venues,
  events,
} from '../../../../drizzle/schema';
import { users } from '@/lib/database/schema';
import getSession from '@/lib/data/auth/get-session';

export const runtime = 'nodejs';

// ---- Validation ----
const archiveSchema = z.object({
  contractId: z.number().int().positive(),
  note: z.string().max(10_000).optional(), // optional custom reason/note
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Auth
    const { session, user } = await getSession();
    if (!session || !user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Non sei autorizzato.', data: null },
        { status: 401 },
      );
    }

    // Validate
    const body = await request.json();
    const parsed = archiveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Dati forniti non validi.', data: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { contractId, note } = parsed.data;

    // Tx: update status -> voided, write history, return full object
    const result = await database.transaction(async (tx) => {
      // 1) Load existing
      const existing = await tx.query.contracts.findFirst({
        where: (c, { eq }) => eq(c.id, contractId),
      });
      if (!existing) throw new Error('NOT_FOUND_CONTRACT');

      // 2) Update to voided (archive) if not already voided
      if (existing.status !== 'voided') {
        await tx
          .update(contracts)
          .set({ status: 'voided', updatedAt: new Date().toISOString() })
          .where(eq(contracts.id, contractId));
      }

      // 3) Insert history (even if already voided, we still log the request)
      await tx.insert(contractHistory).values({
        contractId,
        fromStatus: existing.status,
        toStatus: 'voided',
        fileUrl: existing.fileUrl ?? null,
        fileName: existing.fileName ?? null,
        changedByUserId: user.id,
        note: note ?? (existing.status === 'voided' ? 'Archiviazione richiesta (già archiviato).' : 'Contratto archiviato.'),
      });

      // 4) Refetch full data
      const base = await tx
        .select({
          id: contracts.id,
          status: contracts.status,
          contractDate: contracts.contractDate,
          fileUrl: contracts.fileUrl,
          fileName: contracts.fileName,
          recipientEmail: contracts.recipientEmail,
          createdAt: contracts.createdAt,
          updatedAt: contracts.updatedAt,

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
        .where(eq(contracts.id, contractId));

      const row = base[0];

      const ccs = await tx
        .select({ email: contractEmailCcs.email })
        .from(contractEmailCcs)
        .where(eq(contractEmailCcs.contractId, contractId));

      const history = await tx
        .select({
          id: contractHistory.id,
          fromStatus: contractHistory.fromStatus,
          toStatus: contractHistory.toStatus,
          fileUrl: contractHistory.fileUrl,
          fileName: contractHistory.fileName,
          note: contractHistory.note,
          changedByUserId: users.name,
          createdAt: contractHistory.createdAt,
        })
        .from(contractHistory)
        .leftJoin(users, eq(contractHistory.changedByUserId, users.id))
        .where(eq(contractHistory.contractId, contractId))
        .orderBy(desc(contractHistory.createdAt));

      return {
        ...row,
        ccs: ccs.map((c) => c.email),
        history,
      };
    });

    return NextResponse.json(
      { success: true, message: 'Contratto archiviato.', data: result },
      { status: 200 },
    );
  } catch (error: any) {
    if (error?.message === 'NOT_FOUND_CONTRACT') {
      return NextResponse.json(
        { success: false, message: 'Contratto non trovato.', data: null },
        { status: 404 },
      );
    }
    console.error('[POST /api/contract/archive] - Error:', error);
    return NextResponse.json(
      { success: false, message: 'Archiviazione contratto non riuscita.', data: null },
      { status: 500 },
    );
  }
}
