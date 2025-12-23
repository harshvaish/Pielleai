import { z } from 'zod/v4';
import {
  contractStatusEnumValidation,
  dateValidation,
  stringIdValidation,
} from './_general';

export const contractsExportFiltersSchema = z.object({
  s: z.array(contractStatusEnumValidation),
  c: z.boolean().optional(),
  a: z.array(stringIdValidation),
  m: z.array(stringIdValidation),
  v: z.array(stringIdValidation),
  sd: dateValidation.nullable(),
  ed: dateValidation.nullable(),
});
