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
  artistAvailabilities,
} from '../../../../drizzle/schema';
import { users } from '@/lib/database/schema';
import getSession from '@/lib/data/auth/get-session';

export const runtime = 'nodejs';

// ------------- Validation -------------
const editSchema = z.object({
  contractId: z.number().int().positive(),

  // optional fields to update
  status: z.enum(['draft', 'queued', 'sent', 'viewed', 'signed', 'voided']).optional(),
  contractDate: z.coerce.date().transform((d) => d.toISOString().slice(0, 10)).optional(),
  fileUrl: z.string().url().optional(),
  fileName: z.string().min(1).optional(),
  recipientEmail: z.string().email().nullable().optional(),

  // optional CCs (replaces existing)
  ccEmails: z.array(z.string().email()).optional(),

  // optional note for history
  note: z.string().max(10_000).optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ---- Authentication ----
    const { session, user } = await getSession();
    if (!session || !user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Non sei autorizzato.', data: null },
        { status: 401 },
      );
    }

    // ---- Validation ----
    const body = await request.json();
    const parsed = editSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Dati forniti non validi.', data: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const {
      contractId,
      status,
      contractDate,
      fileUrl,
      fileName,
      recipientEmail,
      ccEmails,
      note,
    } = parsed.data;

    // ---- Transaction ----
    const updated = await database.transaction(async (tx) => {
      // 1️⃣ Find existing contract
      const existing = await tx.query.contracts.findFirst({
        where: (c, { eq }) => eq(c.id, contractId),
      });

      if (!existing) throw new Error('NOT_FOUND_CONTRACT');

      // 2️⃣ Prepare updates
      const updateValues: Partial<typeof contracts.$inferInsert> = {
        updatedAt: new Date().toISOString(),
      };
      if (status !== undefined) updateValues.status = status;
      if (contractDate !== undefined) updateValues.contractDate = contractDate as any;
      if (fileUrl !== undefined) updateValues.fileUrl = fileUrl;
      if (fileName !== undefined) updateValues.fileName = fileName;
      if (recipientEmail !== undefined) updateValues.recipientEmail = recipientEmail ?? null;

      if (Object.keys(updateValues).length > 0) {
        await tx.update(contracts).set(updateValues).where(eq(contracts.id, contractId));

        // If status changed to 'signed', activate payment flow
        if (status === 'signed' && existing.status !== 'signed') {
          const eventResults = await tx
            .select({
              paymentStatus: events.paymentStatus,
              totalCost: events.totalCost,
              startDate: artistAvailabilities.startDate,
            })
            .from(events)
            .innerJoin(artistAvailabilities, eq(events.availabilityId, artistAvailabilities.id))
            .where(eq(events.id, existing.eventId));

          const eventData = eventResults[0];

          if (eventData?.paymentStatus === 'pending') {
            const now = new Date().toISOString();
            const totalCost = eventData.totalCost ? parseFloat(eventData.totalCost) : 0;
            const upfrontAmount = (totalCost * 0.5).toFixed(2);
            const finalBalanceAmount = (totalCost * 0.5).toFixed(2);

            let finalBalanceDeadline = null;
            if (eventData.startDate) {
              const deadline = new Date(eventData.startDate);
              deadline.setDate(deadline.getDate() - 2);
              finalBalanceDeadline = deadline.toISOString();
            }

            await tx.update(events).set({
              paymentStatus: 'upfront-required',
              upfrontPaymentAmount: upfrontAmount,
              finalBalanceAmount: finalBalanceAmount,
              finalBalanceDeadline: finalBalanceDeadline,
              paymentPendingAt: now,
              upfrontRequiredAt: now,
            }).where(eq(events.id, existing.eventId));
          }
        }
      }

      // 3️⃣ Replace CCs if provided
      if (ccEmails !== undefined) {
        const deduped = Array.from(new Set(ccEmails.map((e) => e.toLowerCase())));
        await tx.delete(contractEmailCcs).where(eq(contractEmailCcs.contractId, contractId));
        if (deduped.length) {
          await tx.insert(contractEmailCcs).values(
            deduped.map((email) => ({
              contractId,
              email,
            })),
          );
        }
      }

      // 4️⃣ Insert into contract_history
      const toStatus = status ?? existing.status;
      await tx.insert(contractHistory).values({
        contractId,
        fromStatus: existing.status,
        toStatus,
        fileUrl: fileUrl ?? existing.fileUrl ?? null,
        fileName: fileName ?? existing.fileName ?? null,
        changedByUserId: user.id,
        note: note ?? 'Contratto aggiornato',
      });

      // 5️⃣ Refetch contract + artist/venue/event + all history
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

      const contractRow = base[0];

      // get all ccs
      const ccs = await tx
        .select({
          email: contractEmailCcs.email,
        })
        .from(contractEmailCcs)
        .where(eq(contractEmailCcs.contractId, contractId));

      // get all history entries
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
        ...contractRow,
        ccs: ccs.map((c) => c.email),
        history,
      };
    });

    return NextResponse.json(
      { success: true, message: 'Contratto aggiornato con successo.', data: updated },
      { status: 200 },
    );
  } catch (error: any) {
    if (error?.message === 'NOT_FOUND_CONTRACT') {
      return NextResponse.json(
        { success: false, message: 'Contratto non trovato.', data: null },
        { status: 404 },
      );
    }
    console.error('[POST /api/contract/edit] - Error:', error);
    return NextResponse.json(
      { success: false, message: 'Aggiornamento contratto non riuscito.', data: null },
      { status: 500 },
    );
  }
}
