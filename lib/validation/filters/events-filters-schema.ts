import { z } from 'zod/v4';
import {
  dateValidation,
  eventStatusEnumValidation,
  idValidation,
  stringIdValidation,
} from '@/lib/validation/_general';

export const eventsFiltersSchema = z.object({
  currentPage: idValidation,
  status: z.array(eventStatusEnumValidation),
  artistIds: z.array(stringIdValidation),
  artistManagerIds: z.array(stringIdValidation),
  venueIds: z.array(stringIdValidation),
  startDate: dateValidation.nullable(),
  endDate: dateValidation.nullable(),
});
