import { z } from 'zod/v4';
import { idValidation, phoneValidation } from '@/lib/validation/_general';

export const professionalRoleValidation = z.enum([
  'journalist',
  'technician',
  'photographer',
  'backstage',
  'other',
]);

export const professionalNameValidation = z
  .string('Campo malformato.')
  .trim()
  .max(100, 'Massimo 100 caratteri.');

const emailValidation = z
  .string()
  .trim()
  .email('Formato email non valido.')
  .optional()
  .nullable();

const optionalPhoneValidation = z.preprocess(
  (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
  phoneValidation.optional(),
);

export const createProfessionalSchema = z.object({
  fullName: professionalNameValidation,
  role: professionalRoleValidation,
  roleDescription: z.string().trim().max(200).optional().nullable(),
  email: emailValidation,
  phone: optionalPhoneValidation.optional().nullable(),
  competencies: z.string().trim().max(2000).optional().nullable(),
});

export const updateProfessionalSchema = createProfessionalSchema.extend({
  professionalId: idValidation,
});

export const deleteProfessionalSchema = z.object({
  professionalId: idValidation,
});

export const updateEventProfessionalsSchema = z.object({
  eventId: idValidation,
  professionalIds: z.array(idValidation),
});
