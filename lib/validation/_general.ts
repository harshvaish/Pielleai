import { z } from 'zod/v4';
import { eventStatus, profileGenders, userStatus, venueTypes } from '../database/schema';

export const timeValidation = z
  .string('Campo malformato.')
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Può contenere solo numeri o ":".');

export const nameValidation = z
  .string('Campo malformato.')
  .min(2, 'Minimo 2 caratteri.')
  .max(50, 'Massimo 50 caratteri.')
  .regex(/^[\p{L}\s'-]+$/u, 'Può contenere solo lettere, spazi, trattini o apostrofi.')
  .trim();

export const bioValidation = z
  .string('Campo malformato.')
  .min(10, 'Minimo 10 caratteri.')
  .max(1000, 'Massimo 1000 caratteri.')
  .trim();

export const emailValidation = z.email('Formato non valido. (Es. info@eaglebooking.it)').trim();

export const passwordValidation = z
  .string('Campo malformato.')
  .min(1, 'Password obbligatoria.')
  .min(8, 'Almeno 8 caratteri.')
  .max(16, 'Massimo 16 caratteri.');

export const phoneValidation = z
  .string('Campo malformato.')
  .min(8, 'Minimo 8 caratteri.')
  .max(20, 'Massimo 20 caratteri.')
  .regex(/^\+\d{1,3}\s?\d+$/, 'Formato non valido. Esempio: +39 123456789')
  .trim();

export const companyValidation = z
  .string('Campo malformato.')
  .min(2, 'Minimo 2 caratteri.')
  .max(100, 'Massimo 100 caratteri.')
  .trim();

export const taxCodeValidation = z
  .string('Campo malformato.')
  .min(1, 'Minimo 5 caratteri.')
  .max(100, 'Massimo 100 caratteri.')
  .regex(/^[A-Z0-9\-]+$/, 'Può contenere solo lettere maiuscole, numeri e trattini.')
  .trim();

export const addressValidation = z
  .string('Campo malformato.')
  .min(5, 'Minimo 5 caratteri.')
  .max(150, 'Massimo 150 caratteri.')
  .trim();

export const userIdValidation = z
  .string('Campo malformato')
  .regex(/^[a-zA-Z0-9]+$/, 'Può contenere solo lettere e numeri.');

export const idValidation = z
  .number("Seleziona un'opzione valida.")
  .min(1, 'Campo obbligatorio.')
  .positive("Seleziona un'opzione valida.");

export const stringIdValidation = z
  .string('Campo malformato.')
  .regex(/^[1-9]\d*$/, 'Può contenere solo numeri positivi.');

export const dateValidation = z
  .date('Campo malformato')
  .refine((date) => !isNaN(date.getTime()), 'Può contenere solo date.');

export const stringDateValidation = z
  .string('Campo malformato.')
  .transform((val) => new Date(val))
  .refine((date) => !isNaN(date.getTime()), 'Può contenere solo date.');

const today = new Date();
const subtractYears = (date: Date, years: number): Date => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() - years);
  return newDate;
};

const minBirthDate = subtractYears(today, 6);
const maxBirthDate = subtractYears(today, 100);

export const birthDateValidation = z
  .string('Campo malformato.')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Campo obbligatorio')
  .refine((dateStr) => {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  }, 'Formato non corretto.')
  .refine((dateStr) => {
    const date = new Date(dateStr);
    return date <= minBirthDate;
  }, `Fuori dal range accettato. (minore)`)
  .refine((dateStr) => {
    const date = new Date(dateStr);
    return date >= maxBirthDate;
  }, `Fuori dal range accettato. (maggiore)`);

export const otpValidation = z
  .string('Campo malformato.')
  .min(6, 'Deve contenere 6 cifre.')
  .max(6, 'Deve contenere 6 cifre.')
  .regex(/^[0-9]+$/, 'Può contenere solo numeri.');

//socials
export const tiktokUrlValidation = z.preprocess(
  (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
  z
    .url('Inserisci un link valido.')
    .refine(
      (url) => url.startsWith(`https://www.tiktok.com/`),
      'Deve iniziare con "https://www.tiktok.com/".',
    )
    .trim()
    .optional(),
);

export const facebookUrlValidation = z.preprocess(
  (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
  z
    .url('Inserisci un link valido.')
    .refine(
      (url) => url.startsWith(`https://www.facebook.com/`),
      'Deve iniziare con "https://www.facebook.com/".',
    )
    .trim()
    .optional(),
);

export const instagramUrlValidation = z.preprocess(
  (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
  z
    .url('Inserisci un link valido.')
    .refine(
      (url) => url.startsWith(`https://www.instagram.com/`),
      'Deve iniziare con "https://www.instagram.com/".',
    )
    .trim()
    .optional(),
);

export const xUrlValidation = z.preprocess(
  (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
  z
    .url('Inserisci un link valido.')
    .refine(
      (url) => url.startsWith('https://twitter.com/') || url.startsWith('https://x.com/'),
      'Deve iniziare con "https://twitter.com/" o "https://x.com/"',
    )
    .trim()
    .optional(),
);

// utils
export function getZodErrors(errorObj: z.core.$ZodError<unknown>): string[] {
  const validationErrors = z.treeifyError(errorObj).errors;

  return validationErrors;
}

// enums
export const userStatusEnumValidation = z.enum(
  userStatus.enumValues,
  "Seleziona un'opzione valida.",
);

export const eventStatusEnumValidation = z.enum(
  eventStatus.enumValues,
  "Seleziona un'opzione valida.",
);

export const profileGendersEnumValidation = z.enum(
  profileGenders.enumValues,
  "Seleziona un'opzione valida.",
);

export const venueTypesEnumValidation = z.enum(
  venueTypes.enumValues,
  "Seleziona un'opzione valida.",
);
