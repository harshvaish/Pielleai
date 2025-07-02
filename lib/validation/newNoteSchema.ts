import { z } from 'zod/v4';

export const newNoteSchema = z.string().min(5, 'Minimo 5 caratteri').trim();
