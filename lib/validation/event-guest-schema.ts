import { z } from 'zod/v4';
import { idValidation } from '@/lib/validation/_general';

export const eventGuestStatusValidation = z.enum([
  'to-invite',
  'invited',
  'attending',
  'not-attending',
]);
export const eventGuestOriginGroupValidation = z.enum([
  'artist',
  'artist-manager',
  'booking',
  'major',
]);
export const eventGuestColorTagValidation = z.enum(['green', 'yellow', 'red']);

export const eventGuestNameValidation = z
  .string('Campo malformato.')
  .trim()
  .min(2, 'Minimo 2 caratteri.')
  .max(100, 'Massimo 100 caratteri.');

export const eventGuestEmailValidation = z
  .string()
  .trim()
  .email('Formato email non valido.')
  .optional()
  .nullable();

export const createEventGuestSchema = z.object({
  eventId: idValidation,
  fullName: eventGuestNameValidation,
  email: eventGuestEmailValidation,
  originGroup: eventGuestOriginGroupValidation,
  colorTag: eventGuestColorTagValidation,
  allowOverLimit: z.boolean().optional(),
});

export const updateEventGuestSchema = z.object({
  guestId: idValidation,
  fullName: eventGuestNameValidation,
  email: eventGuestEmailValidation,
  originGroup: eventGuestOriginGroupValidation,
  colorTag: eventGuestColorTagValidation,
  status: eventGuestStatusValidation,
});

export const deleteEventGuestSchema = z.object({
  guestId: idValidation,
});

export const inviteEventGuestsSchema = z.object({
  eventId: idValidation,
  guestIds: z.array(idValidation).min(1, 'Seleziona almeno un invitato.'),
});

export const sendAccreditationListSchema = z.object({
  eventId: idValidation,
});
