'use client';

import { format, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';

import { EVENT_STATUS_LABELS } from '@/lib/constants';
import { generateEventTitle } from '@/lib/utils/generate-event-title';
import { buildEventProtocolNumber } from '@/lib/utils/event-revisions';
import type { Event, EventAccreditationGuest, EventStatus, EventType } from '@/lib/types';

type EventSummaryOverrides = {
  status?: EventStatus;
  title?: string | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  eventType?: EventType | null;
  artistName?: string | null;
  artistStageName?: string | null;
  venueName?: string | null;
  venueAddress?: string | null;
  venueCompany?: string | null;
  venueVat?: string | null;
  artistManagerName?: string | null;
  tourManagerEmail?: string | null;
  payrollConsultantEmail?: string | null;
  paymentDate?: Date | string | null;
  totalCost?: string | number | null;
  depositCost?: string | number | null;
  transportationsCost?: string | number | null;
  cashBalanceCost?: string | number | null;
  moCost?: string | number | null;
  venueManagerCost?: string | number | null;
  artistNetCost?: string | number | null;
  artistUpfrontCost?: string | number | null;
  hotel?: string | null;
  hotelCost?: string | number | null;
  restaurant?: string | null;
  restaurantCost?: string | number | null;
  eveningContact?: string | null;
  soundCheckStart?: string | null;
  soundCheckEnd?: string | null;
  notes?: string[] | null;
  protocolNumber?: string | null;
  accreditationList?: EventAccreditationGuest[] | null;
};

type EventSummaryData = {
  title: string;
  status: string;
  protocolNumber: string;
  eventType: string;
  dateLabel: string;
  timeLabel: string;
  artistName: string;
  artistStageName: string;
  venueName: string;
  venueAddress: string;
  venueCompany: string;
  venueVat: string;
  artistManagerName: string;
  tourManagerEmail: string;
  payrollConsultantEmail: string;
  paymentDate: string;
  totalCost: string;
  depositCost: string;
  transportationsCost: string;
  cashBalanceCost: string;
  moCost: string;
  venueManagerCost: string;
  artistNetCost: string;
  artistUpfrontCost: string;
  hotel: string;
  hotelCost: string;
  restaurant: string;
  restaurantCost: string;
  eveningContact: string;
  soundCheck: string;
  notes: string[];
  accreditationList: EventAccreditationGuest[];
  accreditationTotal: number;
  generatedAt: string;
};

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  'dj-set': 'DJ set',
  live: 'Live',
  festival: 'Festival',
};

const ACCREDITATION_GROUP_LABELS: Record<string, string> = {
  artist: 'Artista',
  'artist-manager': 'Manager Artista',
  booking: 'Booking',
  major: 'Major',
};

const ACCREDITATION_COLOR_LABELS: Record<string, string> = {
  green: 'Verde',
  yellow: 'Giallo',
  red: 'Rosso',
};

const currencyFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
});

const cleanupHtml2PdfArtifacts = (): void => {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('.html2pdf__overlay').forEach((node) => {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    } else {
      node.remove();
    }
  });
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const toDate = (value?: Date | string | null): Date | null => {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (value?: Date | string | null): string => {
  const parsed = toDate(value);
  return parsed ? format(parsed, 'dd/MM/yyyy', { locale: it }) : '-';
};

const formatCurrency = (value?: string | number | null): string => {
  if (value === null || value === undefined || value === '') return '-';
  const parsed = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(parsed)) {
    return typeof value === 'string' ? value : String(value);
  }
  return currencyFormatter.format(parsed);
};

const fallbackText = (value?: string | null): string =>
  value && value.trim() ? value.trim() : '-';

