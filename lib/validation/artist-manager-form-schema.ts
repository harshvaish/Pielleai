import * as z from 'zod/v4';
import {
  addressValidation,
  birthDateValidation,
  companyValidation,
  emailValidation,
  idValidation,
  nameValidation,
  phoneValidation,
  taxCodeValidation,
  profileGendersEnumValidation,
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

export const artistManagerS1FormSchema = z.object({
  avatarUrl: avatarUrlValidation.optional(),

  name: nameValidation,

  surname: nameValidation,

  phone: phoneValidation,

  birthDate: birthDateValidation,

  birthPlace: z
    .string('Campo malformato.')
    .min(2, 'Minimo 2 caratteri.')
    .max(100, 'Massimo 100 caratteri.')
    .trim(),

  languages: z.array(idValidation, 'Campo malformato').min(1, 'Campo obbligatorio.'),

  address: addressValidation,

  countryId: idValidation,

  subdivisionId: idValidation,

  city: cityValidation,

  zipCode: zipCodeValidation,

  gender: profileGendersEnumValidation,
});

export type ArtistManagerS1FormSchema = z.infer<typeof artistManagerS1FormSchema>;

export const artistManagerS2FormSchema = z
  .object({
    company: companyValidation,

    taxCode: taxCodeValidation,

    ipiCode: ipiCodeValidation,

    bicCode: bicCodeValidation.optional(),

    abaRoutingNumber: abaRoutingNumberValidation.optional(),

    iban: ibanValidation,

    sdiRecipientCode: sdiRecipientCodeValidation.optional(),

    billingAddress: addressValidation,

    billingCountry: countryValidation,

    billingSubdivisionId: idValidation,

    billingCity: z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(100, 'Massimo 100 caratteri.')
      .regex(/^[\p{L}\s'-]+$/u, 'Può contenere solo lettere, spazi, trattini o apostrofi.')
      .trim(),

    billingZipCode: z
      .string('Campo malformato.')
      .min(3, 'Minimo 3 caratteri.')
      .max(20, 'Massimo 20 caratteri.')
      .regex(/^[A-Z0-9\- ]+$/, 'Può contenere solo lettere maiuscole, numeri, trattini o spazi.')
      .trim(),

    billingEmail: emailValidation,

    billingPhone: phoneValidation,

    billingPec: emailValidation,

    taxableInvoice: z
      .string('Campo malformato.')
      .refine((val) => val === 'true' || val === 'false', {
        message: "Seleziona un'opzione valida",
      }),
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

export type ArtistManagerS2FormSchema = z.infer<typeof artistManagerS2FormSchema>;

export const artistManagerProfileFormSchema = z.object({
  ...artistManagerS1FormSchema.shape,
  ...artistManagerS2FormSchema.shape,
});

export type ArtistManagerProfileFormSchema = z.infer<typeof artistManagerProfileFormSchema>;

export const artistManagerS3FormSchema = z.object({
  signUpEmail: emailValidation,
  signUpPassword: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .min(8, 'Almeno 8 caratteri.')
    .max(16, 'Massimo 16 caratteri.'),
});

export type ArtistManagerS3FormSchema = z.infer<typeof artistManagerS3FormSchema>;

export const artistManagerFormSchema = z.object({
  ...artistManagerS1FormSchema.shape,
  ...artistManagerS2FormSchema.shape,
  ...artistManagerS3FormSchema.shape,
});

export type ArtistManagerFormSchema = z.infer<typeof artistManagerFormSchema>;
