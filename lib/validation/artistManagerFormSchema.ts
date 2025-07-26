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

export const artistManagerS1FormSchema = z.object({
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

  email: z.email('Formato non valido. (Es. info@eaglebooking.it)').trim(),

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
    .min(2, 'Minimo 2 caratteri.')
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

export type ArtistManagerS1FormSchema = z.infer<
  typeof artistManagerS1FormSchema
>;

export const artistManagerS2FormSchema = z
  .object({
    company: z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(100, 'Massimo 100 caratteri.')
      .trim(),

    taxCode: z
      .string('Campo malformato.')
      .min(1, 'Minimo 5 caratteri.')
      .max(100, 'Massimo 100 caratteri.')
      .regex(
        /^[A-Z0-9\-]+$/,
        'Può contenere solo lettere maiuscole, numeri e trattini.'
      )
      .trim(),

    ipiCode: z
      .string('Campo malformato.')
      .min(9, 'Minimo 9 cifre.')
      .max(20, 'Massimo 20 cifre.')
      .regex(/^\d+$/, 'Può contenere solo numeri.')
      .trim(),

    bicCode: z
      .string()
      .min(8, 'Minimo 8 caratteri.')
      .max(20, 'Massimo 20 caratteri.')
      .regex(/^[A-Z0-9]+$/, 'Può contenere solo lettere maiuscole e numeri.')
      .trim()
      .optional(),

    abaRoutingNumber: z
      .string()
      .min(5, 'Minimo 5 cifre.')
      .max(12, 'Massimo 12 cifre.')
      .regex(/^\d+$/, 'Può contenere solo numeri.')
      .trim()
      .optional(),

    iban: z
      .string('Campo malformato.')
      .min(15, 'Minimo 15 caratteri.')
      .max(50, 'Massimo 50 caratteri.')
      .regex(
        /^[A-Z]{2}\d{2}[A-Z0-9]+$/,
        'Può contenere solo lettere maiuscole e numeri.'
      )
      .trim(),

    sdiRecipientCode: z
      .string()
      .length(7, 'Deve contenere esattamente 7 caratteri.')
      .regex(/^[A-Z0-9]{7}$/, 'Può contenere solo lettere maiuscole e numeri.')
      .trim()
      .optional(),

    billingAddress: z
      .string('Campo malformato.')
      .min(5, 'Minimo 5 caratteri.')
      .max(150, 'Massimo 150 caratteri.')
      .trim(),

    billingCountry: z.object(
      {
        id: z.number("Seleziona un'opzione valida."),
        name: z.string("Seleziona un'opzione valida."),
        code: z.string().length(2, "Seleziona un'opzione valida."),
        isEu: z.boolean("Seleziona un'opzione valida."),
      },
      "Seleziona un'opzione valida."
    ),

    billingSubdivisionId: z
      .number("Seleziona un'opzione valida.")
      .min(1, 'Campo obbligatorio.')
      .positive("Seleziona un'opzione valida."),

    billingCity: z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(100, 'Massimo 100 caratteri.')
      .regex(
        /^[\p{L}\s'-]+$/u,
        'Può contenere solo lettere, spazi, trattini o apostrofi.'
      )
      .trim(),

    billingZipCode: z
      .string('Campo malformato.')
      .min(3, 'Minimo 3 caratteri.')
      .max(20, 'Massimo 20 caratteri.')
      .regex(
        /^[A-Z0-9\- ]+$/,
        'Può contenere solo lettere maiuscole, numeri, trattini o spazi.'
      )
      .trim(),

    billingEmail: z
      .email('Formato non valido. Esempio fatturazione@eaglebooking.it')
      .trim(),

    billingPhone: z
      .string('Campo malformato.')
      .min(8, 'Minimo 8 caratteri.')
      .max(20, 'Massimo 20 caratteri.')
      .regex(/^\+\d{1,3}\s?\d+$/, 'Formato non valido. Esempio: +39 123456789')
      .trim(),

    billingPec: z
      .email('Formato non valido. Esempio pec@eaglebooking.it')
      .trim(),

    taxableInvoice: z
      .string('Campo malformato.')
      .refine((val) => val === 'true' || val === 'false', {
        message: "Seleziona un'opzione valida",
      }),
  })
  .check((ctx) => {
    const { billingCountry, bicCode, abaRoutingNumber, sdiRecipientCode } =
      ctx.value;

    if (!billingCountry) return;

    // Require BIC for non-EU
    if (!billingCountry.isEu && (!bicCode || bicCode.trim() === '')) {
      ctx.issues.push({
        code: 'custom',
        input: ['bicCode'],
        message: 'Campo obbligatorio per paesi extra-UE.',
      });
    }

    // Require ABA for USA
    if (
      billingCountry.code === 'US' &&
      (!abaRoutingNumber || abaRoutingNumber.trim() === '')
    ) {
      ctx.issues.push({
        code: 'custom',
        input: ['abaRoutingNumber'],
        message: 'Campo obbligatorio per gli Stati Uniti.',
      });
    }

    // Require SDI for Italy
    if (
      billingCountry.code === 'IT' &&
      (!sdiRecipientCode || sdiRecipientCode.trim() === '')
    ) {
      ctx.issues.push({
        code: 'custom',
        input: ['sdiRecipientCode'],
        message: "Campo obbligatorio per l'Italia.",
      });
    }
  });

export type ArtistManagerS2FormSchema = z.infer<
  typeof artistManagerS2FormSchema
>;

export const artistManagerS3FormSchema = z.object({
  signUpEmail: z.email('Formato non valido. (Es. info@eaglebooking.it)').trim(),
  signUpPassword: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .min(8, 'Almeno 8 caratteri.')
    .max(16, 'Massimo 16 caratteri.'),
});

export const artistManagerFormSchema = z.object({
  ...artistManagerS1FormSchema.shape,
  ...artistManagerS2FormSchema.shape,
  ...artistManagerS3FormSchema.shape,
});

export type ArtistManagerFormSchema = z.infer<typeof artistManagerFormSchema>;
