import * as z from 'zod/v4';
import { GENDERS } from '../constants';
import { birthDateValidation, emailValidation, idValidation, nameValidation, passwordValidation, phoneValidation } from './_general';

const genderEnum = z.enum(GENDERS, "Seleziona un'opzione valida.");

export const venueManagerS1FormSchema = z.object({
  avatarUrl: z
    .url('Campo obbligatorio.')
    .refine((url) => url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}`), 'Campo non valido.')
    .trim(),

  name: nameValidation,

  surname: nameValidation,

  phone: phoneValidation,

  email: emailValidation,

  birthDate: birthDateValidation,

  birthPlace: z.string('Campo malformato.').min(2, 'Minimo 2 caratteri.').max(100, 'Massimo 100 caratteri.').trim(),

  languages: z.array(idValidation, 'Campo malformato').min(1, 'Campo obbligatorio.'),

  address: z.string('Campo malformato.').min(5, 'Minimo 5 caratteri.').max(150, 'Massimo 150 caratteri.').trim(),

  countryId: idValidation,

  subdivisionId: idValidation,

  city: z
    .string('Campo malformato.')
    .min(2, 'Minimo 2 caratteri.')
    .max(100, 'Massimo 100 caratteri.')
    .regex(/^[\p{L}\s'-]+$/u, 'Può contenere solo lettere, spazi, trattini o apostrofi.')
    .trim(),

  zipCode: z
    .string('Campo malformato.')
    .min(3, 'Minimo 3 caratteri.')
    .max(20, 'Massimo 20 caratteri.')
    .regex(/^[A-Z0-9\- ]+$/, 'Può contenere solo lettere maiuscole, numeri, trattini o spazi.')
    .trim(),

  gender: genderEnum,
});

export type VenueManagerS1FormSchema = z.infer<typeof venueManagerS1FormSchema>;

export const venueManagerS2FormSchema = z.object({
  signUpEmail: emailValidation,
  signUpPassword: passwordValidation,
});

export type VenueManagerS2FormSchema = z.infer<typeof venueManagerS2FormSchema>;

export const venueManagerFormSchema = z.object({
  ...venueManagerS1FormSchema.shape,
  ...venueManagerS2FormSchema.shape,
});

export type VenueManagerFormSchema = z.infer<typeof venueManagerFormSchema>;