const buildEventSummaryData = (
  event: Event,
  overrides: EventSummaryOverrides = {},
): EventSummaryData => {
  const artistName = fallbackText(
    overrides.artistName ?? `${event.artist.name} ${event.artist.surname}`.trim(),
  );
  const artistStageName = fallbackText(overrides.artistStageName ?? event.artist.stageName ?? '');

  const venueName = fallbackText(overrides.venueName ?? event.venue.name);
  const venueAddress = fallbackText(overrides.venueAddress ?? event.venue.address);
  const venueCompany = fallbackText(overrides.venueCompany ?? event.venue.company ?? '');
  const venueVat = fallbackText(overrides.venueVat ?? event.venue.vatCode ?? '');

  const startDate = toDate(overrides.startDate ?? event.availability?.startDate);
  const endDate = toDate(overrides.endDate ?? event.availability?.endDate);
  const dateLabel = startDate
    ? endDate && !isSameDay(startDate, endDate)
      ? `${format(startDate, 'dd/MM/yyyy', { locale: it })} - ${format(endDate, 'dd/MM/yyyy', { locale: it })}`
      : format(startDate, 'dd/MM/yyyy', { locale: it })
    : '-';
  const timeLabel = startDate
    ? endDate
      ? `${format(startDate, 'HH:mm', { locale: it })} - ${format(endDate, 'HH:mm', { locale: it })}`
      : format(startDate, 'HH:mm', { locale: it })
    : '-';

  const statusValue = overrides.status ?? event.status;
  const statusLabel = EVENT_STATUS_LABELS[statusValue] ?? statusValue;
  const protocolValue =
    overrides.protocolNumber ??
    event.protocolNumber ??
    (statusValue === 'ended'
      ? buildEventProtocolNumber(event.masterEventId ?? event.id, event.revisionNumber ?? 0)
      : null);

  const eventTypeValue = overrides.eventType ?? event.eventType;
  const eventTypeLabel = eventTypeValue ? EVENT_TYPE_LABELS[eventTypeValue] : '-';

  const artistLabel = artistStageName !== '-' ? artistStageName : artistName;

  const title =
    fallbackText(overrides.title ?? event.title ?? '') !== '-'
      ? fallbackText(overrides.title ?? event.title ?? '')
      : startDate && endDate
        ? generateEventTitle(artistLabel, venueName, startDate, endDate)
        : `Evento #${event.id}`;

  const artistManagerName = fallbackText(
    overrides.artistManagerName ??
      (event.artistManager
        ? `${event.artistManager.name} ${event.artistManager.surname}`.trim()
        : ''),
  );

  const tourManagerEmail = fallbackText(overrides.tourManagerEmail ?? event.tourManagerEmail ?? '');
  const payrollConsultantEmail = fallbackText(
    overrides.payrollConsultantEmail ?? event.payrollConsultantEmail ?? '',
  );

  const paymentDate = formatDate(overrides.paymentDate ?? event.paymentDate ?? null);

  const soundCheckStart = fallbackText(overrides.soundCheckStart ?? event.soundCheckStart ?? '');
  const soundCheckEnd = fallbackText(overrides.soundCheckEnd ?? event.soundCheckEnd ?? '');
  const soundCheck =
    soundCheckStart !== '-' || soundCheckEnd !== '-'
      ? `${soundCheckStart} - ${soundCheckEnd}`
      : '-';

  const rawNotes = overrides.notes ?? event.notes?.map((note) => note.content) ?? [];
  const notes = rawNotes.map((note) => note.trim()).filter(Boolean);
  const accreditationList = (overrides.accreditationList ?? event.accreditationList ?? []).map(
    (guest) => ({
      ...guest,
      fullName: guest.fullName.trim(),
    }),
  );

  return {
    title,
    status: statusLabel,
    protocolNumber: fallbackText(protocolValue ?? ''),
    eventType: eventTypeLabel,
    dateLabel,
    timeLabel,
    artistName,
    artistStageName,
    venueName,
    venueAddress,
    venueCompany,
    venueVat,
    artistManagerName,
    tourManagerEmail,
    payrollConsultantEmail,
    paymentDate,
    totalCost: formatCurrency(overrides.totalCost ?? event.totalCost ?? null),
    depositCost: formatCurrency(overrides.depositCost ?? event.depositCost ?? null),
    transportationsCost: formatCurrency(
      overrides.transportationsCost ?? event.transportationsCost ?? null,
    ),
    cashBalanceCost: formatCurrency(overrides.cashBalanceCost ?? event.cashBalanceCost ?? null),
    moCost: formatCurrency(overrides.moCost ?? event.moCost ?? null),
    venueManagerCost: formatCurrency(overrides.venueManagerCost ?? event.venueManagerCost ?? null),
    artistNetCost: formatCurrency(overrides.artistNetCost ?? event.artistNetCost ?? null),
    artistUpfrontCost: formatCurrency(overrides.artistUpfrontCost ?? event.artistUpfrontCost ?? null),
    hotel: fallbackText(overrides.hotel ?? event.hotel ?? ''),
    hotelCost: formatCurrency(overrides.hotelCost ?? event.hotelCost ?? null),
    restaurant: fallbackText(overrides.restaurant ?? event.restaurant ?? ''),
    restaurantCost: formatCurrency(overrides.restaurantCost ?? event.restaurantCost ?? null),
    eveningContact: fallbackText(overrides.eveningContact ?? event.eveningContact ?? ''),
    soundCheck,
    notes,
    accreditationList,
    accreditationTotal: accreditationList.length,
    generatedAt: format(new Date(), 'dd/MM/yyyy HH:mm', { locale: it }),
  };
};

