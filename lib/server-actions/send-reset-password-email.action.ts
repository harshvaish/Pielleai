'use server';

import sgMail from '@sendgrid/mail';
import { ServerActionResponse } from '../types';

export const sendResetPasswordEmailAction = async (
  userEmail: string,
  userName: string,
  url: string
): Promise<ServerActionResponse<null>> => {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      message: 'Configurazione errata del server: Chiave API SendGrid mancante',
      data: null,
    };
  }

  try {
    // Initialize SendGrid API
    sgMail.setApiKey(apiKey);

    // Construct email message
    const msg = {
      to: userEmail,
      from: 'tech@uilconvenzioni.it',
      templateId: 'd-874a04c239354062bb98ac9c87c3819c',
      dynamic_template_data: {
        name: userName,
        reset_link: url,
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
    console.error('[sendResetPasswordEmail] - Error: ', error);

    return {
      success: false,
      message: "Non è stato possibile inviare l'email. Riprovare più tardi.",
      data: null,
    };
  }
};
