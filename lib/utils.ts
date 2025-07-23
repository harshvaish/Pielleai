import { clsx, type ClassValue } from 'clsx';
import { View } from 'react-big-calendar';
import { twMerge } from 'tailwind-merge';
import {
  format,
  startOfWeek,
  endOfWeek,
  isBefore,
  startOfDay,
  startOfISOWeek,
  endOfISOWeek,
  startOfMonth,
  endOfMonth,
  endOfDay,
} from 'date-fns';
import { it } from 'date-fns/locale';
import imageCompression from 'browser-image-compression';
import { TimeRange } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const areSame = (a: number[], b: number[]) =>
  a.length === b.length && a.every((id) => b.includes(id));

// CALENDAR --------------------------------------------------------
export function buildCalendarLabel(date: Date, view: View): string {
  switch (view) {
    case 'day': {
      // Lunedì 01 gennaio 2025
      return format(date, 'eeee d MMMM yyyy', { locale: it });
    }

    case 'week': {
      const start = startOfWeek(date, { weekStartsOn: 1 }); // lun
      const end = endOfWeek(date, { weekStartsOn: 1 }); // dom

      const sameMonth = start.getMonth() === end.getMonth();
      const sameYear = start.getFullYear() === end.getFullYear();

      if (sameMonth) {
        // 01-07 Gennaio 2025
        return `${format(start, 'd', { locale: it })}-${format(
          end,
          'd MMMM yyyy',
          { locale: it }
        )}`.replace(/\b\w/g, (c) => c.toUpperCase());
      }
      // 31 Gennaio - 06 Febbraio 2026
      if (sameYear) {
        return `${format(start, 'd MMMM', { locale: it })} - ${format(
          end,
          'dd MMMM yyyy',
          { locale: it }
        )}`.replace(/\b\w/g, (c) => c.toUpperCase());
      }

      // 31 Dicembre 2025 - 06 Gennaio 2026
      return `${format(start, 'd MMMM yyyy', { locale: it })} - ${format(
        end,
        'dd MMMM yyyy',
        { locale: it }
      )}`.replace(/\b\w/g, (c) => c.toUpperCase());
    }

    case 'month':
    default:
      // Gennaio 2025
      return format(date, 'MMMM yyyy', { locale: it });
  }
}
// CALENDAR --------------------------------------------------------

