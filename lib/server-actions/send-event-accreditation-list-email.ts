'use server';

import sgMail from '@sendgrid/mail';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { TIME_ZONE } from '../constants';
import { AppError } from '../classes/AppError';
import { ServerActionResponse } from '../types';

const GROUP_LABELS: Record<string, string> = {
  artist: 'Artista',
  'artist-manager': 'Manager Artista',
  booking: 'Booking',
  major: 'Major',
};

const COLOR_LABELS: Record<string, string> = {
  green: 'Verde',
  yellow: 'Giallo',
  red: 'Rosso',
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

type AccreditationGuest = {
  fullName: string;
  email: string | null;
  colorTag: string;
};

interface EventAccreditationListEmailData {
  email: string;
  venueName: string;
  venueManagerName: string | null;
  eventTitle: string;
  startDate: Date;
  endDate: Date;
  groups: Record<string, AccreditationGuest[]>;
}

export const sendEventAccreditationListEmail = async (
  data: EventAccreditationListEmailData,
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

    const groupOrder = ['artist', 'artist-manager', 'booking', 'major'];
    const groups = groupOrder
      .filter((key) => (data.groups[key] ?? []).length)
      .map((key) => ({
        key,
        label: GROUP_LABELS[key] ?? key,
        guests: data.groups[key] ?? [],
      }));

    const totalGuests = groups.reduce((sum, group) => sum + group.guests.length, 0);

    const textGroups = groups
      .map((group) => {
        const lines = group.guests
          .map((guest) => {
            const colorLabel = COLOR_LABELS[guest.colorTag] ?? guest.colorTag;
            const emailLabel = guest.email ? ` (${guest.email})` : '';
            return `- ${guest.fullName}${emailLabel} [${colorLabel}]`;
          })
          .join('\n');
        return `${group.label}:\n${lines || '-'}\n`;
      })
      .join('\n');

    const htmlGroups = groups
      .map((group) => {
        const rows = group.guests
          .map((guest) => {
            const colorLabel = COLOR_LABELS[guest.colorTag] ?? guest.colorTag;
            return `
              <tr>
                <td>${escapeHtml(guest.fullName)}</td>
                <td>${escapeHtml(guest.email ?? '-')}</td>
                <td>${escapeHtml(colorLabel)}</td>
              </tr>
            `;
          })
          .join('');

        return `
          <h3>${escapeHtml(group.label)}</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Tag colore</th>
              </tr>
            </thead>
            <tbody>
              ${rows || '<tr><td colspan="3">-</td></tr>'}
            </tbody>
          </table>
        `;
      })
      .join('');

    const greeting = data.venueManagerName
      ? `Ciao ${data.venueManagerName},`
      : `Ciao ${data.venueName},`;

    const msg = {
      to: data.email,
      from: 'info@eaglebooking.it',
      subject: `Accreditation List: ${data.eventTitle}`,
      text: `${greeting}\n\nEcco la lista accrediti per l'evento "${data.eventTitle}" (${data.venueName}).\nInizio: ${start}\nFine: ${end}\nTotale invitati: ${totalGuests}\n\n${textGroups}`,
      html: `
        <style>
          body { font-family: Arial, Helvetica, sans-serif; color: #111; }
          h2 { margin-bottom: 6px; }
          h3 { margin-top: 20px; margin-bottom: 8px; }
          .meta { color: #555; font-size: 13px; }
          .table { width: 100%; border-collapse: collapse; font-size: 13px; }
          .table th, .table td { text-align: left; border-bottom: 1px solid #ddd; padding: 6px 4px; }
          .table th { background: #f5f5f5; }
        </style>
        <p>${escapeHtml(greeting)}</p>
        <h2>Lista accrediti</h2>
        <p class="meta"><strong>Evento:</strong> ${escapeHtml(data.eventTitle)}<br/>
        <strong>Locale:</strong> ${escapeHtml(data.venueName)}<br/>
        <strong>Inizio:</strong> ${escapeHtml(start)}<br/>
        <strong>Fine:</strong> ${escapeHtml(end)}<br/>
        <strong>Totale invitati:</strong> ${totalGuests}</p>
        ${htmlGroups}
      `,
    };

    await sgMail.send(msg);

    return { success: true, message: null, data: null };
  } catch (error) {
    console.error('[sendEventAccreditationListEmail] - Error:', error);

    return {
      success: false,
      message:
        error instanceof AppError
          ? error.message
          : "Non è stato possibile inviare l'email della lista accrediti.",
      data: null,
    };
  }
};
