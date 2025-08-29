import { z } from 'zod/v4';
import { eventStatus } from '../database/schema';
import { dateValidation, stringIdValidation } from './_general';

export const eventsExportFiltersSchema = z.object({
  s: z.array(z.enum(eventStatus.enumValues)),
  a: z.array(stringIdValidation),
  m: z.array(stringIdValidation),
  v: z.array(stringIdValidation),
  sd: dateValidation.nullable(),
  ed: dateValidation.nullable(),
});
