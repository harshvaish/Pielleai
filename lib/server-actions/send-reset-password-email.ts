'use server';

import sgMail from '@sendgrid/mail';
import { ServerActionResponse } from '../types';
import { z } from 'zod/v4';
import { AppError } from '../classes/AppError';
import { emailValidation } from '../validation/_general';

export const sendResetPasswordEmail = async (
  userEmail: string,
  url: string,
): Promise<ServerActionResponse<null>> => {
  try {
    const schema = z.object({
      userEmail: emailValidation,
      url: z.url('Inserisci un link valido.').trim(),
    });

    const validation = schema.safeParse({ userEmail, url });
    if (!validation.success) {
      console.log(validation.error.issues[0]);
      throw new AppError('Dati inviati non corretti.');
    }

    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new AppError('Configurazione errata del server: Chiave API SendGrid mancante.');
    }

    // Initialize SendGrid API
    sgMail.setApiKey(apiKey);

    // Construct email message
    const msg = {
      to: userEmail,
      from: 'info@eaglebooking.it',
      templateId: 'd-136e1d3210084867b0c4917d4ac68c05',
      dynamic_template_data: {
        redirect_url: url,
      },
    };

    // Send email
    await sgMail.send(msg);

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[sendResetPasswordEmail] transaction failed:', error);

    return {
      success: false,
      message:
        error instanceof AppError
          ? error.message
          : "Non è stato possibile inviare l'email. Riprovare più tardi.",
      data: null,
    };
  }
};
