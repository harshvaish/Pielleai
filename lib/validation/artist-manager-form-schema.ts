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
  addressFormattedValidation,
  streetNameValidation,
  streetNumberValidation,
  placeIdValidation,
  latitudeValidation,
  longitudeValidation,
  countryNameValidation,
  countryCodeValidation,
} from './_general';

const optionalString = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([schema, z.literal('')]).optional();

const optionalArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (val) => (Array.isArray(val) && val.length === 0 ? undefined : val),
    schema.optional(),
  );

const optionalId = z.preprocess((val) => {
  if (typeof val === 'number' && Number.isFinite(val) && val > 0) return val;
  if (typeof val === 'string' && val.trim() !== '' && Number.isFinite(Number(val))) {
    const parsed = Number(val);
    return parsed > 0 ? parsed : undefined;
  }
  return undefined;
}, idValidation.optional());

export const artistManagerS1FormSchema = z.object({
  avatarUrl: optionalString(avatarUrlValidation),

  name: optionalString(nameValidation),

  surname: optionalString(nameValidation),

  phone: optionalString(phoneValidation),

  birthDate: optionalString(birthDateValidation),

  birthPlace: optionalString(
    z.string('Campo malformato.').min(2, 'Minimo 2 caratteri.').max(100, 'Massimo 100 caratteri.').trim(),
  ),

  languages: optionalArray(
    z.array(idValidation, 'Campo malformato').min(1, 'Campo obbligatorio.'),
  ),

  address: optionalString(addressValidation),
  addressFormatted: optionalString(addressFormattedValidation),
  streetName: optionalString(streetNameValidation),
  streetNumber: optionalString(streetNumberValidation),
  placeId: optionalString(placeIdValidation),
  latitude: optionalString(latitudeValidation),
  longitude: optionalString(longitudeValidation),
  countryName: optionalString(countryNameValidation),
  countryCode: optionalString(countryCodeValidation),

  countryId: optionalId,

  subdivisionId: optionalId,

  city: optionalString(cityValidation),

  zipCode: optionalString(zipCodeValidation),

  gender: optionalString(profileGendersEnumValidation),
});

export type ArtistManagerS1FormSchema = z.infer<typeof artistManagerS1FormSchema>;

export const artistManagerS2FormSchema = z
  .object({
    company: optionalString(companyValidation),

    taxCode: optionalString(taxCodeValidation),

    ipiCode: optionalString(ipiCodeValidation),

    bicCode: optionalString(bicCodeValidation),

    abaRoutingNumber: optionalString(abaRoutingNumberValidation),

    iban: optionalString(ibanValidation),

    sdiRecipientCode: optionalString(sdiRecipientCodeValidation),

  billingAddress: optionalString(addressValidation),
  billingAddressFormatted: optionalString(addressFormattedValidation),
  billingStreetName: optionalString(streetNameValidation),
  billingStreetNumber: optionalString(streetNumberValidation),
  billingPlaceId: optionalString(placeIdValidation),
  billingLatitude: optionalString(latitudeValidation),
  billingLongitude: optionalString(longitudeValidation),
  billingCountryName: optionalString(countryNameValidation),
  billingCountryCode: optionalString(countryCodeValidation),

  billingCountry: countryValidation.optional(),

    billingSubdivisionId: optionalId,

    billingCity: optionalString(
      z
        .string('Campo malformato.')
        .min(2, 'Minimo 2 caratteri.')
        .max(100, 'Massimo 100 caratteri.')
        .regex(/^[\p{L}\s'-]+$/u, 'Può contenere solo lettere, spazi, trattini o apostrofi.')
        .trim(),
    ),

    billingZipCode: optionalString(
      z
        .string('Campo malformato.')
        .min(3, 'Minimo 3 caratteri.')
        .max(20, 'Massimo 20 caratteri.')
        .regex(/^[A-Z0-9\- ]+$/, 'Può contenere solo lettere maiuscole, numeri, trattini o spazi.')
        .trim(),
    ),

    billingEmail: optionalString(emailValidation),

    billingPhone: optionalString(phoneValidation),

    billingPec: optionalString(emailValidation),

    taxableInvoice: optionalString(
      z.string('Campo malformato.').refine((val) => val === 'true' || val === 'false', {
        message: "Seleziona un'opzione valida",
      }),
    ),
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
  signUpEmail: optionalString(emailValidation),
  signUpPassword: optionalString(
    z
      .string('Campo malformato.')
      .min(1, 'Campo obbligatorio.')
      .min(8, 'Almeno 8 caratteri.')
      .max(16, 'Massimo 16 caratteri.'),
  ),
});

export type ArtistManagerS3FormSchema = z.infer<typeof artistManagerS3FormSchema>;

export const artistManagerFormSchema = z.object({
  ...artistManagerS1FormSchema.shape,
  ...artistManagerS2FormSchema.shape,
  ...artistManagerS3FormSchema.shape,
});

export type ArtistManagerFormSchema = z.infer<typeof artistManagerFormSchema>;
