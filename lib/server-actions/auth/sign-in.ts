'use server';

import { auth } from '@/lib/auth';
import { ServerActionResponse } from '@/lib/types';
import { APIError } from 'better-auth/api';
import { getBetterAuthErrorMessage } from '@/lib/utils';
import { AppError } from '@/lib/classes/AppError';
import { signInSchema, SignInSchema } from '@/lib/validation/auth/signInSchema';

export const signIn = async (data: SignInSchema): Promise<ServerActionResponse<null>> => {
  try {
    const validation = signInSchema.safeParse(data);

    if (!validation.success) {
      console.error('[signIn] - Error: validation failed', validation.error.issues[0]);
      throw new AppError('Dati inviati non validi.');
    }

    const { email, password } = validation.data;

    await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      },
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[signIn] error', error);

    let message = 'Accesso non riuscito.';
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
