import { z } from 'zod/v4';
import { idValidation, stringIdValidation } from '@/lib/validation/_general';

export const artistsTableFiltersSchema = z.object({
  currentPage: idValidation,
  fullName: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  categories: z.array(z.string()).optional(),
  managerIds: z.array(stringIdValidation),
  zoneIds: z.array(stringIdValidation),
});
