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
} from './_general';

export const venueManagerS1FormSchema = z.object({
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

  address: z
    .string('Campo malformato.')
    .min(5, 'Minimo 5 caratteri.')
    .max(150, 'Massimo 150 caratteri.')
    .trim(),

  countryId: idValidation,

  subdivisionId: idValidation,

  city: cityValidation,

  zipCode: zipCodeValidation,

  gender: profileGendersEnumValidation,
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
