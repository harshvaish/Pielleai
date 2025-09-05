'use server';

import sgMail from '@sendgrid/mail';
import { ServerActionResponse } from '../types';
import { z } from 'zod/v4';
import { AppError } from '../classes/AppError';
import { emailValidation } from '../validation/_general';

export const sendOTPEmail = async (
  userEmail: string,
  code: string,
): Promise<ServerActionResponse<null>> => {
  try {
    const schema = z.object({
      userEmail: emailValidation,
      code: z.string().trim(),
    });

    const validation = schema.safeParse({ userEmail, code });
    if (!validation.success) {
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
      from: 'tech@uilconvenzioni.it',
      templateId: 'd-31cad32ba6a7471c993aa92279090b49',
      dynamic_template_data: {
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/conferma-email/manager-artisti`,
        code: code,
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
    console.error('[sendOTPEmail] transaction failed:', error);

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
