import { z } from 'zod/v4';
import { idValidation } from './_general';

export const newNoteSchema = z.object({
  writerId: z
    .string('Campo malformato')
    .regex(/^[a-zA-Z0-9]+$/, 'Può contenere solo lettere e numeri.'),
  receiverId: idValidation,
  content: z.string('Campo malformato').min(5, 'Minimo 5 caratteri').trim(),
});
