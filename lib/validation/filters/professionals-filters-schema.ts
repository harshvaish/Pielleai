import { z } from 'zod/v4';
import { idValidation } from '@/lib/validation/_general';
import { professionalRoleValidation } from '@/lib/validation/professional-schema';

export const professionalsFiltersSchema = z.object({
  currentPage: idValidation,
  fullName: z.string().nullable(),
  role: professionalRoleValidation.nullable(),
  eventId: z.string().nullable(),
});
