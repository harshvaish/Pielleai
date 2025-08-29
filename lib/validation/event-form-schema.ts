import * as z from 'zod/v4';
import { dateValidation, emailValidation, idValidation } from './_general';
import { eventStatus } from '../database/schema';

export const eventFormSchema = z.object({
  artistId: idValidation,

  status: z.enum(eventStatus.enumValues, "Seleziona un'opzione valida."),

  artistManagerProfileId: idValidation.optional(),

  availability: z.object(
    {
      id: idValidation.optional(),
      startDate: dateValidation,
      endDate: dateValidation,
    },
    "Seleziona un'opzione valida.",
  ),

  venueId: idValidation,

  tourManagerEmail: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    emailValidation.optional(),
  ),

  administrationEmail: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    emailValidation.optional(),
  ),

  payrollConsultantEmail: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    emailValidation.optional(),
  ),

  notes: z.array(z.string('Campo malformato.').min(3, 'Almeno 3 caratteri.')).optional(),

  moCost: z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),

  venueManagerCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.')
    .optional(),

  depositCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.')
    .optional(),

  depositInvoiceNumber: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(1, 'Minimo 1 carattere.')
      .max(100, 'Massimo 100 caratteri.')
      .regex(/^[a-zA-Z0-9\-\/]+$/, 'Può contenere solo lettere, numeri, trattini e slash.')
      .optional(),
  ),

  expenseReimbursement: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.')
    .optional(),

  bookingPercentage: z
    .number('Campo malformato.')
    .min(0, 'Minimo 0.')
    .max(100, 'Massimo 100.')
    .optional(),

  supplierCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.')
    .optional(),

  moArtistAdvancedExpenses: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.')
    .optional(),

  artistNetCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.')
    .optional(),

  artistUpfrontCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.')
    .optional(),

  hotel: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(300, 'Massimo 300 caratteri.')
      .trim()
      .optional(),
  ),

  restaurant: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(300, 'Massimo 300 caratteri.')
      .trim()
      .optional(),
  ),

  eveningContact: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(300, 'Massimo 300 caratteri.')
      .trim()
      .optional(),
  ),

  moCoordinatorId: idValidation.optional(),

  totalCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.')
    .optional(),

  transportationsCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.')
    .optional(),

  cashBalanceCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.')
    .optional(),

  soundCheckStart: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z.string('Campo malformato.').optional(),
  ),

  soundCheckEnd: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z.string('Campo malformato.').optional(),
  ),

  tecnicalRiderDocument: z
    .object(
      {
        url: z
          .url('Inserisci un file valido.')
          .refine(
            (url) => url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}`),
            'Campo non valido.',
          ),
        name: z.string("Seleziona un'opzione valida."),
      },
      "Seleziona un'opzione valida.",
    )
    .optional(),
  contractSigning: z.boolean("Seleziona un'opzione valida."),
  depositInvoiceIssuing: z.boolean("Seleziona un'opzione valida."),
  depositReceiptVerification: z.boolean("Seleziona un'opzione valida."),
  techSheetSubmission: z.boolean("Seleziona un'opzione valida."),
  artistEngagement: z.boolean("Seleziona un'opzione valida."),
  professionalsEngagement: z.boolean("Seleziona un'opzione valida."),
  accompanyingPersonsEngagement: z.boolean("Seleziona un'opzione valida."),
  performance: z.boolean("Seleziona un'opzione valida."),
  postDateFeedback: z.boolean("Seleziona un'opzione valida."),
  bordereau: z.boolean("Seleziona un'opzione valida."),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
