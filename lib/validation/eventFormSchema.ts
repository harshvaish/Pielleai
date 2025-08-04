import * as z from 'zod/v4';
import { EVENTS_STATUS } from '../constants';

export const eventFormSchema = z.object({
  artistId: z
    .number("Seleziona un'opzione valida.")
    .min(1, 'Campo obbligatorio.')
    .positive("Seleziona un'opzione valida."),

  status: z.enum(EVENTS_STATUS, "Seleziona un'opzione valida."),

  artistManagerProfileId: z
    .number("Seleziona un'opzione valida.")
    .min(1, 'Campo obbligatorio.')
    .positive("Seleziona un'opzione valida.")
    .optional(),

  availability: z.object(
    {
      id: z.string("Seleziona un'opzione valida.").optional(),
      date: z.string("Seleziona un'opzione valida."),
      startTime: z.string("Seleziona un'opzione valida."),
      endTime: z.string("Seleziona un'opzione valida."),
    },
    "Seleziona un'opzione valida."
  ),

  venueId: z
    .number("Seleziona un'opzione valida.")
    .min(1, 'Campo obbligatorio.')
    .positive("Seleziona un'opzione valida."),

  administrationEmail: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z.email('Formato non valido. (Es. info@eaglebooking.it)').optional()
  ),

  payrollConsultantEmail: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z.email('Formato non valido. (Es. info@eaglebooking.it)').optional()
  ),

  notes: z
    .array(z.string('Campo malformato.').min(3, 'Almeno 3 caratteri.'))
    .optional(),

  moCost: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .number('Campo malformato.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  venueManagerCost: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .number('Campo malformato.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  depositCost: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .number('Campo malformato.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  depositInvoiceNumber: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(1, 'Minimo 1 carattere.')
      .max(100, 'Massimo 100 caratteri.')
      .regex(
        /^[a-zA-Z0-9\-\/]+$/,
        'Può contenere solo lettere, numeri, trattini e slash.'
      )
      .optional()
  ),

  expenseReimbursement: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .number('Campo malformato.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  bookingPercentage: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .number('Campo malformato.')
      .min(0, 'Minimo 0.')
      .max(100, 'Massimo 100.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  supplierCost: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .number('Campo malformato.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  moArtistAdvancedExpenses: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .number('Campo malformato.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  artistNetCost: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .number('Campo malformato.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  artistUpfrontCost: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .number('Campo malformato.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  hotel: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(300, 'Massimo 300 caratteri.')
      .trim()
      .optional()
  ),

  restaurant: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(300, 'Massimo 300 caratteri.')
      .trim()
      .optional()
  ),

  eveningContact: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(300, 'Massimo 300 caratteri.')
      .trim()
      .optional()
  ),

  moCoordinatorId: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .number("Seleziona un'opzione valida.")
      .min(1, 'Campo obbligatorio.')
      .positive("Seleziona un'opzione valida.")
      .optional()
  ),

  totalCost: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .number('Campo malformato.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  transportationsCost: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .number('Campo malformato.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  cashBalanceCost: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .number('Campo malformato.')
      .positive('Può contenere solo numeri positivi.')
      .optional()
  ),

  soundCheckStart: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z.string('Campo malformato.').optional()
  ),

  soundCheckEnd: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z.string('Campo malformato.').optional()
  ),

  tecnicalRiderDocument: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .object(
        {
          url: z
            .url('Inserisci un file valido.')
            .refine(
              (url) =>
                url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}`),
              'Campo non valido.'
            ),
          name: z.string("Seleziona un'opzione valida."),
        },
        "Seleziona un'opzione valida."
      )
      .optional()
  ),

  contractSigning: z
    .boolean({ message: "Seleziona un'opzione valida." })
    .default(false),

  depositInvoiceIssuing: z
    .boolean({ message: "Seleziona un'opzione valida." })
    .default(false),

  depositReceiptVerification: z
    .boolean({ message: "Seleziona un'opzione valida." })
    .default(false),

  techSheetSubmission: z
    .boolean({ message: "Seleziona un'opzione valida." })
    .default(false),

  artistEngagement: z
    .boolean({ message: "Seleziona un'opzione valida." })
    .default(false),

  professionalsEngagement: z
    .boolean({ message: "Seleziona un'opzione valida." })
    .default(false),

  accompanyingPersonsEngagement: z
    .boolean({ message: "Seleziona un'opzione valida." })
    .default(false),

  performance: z
    .boolean({ message: "Seleziona un'opzione valida." })
    .default(false),

  postDateFeedback: z
    .boolean({ message: "Seleziona un'opzione valida." })
    .default(false),

  bordereau: z
    .boolean({ message: "Seleziona un'opzione valida." })
    .default(false),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