// IMAGE UPLOAD --------------------------------------------------------
export async function getFileMagicNumber(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = function (e) {
      if (!e.target?.result) return reject('Failed to read file');
      const arr = new Uint8Array(e.target.result as ArrayBuffer).subarray(0, 4);
      const magic = Array.from(arr)
        .map((x) => x.toString(16).padStart(2, '0'))
        .join('');
      resolve(magic);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
}

export function isValidImageMagicNumber(magic: string): boolean {
  const validMagicNumbers = [
    'ffd8ffe0', // JPEG
    'ffd8ffe1', // JPEG
    'ffd8ffe2', // JPEG
    '89504e47', // PNG
    '52494646', // WEBP
  ];
  return validMagicNumbers.some((sig) => magic.startsWith(sig));
}

export function sanitizeFileName(fileName: string): string {
  const name = fileName.split('.').slice(0, -1).join('.') || 'file';
  const ext = fileName.split('.').pop() || 'png';
  return `${name
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')}.${ext}`;
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  const compressedFile = await imageCompression(file, options);
  return compressedFile;
}
// IMAGE UPLOAD --------------------------------------------------------

// BETTER AUTH --------------------------------------------------------
export function getBetterAuthErrorMessage(code: string): string {
  switch (code) {
    case 'INVALID_EMAIL_OR_PASSWORD':
      return 'Email o password non validi.';
    case 'EMAIL_ALREADY_EXISTS':
      return 'Questa email è già registrata.';
    case 'USER_ALREADY_EXISTS':
      return 'Utente già esistente.';
    case 'NOT_ADMIN_USER':
      return 'Solo gli amministratori possono accedere a questa piattaforma.';
    case 'INVALID_ROLE':
      return 'Ruolo specificato non valido.';
    case 'MISSING_FIELDS':
      return 'Alcuni campi obbligatori sono mancanti.';
    case 'INVALID_INPUT':
      return 'I dati inseriti non sono validi.';
    case 'INVALID_EMAIL':
      return 'L’indirizzo email non è valido.';
    case 'INVALID_PASSWORD':
      return 'La password non soddisfa i requisiti di sicurezza.';
    case 'PASSWORD_TOO_WEAK':
      return 'La password è troppo debole.';
    case 'PASSWORD_MISMATCH':
      return 'Le password non corrispondono.';
    case 'USER_NOT_FOUND':
      return 'Utente non trovato.';
    case 'EMAIL_NOT_VERIFIED':
      return 'Email non verificata. Controlla la tua casella di posta.';
    case 'UNAUTHORIZED':
      return 'Non sei autorizzato a eseguire questa azione.';
    case 'FORBIDDEN':
      return 'Accesso negato.';
    case 'ACCOUNT_DISABLED':
      return 'Questo account è stato disabilitato.';
    case 'RATE_LIMIT_EXCEEDED':
      return 'Hai superato il numero massimo di tentativi. Riprova più tardi.';
    case 'TOO_MANY_ATTEMPTS':
      return 'Troppi tentativi. Riprova più tardi.';
    case 'TOKEN_EXPIRED':
      return 'Il token è scaduto. Effettua nuovamente l’accesso.';
    case 'TOKEN_INVALID':
      return 'Token non valido. Riprova.';
    case 'TOKEN_NOT_FOUND':
      return 'Token non trovato o già utilizzato.';
    case 'SESSION_EXPIRED':
      return 'Sessione scaduta. Effettua di nuovo l’accesso.';
    case 'INTERNAL_SERVER_ERROR':
      return 'Errore del server. Riprova più tardi.';
    case 'UNKNOWN_ERROR':
      return 'Si è verificato un errore sconosciuto.';
    default:
      return 'Errore imprevisto. Riprova più tardi.';
  }
}
// BETTER AUTH --------------------------------------------------------

// AVAILABILITIES --------------------------------------------------------
export function calculateRange(
  date: Date,
  view: View
): { start: Date; end: Date } {
  switch (view) {
    case 'day':
      return { start: startOfDay(date), end: endOfDay(date) };
    case 'week':
      return {
        start: startOfISOWeek(date),
        end: endOfISOWeek(date),
      };
    case 'month':
      return { start: startOfMonth(date), end: endOfMonth(date) };
    default:
      return { start: startOfDay(date), end: endOfDay(date) };
  }
}

export function isOverlapping(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
) {
  return aStart < bEnd && bStart < aEnd;
}

export function checkTimeRanges(
  date: string,
  timeRanges: TimeRange[]
):
  | {
      success: true;
      message: null;
    }
  | {
      success: false;
      message: string;
    } {
  if (!date || isBefore(startOfDay(new Date(date)), startOfDay(new Date()))) {
    return {
      success: false,
      message: 'Data selezionata non valida o scaduta.',
    };
  }

  for (let i = 0; i < timeRanges.length; i++) {
    const { startTime: startA, endTime: endA } = timeRanges[i];
    if (!startA || !endA || startA >= endA) {
      return {
        success: false,
        message: 'Correggi le disponibilità presenti per poter procedere.',
      };
    }

    for (let j = i + 1; j < timeRanges.length; j++) {
      const { startTime: startB, endTime: endB } = timeRanges[j];
      if (isOverlapping(startA, endA, startB, endB)) {
        return {
          success: false,
          message:
            'Alcune disponibilità sono in conflitto di orario, rimuovi il conflitto per procedere.',
        };
      }
    }
  }
  return {
    success: true,
    message: null,
  };
}
// AVAILABILITIES --------------------------------------------------------
