import { z } from 'zod/v4';

export const recoverPasswordSchema = z.object({
  email: z.email('Formato non valido. (Es. info@eaglebooking.it)'),
});

export type RecoverPasswordSchema = z.infer<typeof recoverPasswordSchema>;
