import { z } from 'zod/v4';
import { idValidation, stringIdValidation } from '@/lib/validation/_general';

export const venueManagersTableFiltersSchema = z.object({
  currentPage: idValidation,
  fullName: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  venueIds: z.array(stringIdValidation),
});
