import * as z from 'zod/v4';

export const resetPasswordSchema = z
  .object({
    password: z
      .string('Campo malformato.')
      .min(1, 'Password obbligatoria.')
      .min(8, 'Almeno 8 caratteri.')
      .max(16, 'Massimo 16 caratteri.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Le password non corrispondono.',
  });
