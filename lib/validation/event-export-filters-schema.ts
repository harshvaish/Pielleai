import { z } from 'zod/v4';
import { dateValidation, eventStatusEnumValidation, stringIdValidation } from './_general';

export const eventsExportFiltersSchema = z.object({
  s: z.array(eventStatusEnumValidation),
  c: z.boolean(),
  a: z.array(stringIdValidation),
  m: z.array(stringIdValidation),
  v: z.array(stringIdValidation),
  sd: dateValidation.nullable(),
  ed: dateValidation.nullable(),
});
