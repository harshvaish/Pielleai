import { z } from 'zod';
import { GENDERS } from '../constants';

// Assuming you have enums like this:
const Language = z.enum(['Italiano', 'Spagnolo']);
const Gender = z.enum([...GENDERS]);

export const artistManagerSignupS1Schema = z.object({
  name: z.string(),
  surname: z.string(),
  phone: z.string(),
  email: z.string().email(),
  birthDate: z.date(),
  birthPlace: z.string(),
  languages: z.array(Language),
  address: z.string(),
  state: z.string(),
  province: z.string(),
  city: z.string(),
  zipCode: z.string(),
  gender: Gender,
});
