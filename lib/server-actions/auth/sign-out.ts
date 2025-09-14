'use server';

import { auth } from '@/lib/auth';
import { ServerActionResponse } from '@/lib/types';
import { APIError } from 'better-auth/api';
import { getBetterAuthErrorMessage } from '@/lib/utils';
import { AppError } from '@/lib/classes/AppError';
import { headers } from 'next/headers';

export const signOut = async (): Promise<ServerActionResponse<null>> => {
  const requestHeaders = await headers();

  try {
    await auth.api.signOut({
      headers: requestHeaders,
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[signOut] error', error);

    let message = 'Disconnessione non riuscita.';
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
