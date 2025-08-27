import { z } from 'zod/v4';
import { dateValidation, idValidation, stringIdValidation } from '@/lib/validation/_general';
import { eventStatus } from '@/lib/database/schema';

export const eventsFiltersSchema = z.object({
  currentPage: idValidation,
  status: z.array(z.enum(eventStatus.enumValues)),
  artistIds: z.array(stringIdValidation),
  artistManagerIds: z.array(stringIdValidation),
  venueIds: z.array(stringIdValidation),
  startDate: dateValidation.nullable(),
  endDate: dateValidation.nullable(),
});
