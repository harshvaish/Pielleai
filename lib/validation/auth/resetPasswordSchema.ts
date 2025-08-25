import * as z from 'zod/v4';
import { passwordValidation } from '../_general';

export const resetPasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Le password non corrispondono.',
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
