'use server';

import { auth } from '@/lib/auth';
import { APIError } from 'better-auth/api';
import { getBetterAuthErrorMessage } from '@/lib/utils';
import { ServerActionResponse } from '@/lib/types';

export const updateUserPassword = async (
  userId: string,
  newPassword: string
): Promise<ServerActionResponse<null>> => {
  try {
    const ctx = await auth.$context;
    const hash = await ctx.password.hash(newPassword);
    await ctx.internalAdapter.updatePassword(userId, hash);

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    let message = 'Aggiornamento password non riuscito.';
    if (error instanceof APIError && error.body?.code) {
      message = getBetterAuthErrorMessage(error.body.code);
    }
    console.error('[updateUserPassword] - Error: ', error);
    return {
      success: false,
      message,
      data: null,
    };
  }
};
