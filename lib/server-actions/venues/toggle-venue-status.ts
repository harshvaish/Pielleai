'use server';

import { auth } from '@/lib/auth';
import { AppError } from '@/lib/classes/AppError';
import { database } from '@/lib/database/connection';
import { userStatus, venues } from '@/lib/database/schema';
import { ServerActionResponse, UserStatus } from '@/lib/types';
import { idValidation } from '@/lib/validation/_general';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod/v4';

export async function toggleVenueStatus(
  venueId: number,
  initialStatus: UserStatus,
): Promise<ServerActionResponse<null>> {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[toggleVenueStatus] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const schema = z.object({
      venueId: idValidation,
      initialStatus: z.enum(userStatus.enumValues, "Scegli un'opzione valida."),
    });

    const validation = schema.safeParse({ venueId, initialStatus });
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const newStatus: UserStatus = initialStatus === 'active' ? 'disabled' : 'active';

    const updateResult = await database
      .update(venues)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(venues.id, venueId))
      .returning({ slug: venues.slug });

    const slug = updateResult[0]?.slug;
    if (slug) revalidateTag(`venue:${slug}`);
    revalidateTag('venues');

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[toggleVenueStatus] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento locale non riuscito.',
      data: null,
    };
  }
}