const buildEventSummaryHtml = (data: EventSummaryData): string => {
  const notesHtml = data.notes.length
    ? data.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')
    : '<li>-</li>';
  const accreditationGroups = data.accreditationList.reduce<Record<string, EventAccreditationGuest[]>>(
    (acc, guest) => {
      const key = guest.originGroup ?? 'other';
      if (!acc[key]) acc[key] = [];
      acc[key].push(guest);
      return acc;
    },
    {},
  );

  const accreditationHtml = data.accreditationList.length
    ? `
      <div class="section">
        <div class="section-title">Accrediti</div>
        <div class="meta">Totale invitati: ${data.accreditationTotal}</div>
        ${Object.entries(accreditationGroups)
          .map(([groupKey, guests]) => {
            const label = ACCREDITATION_GROUP_LABELS[groupKey] ?? groupKey;
            const rows = guests
              .map(
                (guest) => `
                  <tr>
                    <td>${escapeHtml(guest.fullName)}</td>
                    <td>${escapeHtml(guest.email ?? '-')}</td>
                    <td>${escapeHtml(
                      ACCREDITATION_COLOR_LABELS[guest.colorTag] ?? guest.colorTag,
                    )}</td>
                  </tr>
                `,
              )
              .join('');
            return `
              <div class="subsection">
                <div class="subsection-title">${escapeHtml(label)}</div>
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
              </div>
            `;
          })
          .join('')}
      </div>
    `
    : '';

  return `
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; color: #111; }
      .summary { padding: 12px 16px; }
      .header { border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 14px; }
      .title { font-size: 20px; font-weight: 700; }
      .subtitle { font-size: 12px; color: #444; margin-top: 4px; }
      .meta { font-size: 11px; color: #666; margin-top: 6px; }
      .section { margin-top: 14px; }
      .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #555; margin-bottom: 6px; }
      .subsection { margin-top: 10px; }
      .subsection-title { font-size: 11px; font-weight: 700; margin-bottom: 4px; color: #444; }
      .grid { display: grid; grid-template-columns: 160px 1fr; gap: 6px 12px; font-size: 12px; }
      .label { color: #555; font-weight: 600; }
      .value { color: #111; }
      .notes { margin: 6px 0 0; padding-left: 18px; }
      .notes li { margin-bottom: 4px; }
      .table { width: 100%; border-collapse: collapse; font-size: 12px; }
      .table th, .table td { text-align: left; border-bottom: 1px solid #ddd; padding: 4px; }
      .table th { background: #f5f5f5; }
    </style>
    <div class="summary">
      <div class="header">
        <div class="title">Scheda evento</div>
        <div class="subtitle">${escapeHtml(data.title)}</div>
        <div class="meta">Generato il ${escapeHtml(data.generatedAt)}</div>
      </div>

      <div class="section">
        <div class="section-title">Evento</div>
        <div class="grid">
          <div class="label">Stato</div><div class="value">${escapeHtml(data.status)}</div>
          <div class="label">Protocollo</div><div class="value">${escapeHtml(data.protocolNumber)}</div>
          <div class="label">Tipologia</div><div class="value">${escapeHtml(data.eventType)}</div>
          <div class="label">Data</div><div class="value">${escapeHtml(data.dateLabel)}</div>
          <div class="label">Orario</div><div class="value">${escapeHtml(data.timeLabel)}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Artista</div>
        <div class="grid">
          <div class="label">Nome</div><div class="value">${escapeHtml(data.artistName)}</div>
          <div class="label">Nome d'arte</div><div class="value">${escapeHtml(data.artistStageName)}</div>
          <div class="label">Manager</div><div class="value">${escapeHtml(data.artistManagerName)}</div>
          <div class="label">Tour manager</div><div class="value">${escapeHtml(data.tourManagerEmail)}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Venue</div>
        <div class="grid">
          <div class="label">Nome</div><div class="value">${escapeHtml(data.venueName)}</div>
          <div class="label">Indirizzo</div><div class="value">${escapeHtml(data.venueAddress)}</div>
          <div class="label">Societa</div><div class="value">${escapeHtml(data.venueCompany)}</div>
          <div class="label">Partita IVA</div><div class="value">${escapeHtml(data.venueVat)}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Costi & pagamenti</div>
        <div class="grid">
          <div class="label">Costo totale</div><div class="value">${escapeHtml(data.totalCost)}</div>
          <div class="label">Acconto</div><div class="value">${escapeHtml(data.depositCost)}</div>
          <div class="label">Trasporti</div><div class="value">${escapeHtml(data.transportationsCost)}</div>
          <div class="label">Saldo cassa</div><div class="value">${escapeHtml(data.cashBalanceCost)}</div>
          <div class="label">Costo MO</div><div class="value">${escapeHtml(data.moCost)}</div>
          <div class="label">Costo venue manager</div><div class="value">${escapeHtml(data.venueManagerCost)}</div>
          <div class="label">Costo netto artista</div><div class="value">${escapeHtml(data.artistNetCost)}</div>
          <div class="label">Anticipo artista</div><div class="value">${escapeHtml(data.artistUpfrontCost)}</div>
          <div class="label">Data pagamento</div><div class="value">${escapeHtml(data.paymentDate)}</div>
          <div class="label">Consulente payroll</div><div class="value">${escapeHtml(data.payrollConsultantEmail)}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Logistica</div>
        <div class="grid">
          <div class="label">Hotel</div><div class="value">${escapeHtml(data.hotel)}</div>
          <div class="label">Costo hotel</div><div class="value">${escapeHtml(data.hotelCost)}</div>
          <div class="label">Ristorante</div><div class="value">${escapeHtml(data.restaurant)}</div>
          <div class="label">Costo ristorante</div><div class="value">${escapeHtml(data.restaurantCost)}</div>
          <div class="label">Contatto serata</div><div class="value">${escapeHtml(data.eveningContact)}</div>
          <div class="label">Soundcheck</div><div class="value">${escapeHtml(data.soundCheck)}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Note</div>
        <ul class="notes">${notesHtml}</ul>
      </div>
      ${accreditationHtml}
    </div>
  `;
};

