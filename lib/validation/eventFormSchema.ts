import * as z from 'zod/v4';
import { EVENTS_STATUS } from '../constants';

export const eventFormSchema = z.object({
  artistId: z
    .number("Seleziona un'opzione valida.")
    .min(1, 'Campo obbligatorio.')
    .positive("Seleziona un'opzione valida."),

  status: z.enum(EVENTS_STATUS, "Seleziona un'opzione valida."),

  artistManagerId: z
    .number("Seleziona un'opzione valida.")
    .min(1, 'Campo obbligatorio.')
    .positive("Seleziona un'opzione valida."),

  availabilityId: z
    .number("Seleziona un'opzione valida.")
    .min(1, 'Campo obbligatorio.')
    .positive("Seleziona un'opzione valida."),

  venueId: z
    .number("Seleziona un'opzione valida.")
    .min(1, 'Campo obbligatorio.')
    .positive("Seleziona un'opzione valida."),

  administration: z
    .string('Campo malformato.')
    .min(5, 'Minimo 5 caratteri.')
    .max(150, 'Massimo 150 caratteri.')
    .trim(),

  cachetCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.'),

  moCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.'),

  djCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.'),

  administrativeCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.'),

  extrasCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.'),

  consultingCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.'),

  engagementCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.'),

  socialsCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.'),

  transportationCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.'),

  artistCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.'),

  notes: z
    .array(z.string('Campo malformato.').min(3, 'Almeno 3 caratteri.'))
    .optional(),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
