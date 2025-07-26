import { z } from 'zod/v4';

export const signInSchema = z.object({
  email: z.email('Formato non valido. (Es. info@eaglebooking.it)'),
  password: z
    .string('Campo malformato.')
    .min(1, 'Campo obbligatorio.')
    .min(8, 'Almeno 8 caratteri.')
    .max(16, 'Massimo 16 caratteri.'),
});

export type SignInSchema = z.infer<typeof signInSchema>;
