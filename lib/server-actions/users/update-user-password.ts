'use server';

import { auth } from '@/lib/auth';
import { APIError } from 'better-auth/api';
import { getBetterAuthErrorMessage } from '@/lib/utils';
import { ServerActionResponse } from '@/lib/types';
import { z } from 'zod/v4';
import { AppError } from '@/lib/classes/AppError';
import { passwordValidation, userIdValidation } from '@/lib/validation/_general';
import getSession from '@/lib/data/auth/get-session';

export const updateUserPassword = async (
  userId: string,
  newPassword: string,
): Promise<ServerActionResponse<null>> => {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned) {
      console.error('[updateUserPassword] - Error: unauthorized', session);
      throw new AppError('Non sei autenticato.');
    }

    if (userId != user.id) {
      console.error('[updateUserPassword] - Error: unauthorized', session);
      throw new AppError('Non sei autorizzato.');
    }

    const schema = z.object({
      userId: userIdValidation,
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
