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
import { Availability, UserRole } from './types';
import { User } from './auth';

// general
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const areSame = (a: number[], b: number[]) =>
  a.length === b.length && a.every((id) => b.includes(id));

export const splitCsv = (v: string | null | undefined) =>
  v
    ? v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

// calendar
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
        return `${format(start, 'd', { locale: it })}-${format(end, 'd MMMM yyyy', { locale: it })}`.replace(
          /\b\w/g,
          (c) => c.toUpperCase(),
        );
      }
      // 31 Gennaio - 06 Febbraio 2026
      if (sameYear) {
        return `${format(start, 'd MMMM', { locale: it })} - ${format(end, 'dd MMMM yyyy', { locale: it })}`.replace(
          /\b\w/g,
          (c) => c.toUpperCase(),
        );
      }

      // 31 Dicembre 2025 - 06 Gennaio 2026
      return `${format(start, 'd MMMM yyyy', { locale: it })} - ${format(end, 'dd MMMM yyyy', { locale: it })}`.replace(
        /\b\w/g,
        (c) => c.toUpperCase(),
      );
    }

    case 'month':
    default:
      // Gennaio 2025
      return format(date, 'MMMM yyyy', { locale: it });
  }
}

// upload
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

export function isValidPdfMagicNumber(magic: string): boolean {
  const validMagicNumbers = [
    '25504446', // %PDF in hex
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

// better auth
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
      return "L'indirizzo email non è valido.";
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
      return "Il token è scaduto. Effettua nuovamente l'accesso.";
    case 'TOKEN_INVALID':
      return 'Token non valido. Riprova.';
    case 'TOKEN_NOT_FOUND':
      return 'Token non trovato o già utilizzato.';
    case 'SESSION_EXPIRED':
      return "Sessione scaduta. Effettua di nuovo l'accesso.";
    case 'INTERNAL_SERVER_ERROR':
      return 'Errore del server. Riprova più tardi.';
    case 'UNKNOWN_ERROR':
      return 'Si è verificato un errore sconosciuto.';
    default:
      return 'Errore imprevisto. Riprova più tardi.';
  }
}

export function getBetterAuthOTPErrorMessage(code: string): string {
  switch (code) {
    case 'INVALID_OTP':
    case 'OTP_INVALID':
    case 'INVALID_OTP_CODE':
      return 'Codice OTP non valido.';
    case 'OTP_EXPIRED':
    case 'EXPIRED_OTP':
    case 'OTP_CODE_EXPIRED':
      return 'Il codice OTP è scaduto. Richiedi un nuovo codice.';
    case 'MAX_ATTEMPTS_EXCEEDED':
    case 'TOO_MANY_OTP_ATTEMPTS':
      return 'Hai superato i tentativi disponibili. Richiedi un nuovo codice.';
    case 'OTP_NOT_FOUND':
    case 'VERIFICATION_NOT_FOUND':
      return 'Codice OTP non trovato o non più valido.';
    case 'OTP_TYPE_MISMATCH':
      return 'Questo codice non è valido per questa operazione.';
    case 'OTP_REQUIRED':
      return 'Inserisci il codice OTP.';
    case 'EMAIL_ALREADY_VERIFIED':
      return 'Email già verificata.';
    default:
      return 'Verifica codice non riuscita.';
  }
}

// availabilities
export function calculateRange(date: Date, view: View): { start: Date; end: Date } {
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

function isOverlappingRange(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function checkAvailabilities(
  availabilities: Availability[],
): { success: true; message: null } | { success: false; message: string } {
  const today = startOfDay(new Date());

  for (let i = 0; i < availabilities.length; i++) {
    const { startDate, endDate } = availabilities[i];

    // Validate presence and order
    if (!startDate || !endDate || startDate >= endDate) {
      return {
        success: false,
        message: 'Correggi gli intervalli di date presenti per poter procedere.',
      };
    }

    // Prevent ranges entirely in the past
    if (isBefore(endDate, today)) {
      return {
        success: false,
        message: 'Alcuni intervalli di date sono scaduti.',
      };
    }

    // Overlap check
    for (let j = i + 1; j < availabilities.length; j++) {
      const { startDate: startB, endDate: endB } = availabilities[j];
      if (isOverlappingRange(startDate, endDate, startB, endB)) {
        return {
          success: false,
          message:
            'Alcuni intervalli di date sono in conflitto, rimuovi il conflitto per procedere.',
        };
      }
    }
  }

  return {
    success: true,
    message: null,
  };
}

// cache
export function hashKey(obj: object) {
  return JSON.stringify(obj, Object.keys(obj).sort());
}

// auth redirect
export function hasRole(user: { role: UserRole }, roles: UserRole[]) {
  return roles.includes(user.role);
}

export function resolveNextPath(opts: { user: User; hasProfile: boolean }): string | null {
  const { user, hasProfile } = opts;

  if (user.role === 'admin') return null;
  if (!user.emailVerified) return '/conferma-email';
  if (!hasProfile) return '/completa-profilo';
  if (user.status === 'waiting-for-approval') return '/attesa-approvazione';

  return null;
}
