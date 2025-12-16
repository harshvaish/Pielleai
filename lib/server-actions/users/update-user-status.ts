'use server';

import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { database } from '@/lib/database/connection';
import { users } from '@/lib/database/schema';
import { ServerActionResponse, UserStatus } from '@/lib/types';
import { userIdValidation, userStatusEnumValidation } from '@/lib/validation/_general';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { z } from 'zod/v4';

export async function updateUserStatus(
  userId: string,
  newStatus: UserStatus,
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateUserStatus] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (user.role != 'admin') {
      console.error('[updateUserStatus] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const schema = z.object({
      userId: userIdValidation,
      newStatus: userStatusEnumValidation,
    });

    const validation = schema.safeParse({ userId, newStatus });
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const banned = newStatus === 'disabled' ? true : false;

    const updateResult = await database
      .update(users)
      .set({
        status: newStatus,
        banned: banned,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({ id: users.id, role: users.role });

    const uid = updateResult[0]?.id;
    const role = updateResult[0]?.role;

    if (uid) {
      revalidateTag(`profile:${uid}`, 'max');

      if (role === 'artist-manager') {
        revalidateTag(`artist-manager:${uid}`, 'max');
        revalidateTag('artist-managers', 'max');
      }

      if (role === 'venue-manager') {
        revalidateTag(`venue-manager:${uid}`, 'max');
        revalidateTag('venue-managers', 'max');
      }
    }

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[updateUserStatus] transaction failed:', error);

    return {
      success: false,
      message: error instanceof AppError ? error.message : 'Aggiornamento utente non riuscito.',
      data: null,
    };
  }
}
