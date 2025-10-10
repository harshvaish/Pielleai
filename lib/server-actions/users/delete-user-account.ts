'use server';

import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { users } from '@/lib/database/schema';
import { ServerActionResponse } from '@/lib/types';
import { hasRole } from '@/lib/utils';
import { userIdValidation } from '@/lib/validation/_general';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { z } from 'zod/v4';

export async function deleteUserAccount(): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[deleteUserAccount] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (!hasRole(user, ['artist-manager', 'venue-manager'])) {
      console.error('[deleteUserAccount] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const schema = z.object({
      userId: userIdValidation,
    });

    const validation = schema.safeParse({ userId: user.id });
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const updateResult = await database
      .update(users)
      .set({
        status: 'disabled',
        banned: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning({ id: users.id, role: users.role });

    const uid = updateResult[0]?.id;
    const role = updateResult[0]?.role;

    if (uid) {
      revalidateTag(`profile:${uid}`);

      if (role === 'artist-manager') {
        revalidateTag(`artist-manager:${uid}`);
        revalidateTag('artist-managers');
      }

      if (role === 'venue-manager') {
        revalidateTag(`venue-manager:${uid}`);
        revalidateTag('venue-managers');
      }
    }

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[deleteUserAccount] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento utente non riuscito.',
      data: null,
    };
  }
}
