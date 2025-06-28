'use server';

import { auth } from '@/lib/auth';
import { ServerActionResponse } from '../types';
import { headers } from 'next/headers';
import { APIError } from 'better-auth/api';
import { getBetterAuthErrorMessage } from '@/lib/utils';

export const signInAction = async (
  email: string,
  password: string
): Promise<ServerActionResponse<null>> => {
  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email,
        password,
      },
    });
  } catch (error) {
    let message = 'Autenticazione non riuscita.';
    if (error instanceof APIError && error.body?.code) {
      message = getBetterAuthErrorMessage(error.body.code);
    }
    console.error('[signIn] - Error: ', error);
    return {
      success: false,
      message,
      data: null,
    };
  }

  return {
    success: true,
    message: null,
    data: null,
  };
};
