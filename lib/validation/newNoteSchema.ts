import { z } from 'zod/v4';
import { idValidation } from './_general';

export const newNoteSchema = z.object({
  writerId: idValidation,
  receiverId: idValidation,
  content: z.string().min(5, 'Minimo 5 caratteri').trim(),
});
