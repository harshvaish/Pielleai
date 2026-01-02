import * as z from 'zod/v4';
import {
  addressValidation,
  birthDateValidation,
  companyValidation,
  emailValidation,
  profileGendersEnumValidation,
  idValidation,
  nameValidation,
  phoneValidation,
  taxCodeValidation,
  bioValidation,
  tiktokUrlValidation,
  facebookUrlValidation,
  instagramUrlValidation,
  xUrlValidation,
  avatarUrlValidation,
  cityValidation,
  zipCodeValidation,
  ipiCodeValidation,
  ibanValidation,
  countryValidation,
  bicCodeValidation,
  abaRoutingNumberValidation,
  sdiRecipientCodeValidation,
} from './_general';

const optionalString = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([schema, z.literal('')]).optional();

const optionalArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (val) => (Array.isArray(val) && val.length === 0 ? undefined : val),
    schema.optional(),
  );

export const artistS1FormSchema = z.object({
  avatarUrl: optionalString(avatarUrlValidation),

  name: optionalString(nameValidation),

  surname: optionalString(nameValidation),

  stageName: optionalString(
    z.string('Campo malformato.').min(2, 'Minimo 2 caratteri.').max(100, 'Massimo 100 caratteri.').trim(),
  ),

  bio: optionalString(bioValidation),

  phone: optionalString(phoneValidation),

  email: optionalString(emailValidation),

  birthDate: optionalString(birthDateValidation),

  birthPlace: optionalString(
    z.string('Campo malformato.').min(2, 'Minimo 2 caratteri.').max(100, 'Massimo 100 caratteri.').trim(),
  ),

  languages: optionalArray(
    z.array(idValidation, 'Campo malformato').min(1, 'Campo obbligatorio.'),
  ),

  address: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    addressValidation.optional(),
  ),

  countryId: z.preprocess(
    (val) => (typeof val === 'number' && !isNaN(val) ? val : undefined),
    idValidation.optional(),
  ),

  subdivisionId: z.preprocess(
    (val) => (typeof val === 'number' && !isNaN(val) ? val : undefined),
    idValidation.optional(),
  ),

  city: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    cityValidation.optional(),
  ),

  zipCode: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    zipCodeValidation.optional(),
  ),

  gender: optionalString(profileGendersEnumValidation),

  zones: optionalArray(z.array(idValidation, 'Campo malformato').min(1, 'Campo obbligatorio.')),

  artistManagers: optionalArray(z.array(idValidation, 'Campo malformato')),

  tourManagerName: optionalString(nameValidation),

  tourManagerSurname: optionalString(nameValidation),

  tourManagerPhone: optionalString(phoneValidation),

  tourManagerEmail: optionalString(emailValidation),
});

export type ArtistS1FormSchema = z.infer<typeof artistS1FormSchema>;

export const artistS2FormSchema = z
  .object({
    company: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
      companyValidation.optional(),
    ),

    taxCode: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
      taxCodeValidation.optional(),
    ),

    ipiCode: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
      ipiCodeValidation.optional(),
    ),

    bicCode: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
      bicCodeValidation.optional(),
    ),

    abaRoutingNumber: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
      abaRoutingNumberValidation.optional(),
    ),

    iban: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
      ibanValidation.optional(),
    ),

    sdiRecipientCode: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
      sdiRecipientCodeValidation.optional(),
    ),

    billingAddress: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
      addressValidation.optional(),
    ),

    billingCountry: z.preprocess(
      (val) => (typeof val === 'number' && !isNaN(val) ? val : undefined),
      countryValidation.optional(),
    ),

    billingSubdivisionId: z.preprocess(
      (val) => (typeof val === 'number' && !isNaN(val) ? val : undefined),
      idValidation.optional(),
    ),

    billingCity: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
      cityValidation.optional(),
    ),

    billingZipCode: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
      zipCodeValidation.optional(),
    ),

    billingEmail: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
      emailValidation.optional(),
    ),

    billingPhone: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
      phoneValidation.optional(),
    ),

    billingPec: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
      emailValidation.optional(),
    ),

    taxableInvoice: z
      .string('Campo malformato.')
      .refine((val) => val === 'true' || val === 'false', {
        message: "Seleziona un'opzione valida",
      })
      .optional()
      .or(z.literal('')),
  })
  .check((ctx) => {
    const { billingCountry, bicCode, abaRoutingNumber, sdiRecipientCode } = ctx.value;

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
    if (billingCountry.code === 'US' && (!abaRoutingNumber || abaRoutingNumber.trim() === '')) {
      ctx.issues.push({
        code: 'custom',
        input: ['abaRoutingNumber'],
        message: 'Campo obbligatorio per gli Stati Uniti.',
      });
    }

    // Require SDI for Italy
    if (billingCountry.code === 'IT' && (!sdiRecipientCode || sdiRecipientCode.trim() === '')) {
      ctx.issues.push({
        code: 'custom',
        input: ['sdiRecipientCode'],
        message: "Campo obbligatorio per l'Italia.",
      });
    }
  });

export type ArtistS2FormSchema = z.infer<typeof artistS2FormSchema>;

export const artistS3FormSchema = z.object({
  tiktokUrl: tiktokUrlValidation,

  tiktokUsername: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(24, 'Massimo 24 caratteri.')
      .regex(
        /^[A-Za-z0-9_.]{1,23}[A-Za-z0-9_]$/,
        'Può contenere solo lettere, numeri, underscore o punti (non terminare con punto).',
      )
      .trim()
      .optional(),
  ),

  tiktokFollowers: z.preprocess(
    (val) => (typeof val === 'number' && !isNaN(val) ? val : undefined),
    z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),
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
      .optional(),
  ),

  facebookUrl: facebookUrlValidation,

  facebookUsername: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(50, 'Massimo 50 caratteri.')
      .regex(/^[A-Za-z0-9.]{1,50}$/, 'Può contenere solo lettere, numeri o punti.')
      .trim()
      .optional(),
  ),

  facebookFollowers: z.preprocess(
    (val) => (typeof val === 'number' && !isNaN(val) ? val : undefined),
    z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),
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
      .optional(),
  ),

  instagramUrl: instagramUrlValidation,

  instagramUsername: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(30, 'Massimo 30 caratteri.')
      .regex(/^[A-Za-z0-9._]{1,30}$/, 'Può contenere solo lettere, numeri, underscore o punti.')
      .trim()
      .optional(),
  ),

  instagramFollowers: z.preprocess(
    (val) => (typeof val === 'number' && !isNaN(val) ? val : undefined),
    z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),
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
      .optional(),
  ),

  xUrl: xUrlValidation,

  xUsername: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(15, 'Massimo 15 caratteri.')
      .regex(/^[A-Za-z0-9_]{1,15}$/, 'Può contenere solo lettere, numeri o underscore.')
      .trim()
      .optional(),
  ),

  xFollowers: z.preprocess(
    (val) => (typeof val === 'number' && !isNaN(val) ? val : undefined),
    z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),
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
      .optional(),
  ),
});

export type ArtistS3FormSchema = z.infer<typeof artistS3FormSchema>;

export const artistFormSchema = z.object({
  ...artistS1FormSchema.shape,
  ...artistS2FormSchema.shape,
  ...artistS3FormSchema.shape,
});

export type ArtistFormSchema = z.infer<typeof artistFormSchema>;
