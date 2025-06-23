import { z } from 'zod';
import { AU_ALLOWED_MIME_TYPES, AU_MAX_SIZE_MB } from '../constants';

export const avatarUploadSchema = z.object({
  name: z.string(),
  size: z
    .number()
    .max(
      AU_MAX_SIZE_MB * 1024 * 1024,
      "L'immagine caricata supera il limite massimo di 5MB."
    ),
  type: z.enum(AU_ALLOWED_MIME_TYPES as [string, ...string[]], {
    errorMap: () => ({ message: 'Formato immagine non supportato.' }),
  }),
});
