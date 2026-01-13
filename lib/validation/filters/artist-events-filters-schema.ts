import { z } from 'zod/v4';
import { dateValidation, eventStatusEnumValidation, idValidation, stringIdValidation } from '@/lib/validation/_general';

export const artistEventsFiltersSchema = z.object({
  currentPage: idValidation,
  status: z.array(eventStatusEnumValidation),
  venueIds: z.array(stringIdValidation),
  startDate: dateValidation.nullable(),
  endDate: dateValidation.nullable(),
});
