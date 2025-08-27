import { z } from 'zod/v4';

export const timeValidation = z
  .string('Campo malformato.')
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Può contenere solo numeri o ":".');

export const nameValidation = z
  .string('Campo malformato.')
  .min(2, 'Minimo 2 caratteri.')
  .max(50, 'Massimo 50 caratteri.')
  .regex(/^[\p{L}\s'-]+$/u, 'Può contenere solo lettere, spazi, trattini o apostrofi.')
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
