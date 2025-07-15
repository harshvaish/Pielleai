import * as z from 'zod/v4';
import { VENUE_TYPES } from '../constants';

export const venueS1FormSchema = z.object({
  avatarUrl: z
    .url('Inserisci un link valido.')
    .refine(
      (url) => url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}`),
      'Campo non valido.'
    )
    .trim(),

  name: z
    .string('Campo malformato.')
    .min(2, 'Minimo 2 caratteri.')
    .max(100, 'Massimo 100 caratteri.')
    .trim(),

  type: z.enum(VENUE_TYPES, "Seleziona un'opzione valida."),

  capacity: z
    .number('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .positive('Può contenere solo numeri positivi.'),

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

  venueManagerId: z
    .number("Seleziona un'opzione valida.")
    .min(1, 'Campo obbligatorio.')
    .positive("Seleziona un'opzione valida."),

  acceptTerms: z.literal(true, 'Campo obbligatorio.'),
});

export type VenueS1FormSchema = z.infer<typeof venueS1FormSchema>;

export const editVenueS1FormSchema = venueS1FormSchema.omit({
  acceptTerms: true,
});

export type EditVenueS1FormSchema = z.infer<typeof editVenueS1FormSchema>;

export const venueS2FormSchema = z
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
      .min(5, 'Minimo 5 caratteri.')
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

export type VenueS2FormSchema = z.infer<typeof venueS2FormSchema>;

export const venueS3FormSchema = z.object({
  tiktokUrl: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .url('Inserisci un link valido.')
      .refine(
        (url) => url.startsWith(`https://www.tiktok.com/`),
        'Campo non valido.'
      )
      .trim()
      .optional()
  ),

  tiktokUsername: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(24, 'Massimo 24 caratteri.')
      .regex(
        /^[A-Za-z0-9_.]{1,23}[A-Za-z0-9_]$/,
        'Può contenere solo lettere, numeri, underscore o punti (non terminare con punto).'
      )
      .trim()
      .optional()
  ),

  tiktokFollowers: z.preprocess(
    (val) => (typeof val === 'number' && !isNaN(val) ? val : undefined),
    z
      .number('Campo malformato.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  tiktokCreatedAt: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Campo obbligatorio')
      .refine((dateStr) => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
      }, 'Formato non corretto.')
      .optional()
  ),

  facebookUrl: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .url('Inserisci un link valido.')
      .refine(
        (url) => url.startsWith(`https://www.facebook.com/`),
        'Campo non valido.'
      )
      .trim()
      .optional()
  ),

  facebookUsername: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(50, 'Massimo 50 caratteri.')
      .regex(
        /^[A-Za-z0-9.]{1,50}$/,
        'Può contenere solo lettere, numeri o punti.'
      )
      .trim()
      .optional()
  ),

  facebookFollowers: z.preprocess(
    (val) => (typeof val === 'number' && !isNaN(val) ? val : undefined),
    z
      .number('Campo malformato.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  facebookCreatedAt: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Campo obbligatorio')
      .refine((dateStr) => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
      }, 'Formato non corretto.')
      .optional()
  ),

  instagramUrl: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .url('Inserisci un link valido.')
      .refine(
        (url) => url.startsWith(`https://www.instagram.com/`),
        'Campo non valido.'
      )
      .trim()
      .optional()
  ),

  instagramUsername: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(30, 'Massimo 30 caratteri.')
      .regex(
        /^[A-Za-z0-9._]{1,30}$/,
        'Può contenere solo lettere, numeri, underscore o punti.'
      )
      .trim()
      .optional()
  ),

  instagramFollowers: z.preprocess(
    (val) => (typeof val === 'number' && !isNaN(val) ? val : undefined),
    z
      .number('Campo malformato.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  instagramCreatedAt: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Campo obbligatorio')
      .refine((dateStr) => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
      }, 'Formato non corretto.')
      .optional()
  ),

  xUrl: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .url('Inserisci un link valido.')
      .refine(
        (url) =>
          url.startsWith('https://twitter.com/') ||
          url.startsWith('https://x.com/'),
        'Campo non valido.'
      )
      .trim()
      .optional()
  ),

  xUsername: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(15, 'Massimo 15 caratteri.')
      .regex(
        /^[A-Za-z0-9_]{1,15}$/,
        'Può contenere solo lettere, numeri o underscore.'
      )
      .trim()
      .optional()
  ),

  xFollowers: z.preprocess(
    (val) => (typeof val === 'number' && !isNaN(val) ? val : undefined),
    z
      .number('Campo malformato.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  xCreatedAt: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Campo obbligatorio')
      .refine((dateStr) => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
      }, 'Formato non corretto.')
      .optional()
  ),
});

export type VenueS3FormSchema = z.infer<typeof venueS3FormSchema>;

export const venueFormSchema = z.object({
  ...venueS1FormSchema.shape,
  ...venueS2FormSchema.shape,
  ...venueS3FormSchema.shape,
});

export type VenueFormSchema = z.infer<typeof venueFormSchema>;
