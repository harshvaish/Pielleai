import { z } from 'zod/v4';
import { idValidation, stringIdValidation } from '@/lib/validation/_general';
import { venueTypes } from '@/lib/database/schema';

export const venuesTableFiltersSchema = z.object({
  currentPage: idValidation,
  name: z.string().nullable(),
  company: z.string().nullable(),
  taxCode: z.string().nullable(),
  address: z.string().nullable(),
  types: z.array(z.enum(venueTypes.enumValues)),
  managerIds: z.array(stringIdValidation),
  capacity: stringIdValidation.nullable(),
});
