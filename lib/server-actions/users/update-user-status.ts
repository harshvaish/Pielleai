'use server';

import { auth } from '@/lib/auth';
import { AppError } from '@/lib/classes/AppError';
import { database } from '@/lib/database/connection';
import { users, userStatus } from '@/lib/database/schema';
import { ServerActionResponse, UserStatus } from '@/lib/types';
import { userIdValidation } from '@/lib/validation/_general';
import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod/v4';

export async function updateUserStatus(
  userId: string,
  newStatus: UserStatus,
): Promise<ServerActionResponse<null>> {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[updateUserStatus] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const schema = z.object({
      userId: userIdValidation,
      newStatus: z.enum(userStatus.enumValues, "Scegli un'opzione valida."),
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
      revalidateTag(`profile:${uid}`);

      if (role === 'artist-manager') {
        revalidateTag(`artist-manager:${uid}`);
        revalidateTag('artist-managers');
        revalidateTag('paginated-artist-managers');
      }

      if (role === 'venue-manager') {
        revalidateTag(`venue-manager:${uid}`);
        revalidateTag('venue-managers');
        revalidateTag('paginated-venue-managers');
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
