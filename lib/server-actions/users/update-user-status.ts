'use server';

import { auth } from '@/lib/auth';
import { AppError } from '@/lib/classes/AppError';
import { database } from '@/lib/database/connection';
import { users, userStatus } from '@/lib/database/schema';
import { ServerActionResponse, UserStatus } from '@/lib/types';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { z } from 'zod/v4';

export async function updateUserStatus(userId: string, newStatus: UserStatus): Promise<ServerActionResponse<null>> {
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
      userId: z.uuid('Campo malformato.'),
      newStatus: z.enum(userStatus.enumValues, "Scegli un'opzione valida."),
    });

    const validation = schema.safeParse({ userId, newStatus });
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    await database
      .update(users)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

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
