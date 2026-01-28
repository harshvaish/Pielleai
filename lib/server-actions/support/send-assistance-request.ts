'use server';

import { z } from 'zod/v4';
import sgMail from '@sendgrid/mail';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { TIME_ZONE } from '@/lib/constants';
import { AppError } from '@/lib/classes/AppError';
import getSession from '@/lib/data/auth/get-session';
import { hasRole } from '@/lib/utils';
import { ServerActionResponse } from '@/lib/types';

const supportRequestSchema = z.object({
  message: z
    .string({ error: 'Messaggio non valido.' })
    .trim()
    .min(5, 'Il messaggio e troppo breve.')
    .max(2000, 'Il messaggio e troppo lungo.'),
});

const ROLE_LABELS: Record<string, string> = {
  'artist-manager': 'Manager Artista',
  'venue-manager': 'Promoter Locale',
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export async function sendAssistanceRequest(
  input: { message: string },
): Promise<ServerActionResponse<null>> {
  try {
    const { session, user } = await getSession();

    if (!session || !user || user.banned || !hasRole(user, ['artist-manager', 'venue-manager'])) {
      throw new AppError('Operazione non autorizzata.');
    }

    const validation = supportRequestSchema.safeParse(input);
    if (!validation.success) {
      throw new AppError('Dati inviati non corretti.');
    }

    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new AppError('Configurazione errata del server: Chiave API SendGrid mancante.');
    }

    const recipients =
      process.env.ASSISTANCE_NOTIFICATION_EMAILS ||
      process.env.EVENT_CONFIRMED_NOTIFICATION_EMAILS;
    if (!recipients) {
      throw new AppError('Nessun destinatario configurato per le richieste di assistenza.');
    }

    const emailList = recipients.split(',').map((email) => email.trim());
    const timestamp = format(toZonedTime(new Date(), TIME_ZONE), 'dd MMMM yyyy HH:mm', {
      locale: it,
    });

    sgMail.setApiKey(apiKey);

    const msg = {
      to: emailList,
      from: 'info@eaglebooking.it',
      subject: 'Nuova richiesta assistenza',
      text: `Nuova richiesta assistenza\n\nUtente: ${user.name}\nRuolo: ${ROLE_LABELS[user.role] ?? user.role}\nEmail: ${user.email ?? '-'}\nData: ${timestamp}\n\nMessaggio:\n${validation.data.message}`,
      html: `
        <p><strong>Nuova richiesta assistenza</strong></p>
        <p><strong>Utente:</strong> ${escapeHtml(user.name)}<br/>
        <strong>Ruolo:</strong> ${escapeHtml(ROLE_LABELS[user.role] ?? user.role)}<br/>
        <strong>Email:</strong> ${escapeHtml(user.email ?? '-')}<br/>
        <strong>Data:</strong> ${escapeHtml(timestamp)}</p>
        <p><strong>Messaggio:</strong></p>
        <p>${escapeHtml(validation.data.message).replace(/\n/g, '<br/>')}</p>
      `,
    };

    await sgMail.send(msg);

    return { success: true, message: null, data: null };
  } catch (error) {
    console.error('[sendAssistanceRequest] - Error:', error);

    return {
      success: false,
      message:
        error instanceof AppError
          ? error.message
          : "Non è stato possibile inviare la richiesta di assistenza.",
      data: null,
    };
  }
}
