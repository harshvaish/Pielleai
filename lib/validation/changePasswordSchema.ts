import * as z from 'zod/v4';

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string('Campo malformato.')
      .min(1, 'Password obbligatoria.')
      .min(8, 'Almeno 8 caratteri.')
      .max(16, 'Massimo 16 caratteri.'),
    newPassword: z
      .string('Campo malformato.')
      .min(1, 'Password obbligatoria.')
      .min(8, 'Almeno 8 caratteri.')
      .max(16, 'Massimo 16 caratteri.'),
    newPasswordConfirm: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    path: ['newPasswordConfirm'],
    message: 'Le nuove password non corrispondono.',
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
