'use server';

import sgMail from '@sendgrid/mail';
import { ServerActionResponse } from '../types';
import { AppError } from '../classes/AppError';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface EventConfirmedEmailData {
  eventId: number;
  artistName: string;
  venueName: string;
  venueAddress: string;
  startDate: Date;
  endDate: Date;
}

export const sendEventConfirmedEmail = async (
  eventData: EventConfirmedEmailData,
): Promise<ServerActionResponse<null>> => {
  try {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new AppError('Configurazione errata del server: Chiave API SendGrid mancante.');
    }

    const recipientEmails = process.env.EVENT_CONFIRMED_NOTIFICATION_EMAILS;
    if (!recipientEmails) {
      console.error('[sendEventConfirmedEmail] - No recipient emails configured');
      throw new AppError('Nessun destinatario configurato per le notifiche.');
    }

    // Parse comma-separated emails
    const emailList = recipientEmails.split(',').map((email) => email.trim());

    // Initialize SendGrid API
    sgMail.setApiKey(apiKey);

    // Format dates
    const formattedStartDate = format(eventData.startDate, "dd MMMM yyyy 'alle' HH:mm", {
      locale: it,
    });
    const formattedEndDate = format(eventData.endDate, "dd MMMM yyyy 'alle' HH:mm", { locale: it });

    // Construct email message
    const msg = {
      to: emailList,
      from: 'info@eaglebooking.it',
      templateId: 'd-2ba1d82e128146caa517ba29d8af4342',
      dynamic_template_data: {
        event_id: eventData.eventId,
        artist_name: eventData.artistName,
        venue_name: eventData.venueName,
        venue_address: eventData.venueAddress,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      },
    };

    // Send email
    await sgMail.send(msg);

    console.log(
      `[sendEventConfirmedEmail] - Email sent successfully for event ${eventData.eventId}`,
    );

    return {
      success: true,
      message: null,
      data: null,
    };
  } catch (error) {
    console.error('[sendEventConfirmedEmail] - Error:', error);

    return {
      success: false,
      message:
        error instanceof AppError
          ? error.message
          : "Non è stato possibile inviare l'email di notifica.",
      data: null,
    };
  }
};
