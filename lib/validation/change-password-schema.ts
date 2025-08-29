import * as z from 'zod/v4';
import { passwordValidation } from './_general';

export const changePasswordSchema = z
  .object({
    oldPassword: passwordValidation,
    newPassword: passwordValidation,
    newPasswordConfirm: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    path: ['newPasswordConfirm'],
    message: 'Le nuove password non corrispondono.',
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
