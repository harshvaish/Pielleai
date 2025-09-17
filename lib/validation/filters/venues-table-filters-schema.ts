import { z } from 'zod/v4';
import {
  idValidation,
  stringIdValidation,
  venueTypesEnumValidation,
} from '@/lib/validation/_general';

export const venuesTableFiltersSchema = z.object({
  currentPage: idValidation,
  name: z.string().nullable(),
  company: z.string().nullable(),
  taxCode: z.string().nullable(),
  address: z.string().nullable(),
  types: z.array(venueTypesEnumValidation),
  managerIds: z.array(stringIdValidation),
  capacity: stringIdValidation.nullable(),
});