export async function generateEventSummaryPdfBlob(
  event: Event,
  overrides: EventSummaryOverrides = {},
): Promise<{ blob: Blob; summary: EventSummaryData }> {
  const summary = buildEventSummaryData(event, overrides);
  const html = buildEventSummaryHtml(summary);

  const container = document.createElement('div');
  container.innerHTML = html;

  const { default: html2pdf } = await import('html2pdf.js');

  let blob: Blob;
  try {
    blob = await html2pdf()
      .set({
        margin: 10,
        html2canvas: {
          scale: 2,
          onclone: (doc: Document) => {
            const style = doc.createElement('style');
            style.innerHTML = `
              :root {
                --background: #ffffff;
                --foreground: #111111;
                --card: #ffffff;
                --card-foreground: #111111;
                --popover: #ffffff;
                --popover-foreground: #111111;
                --primary: #111111;
                --primary-foreground: #ffffff;
                --secondary: #f5f5f5;
                --secondary-foreground: #111111;
                --muted: #f5f5f5;
                --muted-foreground: #666666;
                --accent: #f5f5f5;
                --accent-foreground: #111111;
                --destructive: #dc2626;
                --border: #dddddd;
                --input: #dddddd;
                --ring: #dddddd;
                --chart-1: #f97316;
                --chart-2: #14b8a6;
                --chart-3: #1e3a8a;
                --chart-4: #facc15;
                --chart-5: #f59e0b;
                --sidebar: #ffffff;
                --sidebar-foreground: #111111;
                --sidebar-primary: #111111;
                --sidebar-primary-foreground: #ffffff;
                --sidebar-accent: #f5f5f5;
                --sidebar-accent-foreground: #111111;
                --sidebar-border: #dddddd;
                --sidebar-ring: #dddddd;
              }
              * {
                color: #111111 !important;
                background: #ffffff !important;
                border-color: #dddddd !important;
                outline-color: #dddddd !important;
                box-shadow: none !important;
              }
            `;
            doc.head.appendChild(style);
          },
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(container)
      .outputPdf('blob');
  } finally {
    cleanupHtml2PdfArtifacts();
  }

  return { blob, summary };
}

const createSummaryFileName = (summary: EventSummaryData, eventId: number): string => {
  const baseTitle = summary.title && summary.title !== '-' ? summary.title : `Evento ${eventId}`;
  const shortened = baseTitle.length > 80 ? `${baseTitle.slice(0, 77)}...` : baseTitle;
  return `Event Summary - ${shortened}.pdf`;
};

export async function uploadEventSummaryPdf(
  eventId: number,
  fileName: string,
  blob: Blob,
): Promise<{ url: string; fileName: string }> {
  const fetchResponse = await fetch('/api/upload/other-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: fileName,
      size: blob.size,
      type: 'application/pdf',
      eventId,
    }),
  });

  const response = await fetchResponse.json();

  if (!response.success) {
    throw new Error(response.message || 'Caricamento pdf non riuscito.');
  }

  const { signedUrl, path, fileName: storedFileName } = response.data;
  const uploadResponse = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/pdf' },
    body: blob,
  });

  if (!uploadResponse.ok) {
    throw new Error('Caricamento pdf non riuscito, riprova piu tardi.');
  }

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME}/${path}`;
  return { url, fileName: storedFileName };
}

export async function generateAndUploadEventSummaryPdf(
  event: Event,
  overrides: EventSummaryOverrides = {},
): Promise<{ url: string; fileName: string }> {
  const { blob, summary } = await generateEventSummaryPdfBlob(event, overrides);
  const fileName = createSummaryFileName(summary, event.id);
  return uploadEventSummaryPdf(event.id, fileName, blob);
}
