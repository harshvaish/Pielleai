import { z } from 'zod/v4';
import { emailValidation, passwordValidation } from '../_general';

export const signUpSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
  acceptTerms: z.literal(true, 'Campo obbligatorio.'),
  freeOfBooking: z.literal(true, 'Campo obbligatorio.'),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
