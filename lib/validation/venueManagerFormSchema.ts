import * as z from 'zod/v4';
import { GENDERS } from '../constants';

const genderEnum = z.enum(GENDERS, "Seleziona un'opzione valida.");

const today = new Date();
const subtractYears = (date: Date, years: number): Date => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() - years);
  return newDate;
};

const minBirthDate = subtractYears(today, 6);
const maxBirthDate = subtractYears(today, 100);

export const venueManagerS1FormSchema = z.object({
  avatarUrl: z
    .url('Campo obbligatorio.')
    .refine(
      (url) => url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}`),
      'Campo non valido.'
    )
    .trim(),

  name: z
    .string('Campo malformato.')
    .min(2, 'Minimo 2 caratteri.')
    .max(50, 'Massimo 50 caratteri.')
    .regex(
      /^[\p{L}\s'-]+$/u,
      'Può contenere solo lettere, spazi, trattini o apostrofi.'
    )
    .trim(),

  surname: z
    .string('Campo malformato.')
    .min(2, 'Minimo 2 caratteri.')
    .max(50, 'Massimo 50 caratteri.')
    .regex(
      /^[\p{L}\s'-]+$/u,
      'Può contenere solo lettere, spazi, trattini o apostrofi.'
    )
    .trim(),

  phone: z
    .string('Campo malformato.')
    .min(8, 'Minimo 8 caratteri.')
    .max(20, 'Massimo 20 caratteri.')
    .regex(/^\+\d{1,3}\s?\d+$/, 'Formato non valido. Esempio: +39 123456789')
    .trim(),

  email: z.email('Formato non valido. Esempio info@eaglebooking.it').trim(),

  birthDate: z
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
    }, `Fuori dal range accettato. (maggiore)`),

  birthPlace: z
    .string('Campo malformato.')
    .min(2, 'Minimo 2 caratteri.')
    .max(100, 'Massimo 100 caratteri.')
    .trim(),

  languages: z
    .array(
      z
        .number("Seleziona un'opzione valida.")
        .positive("Seleziona un'opzione valida."),
      'Campo malformato'
    )
    .min(1, 'Campo obbligatorio.'),

  address: z
    .string('Campo malformato.')
    .min(5, 'Minimo 5 caratteri.')
    .max(150, 'Massimo 150 caratteri.')
    .trim(),

  countryId: z
    .number("Seleziona un'opzione valida.")
    .min(1, 'Campo obbligatorio.')
    .positive("Seleziona un'opzione valida."),

  subdivisionId: z
    .number("Seleziona un'opzione valida.")
    .min(1, 'Campo obbligatorio.')
    .positive("Seleziona un'opzione valida."),

  city: z
    .string('Campo malformato.')
    .min(5, 'Minimo 5 caratteri.')
    .max(100, 'Massimo 100 caratteri.')
    .regex(
      /^[\p{L}\s'-]+$/u,
      'Può contenere solo lettere, spazi, trattini o apostrofi.'
    )
    .trim(),

  zipCode: z
    .string('Campo malformato.')
    .min(3, 'Minimo 3 caratteri.')
    .max(20, 'Massimo 20 caratteri.')
    .regex(
      /^[A-Z0-9\- ]+$/,
      'Può contenere solo lettere maiuscole, numeri, trattini o spazi.'
    )
    .trim(),

  gender: genderEnum,
});

export type VenueManagerS1FormSchema = z.infer<typeof venueManagerS1FormSchema>;

export const venueManagerS2FormSchema = z.object({
  signUpEmail: z
    .email('Formato non valido. Esempio info@eaglebooking.it')
    .trim(),
  signUpPassword: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .min(8, 'Almeno 8 caratteri.')
    .max(16, 'Massimo 16 caratteri.'),
});

export type VenueManagerS2FormSchema = z.infer<typeof venueManagerS2FormSchema>;

export const venueManagerFormSchema = z.object({
  ...venueManagerS1FormSchema.shape,
  ...venueManagerS2FormSchema.shape,
});

export type VenueManagerFormSchema = z.infer<typeof venueManagerFormSchema>;
