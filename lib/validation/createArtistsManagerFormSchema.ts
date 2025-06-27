import * as z from 'zod/v4';
import { GENDERS } from '../constants';
import { Country, Language } from '../types';

const genderEnum = z.enum(GENDERS, "Seleziona un'opzione valida");

const today = new Date();
const subtractYears = (date: Date, years: number): Date => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() - years);
  return newDate;
};

const minBirthDate = subtractYears(today, 6);
const maxBirthDate = subtractYears(today, 100);

const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/i;

export const createArtistsManagerFormS1Schema = z.object({
  avatarUrl: z.url('Campo non valido.').trim(),

  name: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .max(50, 'Massimo 50 caratteri.')
    .regex(
      /^[\p{L}\s'-]+$/u,
      'Può contenere solo lettere, spazi, trattini o apostrofi.'
    )
    .trim(),

  surname: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .max(50, 'Massimo 50 caratteri.')
    .regex(
      /^[\p{L}\s'-]+$/u,
      'Può contenere solo lettere, spazi, trattini o apostrofi.'
    )
    .trim(),

  phone: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .regex(
      /^\+\d{1,3}\s?\d{6,14}$/,
      'Formato non valido. Esempio: +39 123456789'
    )
    .trim(),

  email: z.email('Formato non valido.').trim(),

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
    .min(1, 'Campo obbligatorio.')
    .max(100, 'Massimo 100 caratteri.')
    .trim(),

  languages: z
    .array(z.number('Campo malformato.'))
    .min(1, 'Campo obbligatorio.'),

  address: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .max(150, 'Massimo 150 caratteri.')
    .trim(),

  countryId: z
    .number("Seleziona un'opzione valida")
    .min(1, 'Campo obbligatorio.'),

  subdivisionId: z
    .number("Seleziona un'opzione valida")
    .min(1, 'Campo obbligatorio.'),

  city: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .max(100, 'Massimo 100 caratteri.')
    .regex(/^[\p{L}\s'-]+$/u, 'Formato non valido.')
    .trim(),

  zipCode: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .max(15, 'Massimo 15 caratteri.')
    .regex(/^[\p{N}\p{L}\s-]+$/u, 'Formato non valido.')
    .trim(),

  gender: genderEnum,
});

export const createArtistsManagerFormS2Schema = z.object({
  company: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .max(100, 'Massimo 100 caratteri.')
    .trim(),

  taxCode: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .max(16, 'Massimo 16 caratteri.')
    .regex(/^[A-Z0-9]+$/i, 'Formato non valido.')
    .trim(),

  ipiCode: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .max(20, 'Massimo 20 caratteri.')
    .trim(),

  bicCode: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .max(20, 'Massimo 20 caratteri.')
    .trim(),

  abaRoutingNumber: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .max(9, 'Massimo 9 caratteri.')
    .trim(),

  iban: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .regex(ibanRegex, 'Formato non valido.')
    .trim(),

  sdiRecipientCode: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .max(7, 'Massimo 7 caratteri.')
    .trim(),

  billingAddress: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .max(150, 'Massimo 150 caratteri.')
    .trim(),

  billingCountryId: z
    .number("Seleziona un'opzione valida")
    .min(1, 'Campo obbligatorio.'),

  billingSubdivisionId: z
    .number("Seleziona un'opzione valida")
    .min(1, 'Campo obbligatorio.'),

  billingCity: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .max(100, 'Massimo 100 caratteri.')
    .regex(/^[\p{L}\s'-]+$/u, 'Formato non valido.')
    .trim(),

  billingZipCode: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .max(15, 'Massimo 15 caratteri.')
    .regex(/^[\p{N}\p{L}\s-]+$/u, 'Formato non valido.')
    .trim(),

  billingEmail: z.email('Formato non valido.').trim(),

  billingPhone: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .regex(
      /^\+\d{1,3}\s?\d{6,14}$/,
      'Formato non valido. Esempio: +39 123456789'
    )
    .trim(),

  billingPec: z.email('Formato non valido.').trim(),

  taxableInvoice: z.enum(['true', 'false'], "Seleziona un'opzione valida"),
});

export const createArtistsManagerFormS3Schema = z.object({
  signUpEmail: z.email('Formato non valido.').trim(),
  signUpPassword: z
    .string()
    .min(1, 'Campo obbligatorio.')
    .min(8, 'Almeno 8 caratteri.')
    .max(16, 'Massimo 16 caratteri.'),
});

export const createArtistsManagerFullFormSchema =
  createArtistsManagerFormS1Schema
    .merge(createArtistsManagerFormS2Schema)
    .merge(createArtistsManagerFormS3Schema);

export function extendCreateArtistsManagerFormSchema(
  languages: Language[],
  countries: Country[]
) {
  const validLanguageIds = new Set(languages.map((l) => l.id));
  const validCountriesIds = new Set(countries.map((c) => c.id));

  return createArtistsManagerFullFormSchema.extend({
    languages: z
      .array(z.number("Seleziona un'opzione valida"), 'Formato non valido.')
      .min(1, 'Campo obbligatorio.')
      .refine(
        (selected) => selected.every((id) => validLanguageIds.has(id)),
        'Seleziona una lingua valida.'
      ),

    countryId: z
      .number("Seleziona un'opzione valida")
      .refine(
        (selectedId) => validCountriesIds.has(selectedId),
        'Seleziona uno stato valido.'
      ),

    billingCountryId: z
      .number("Seleziona un'opzione valida")
      .refine(
        (selectedId) => validCountriesIds.has(selectedId),
        'Seleziona uno stato valido.'
      ),
  });
}

export type ArtistsManagerFormData = z.infer<
  typeof createArtistsManagerFullFormSchema
>;
