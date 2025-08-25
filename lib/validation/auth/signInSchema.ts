import { z } from 'zod/v4';
import { emailValidation, passwordValidation } from '../_general';

export const signInSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export type SignInSchema = z.infer<typeof signInSchema>;
