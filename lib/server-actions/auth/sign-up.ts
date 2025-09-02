'use server';

import { auth } from '@/lib/auth';
import { ServerActionResponse } from '@/lib/types';
import { APIError } from 'better-auth/api';
import { getBetterAuthErrorMessage } from '@/lib/utils';
import { AppError } from '@/lib/classes/AppError';
import { signUpSchema, SignUpSchema } from '@/lib/validation/auth/sign-up-schema';

export const signUp = async (data: SignUpSchema): Promise<ServerActionResponse<null>> => {
  try {
    const validation = signUpSchema.safeParse(data);

    if (!validation.success) {
      console.error('[signUp] - Error: validation failed', validation.error.issues[0]);
      throw new AppError('Dati inviati non validi.');
    }

    const { email, password } = validation.data;

    const { user } = await auth.api.createUser({
      body: {
        email: email,
        password: password,
        name: '',
        role: 'user',
        data: {
          status: 'waiting-for-approval',
        },
      },
    });

    if (!user || !user.email) {
      throw new AppError("Errore durante la creazione dell'account.");
    }

    await auth.api.sendVerificationOTP({
      body: {
        email: email,
        type: 'email-verification',
      },
    });

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[signUp] error', error);

    let message = 'Creazione account non riuscita.';
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
