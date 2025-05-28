'use server';

import { auth } from '@/lib/auth';
import { ServerActionResponse } from '../types';
import { headers } from 'next/headers';
import { APIError } from 'better-auth/api';

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
    let message = "Autenticazione fallita, si prega di contattare l'assistenza";

    if (error instanceof APIError && error.body && error.body.code) {
      switch (error.body.code) {
        case 'INVALID_EMAIL_OR_PASSWORD':
          message = 'Email o password non valide';
          break;
        case 'NOT_ADMIN_USER':
          message =
            'Solo gli amministratori possono accedere a questa piattaforma';
          break;
      }
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
