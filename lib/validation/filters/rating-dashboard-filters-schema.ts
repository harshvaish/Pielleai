import { z } from 'zod/v4';
import { idValidation } from '@/lib/validation/_general';

export const ratingDashboardFiltersSchema = z.object({
  currentPage: idValidation,
  type: z.enum(['artist', 'venue']),
  sort: z.enum(['asc', 'desc']),
});
