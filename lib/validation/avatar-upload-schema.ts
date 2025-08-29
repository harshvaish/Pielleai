import * as z from 'zod/v4';
import { AU_ALLOWED_MIME_TYPES, AU_MAX_SIZE_MB } from '../constants';

export const avatarUploadSchema = z.object({
  name: z.string('Campo malformato.'),
  size: z.number('Campo malformato.').max(AU_MAX_SIZE_MB * 1024 * 1024, `L'immagine caricata supera il limite massimo di ${AU_MAX_SIZE_MB}MB.`),
  type: z.enum(AU_ALLOWED_MIME_TYPES, 'Formato non supportato, carica un JPEG, PNG o WEBP.'),
});
