'use server';

import { auth } from '@/lib/auth';
import { APIError } from 'better-auth/api';
import { getBetterAuthErrorMessage } from '@/lib/utils';
import { ServerActionResponse } from '@/lib/types';
import { z } from 'zod/v4';
import { headers } from 'next/headers';
import { AppError } from '@/lib/classes/AppError';
import { passwordValidation } from '@/lib/validation/_general';

export const updateUserPassword = async (userId: string, newPassword: string): Promise<ServerActionResponse<null>> => {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user || session.user.role != 'admin') {
      console.error('[updateUserPassword] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const schema = z.object({
      userId: z.uuid('Campo malformato.'),
      newPassword: passwordValidation,
    });

    const validation = schema.safeParse({ userId, newPassword });
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const ctx = await auth.$context;
    const hash = await ctx.password.hash(newPassword);
    await ctx.internalAdapter.updatePassword(userId, hash);

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[updateUserPassword] transaction failed:', error);

    let message = 'Aggiornamento password non riuscito.';
    if (error instanceof APIError && error.body?.code) {
      message = getBetterAuthErrorMessage(error.body.code);
    }

    return {
      success: false,
      message: error instanceof AppError ? error.message : message,
      data: null,
    };
  }
};
