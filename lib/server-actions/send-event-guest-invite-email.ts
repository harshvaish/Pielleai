'use server';

import sgMail from '@sendgrid/mail';
import { ServerActionResponse } from '../types';
import { AppError } from '../classes/AppError';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { TIME_ZONE } from '../constants';

interface EventGuestInviteEmailData {
  email: string;
  guestName: string;
  eventTitle: string;
  venueName: string;
  startDate: Date;
  endDate: Date;
}

export const sendEventGuestInviteEmail = async (
  data: EventGuestInviteEmailData,
): Promise<ServerActionResponse<null>> => {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new AppError('Configurazione errata del server: Chiave API SendGrid mancante.');
    }

    sgMail.setApiKey(apiKey);

    const start = format(toZonedTime(data.startDate, TIME_ZONE), "dd MMMM yyyy 'alle' HH:mm", {
      locale: it,
    });
    const end = format(toZonedTime(data.endDate, TIME_ZONE), "dd MMMM yyyy 'alle' HH:mm", {
      locale: it,
    });

    const msg = {
      to: data.email,
      from: 'info@eaglebooking.it',
      subject: `Invito evento: ${data.eventTitle}`,
      text: `Ciao ${data.guestName},\n\nSei stato invitato all'evento "${data.eventTitle}" presso ${data.venueName}.\nInizio: ${start}\nFine: ${end}\n\nGrazie.`,
      html: `
        <p>Ciao ${data.guestName},</p>
        <p>Sei stato invitato all'evento <strong>${data.eventTitle}</strong> presso <strong>${data.venueName}</strong>.</p>
        <p><strong>Inizio:</strong> ${start}<br/><strong>Fine:</strong> ${end}</p>
        <p>Grazie.</p>
      `,
    };

    await sgMail.send(msg);

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[sendEventGuestInviteEmail] - Error:', error);

    return {
      success: false,
      message:
        error instanceof AppError
          ? error.message
          : "Non è stato possibile inviare l'email di invito.",
      data: null,
    };
  }
};
