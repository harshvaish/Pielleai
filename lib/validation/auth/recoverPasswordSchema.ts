import { z } from 'zod/v4';
import { emailValidation } from '../_general';

export const recoverPasswordSchema = z.object({
  email: emailValidation,
});

export type RecoverPasswordSchema = z.infer<typeof recoverPasswordSchema>;
