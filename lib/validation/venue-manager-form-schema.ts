import * as z from 'zod/v4';
import {
  avatarUrlValidation,
  birthDateValidation,
  cityValidation,
  emailValidation,
  idValidation,
  nameValidation,
  passwordValidation,
  phoneValidation,
  profileGendersEnumValidation,
  zipCodeValidation,
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

export const venueManagerS1FormSchema = z.object({
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

  address: optionalString(
    z.string('Campo malformato.').min(5, 'Minimo 5 caratteri.').max(150, 'Massimo 150 caratteri.').trim(),
  ),
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

export type VenueManagerS1FormSchema = z.infer<typeof venueManagerS1FormSchema>;

export const venueManagerS2FormSchema = z.object({
  signUpEmail: optionalString(emailValidation),
  signUpPassword: optionalString(passwordValidation),
});

export type VenueManagerS2FormSchema = z.infer<typeof venueManagerS2FormSchema>;

export const venueManagerFormSchema = z.object({
  ...venueManagerS1FormSchema.shape,
  ...venueManagerS2FormSchema.shape,
});

export type VenueManagerFormSchema = z.infer<typeof venueManagerFormSchema>;
