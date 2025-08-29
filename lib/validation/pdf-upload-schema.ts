import * as z from 'zod/v4';
import { PDFU_MAX_SIZE_MB, PDFU_ALLOWED_MIME_TYPES } from '../constants';

export const pdfUploadSchema = z.object({
  name: z.string('Campo malformato.'),
  size: z
    .number('Campo malformato.')
    .max(
      PDFU_MAX_SIZE_MB * 1024 * 1024,
      `L'immagine caricata supera il limite massimo di ${PDFU_MAX_SIZE_MB}MB.`
    ),
  type: z.enum(
    PDFU_ALLOWED_MIME_TYPES,
    'Formato non supportato, carica un PDF.'
  ),
});
