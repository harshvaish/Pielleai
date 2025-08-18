import * as z from 'zod/v4';
import { EVENTS_STATUS } from '../constants';

export const eventFormSchema = z.object({
  artistId: z.number("Seleziona un'opzione valida.").min(1, 'Campo obbligatorio.').positive("Seleziona un'opzione valida."),

  status: z.enum(EVENTS_STATUS, "Seleziona un'opzione valida."),

  artistManagerProfileId: z.number("Seleziona un'opzione valida.").min(1, 'Campo obbligatorio.').positive("Seleziona un'opzione valida.").optional(),

  availability: z.object(
    {
      id: z.number("Seleziona un'opzione valida.").min(1, 'Campo obbligatorio.').positive("Seleziona un'opzione valida.").optional(),
      date: z.string("Seleziona un'opzione valida."),
      startTime: z.string("Seleziona un'opzione valida."),
      endTime: z.string("Seleziona un'opzione valida."),
    },
    "Seleziona un'opzione valida."
  ),

  venueId: z.number("Seleziona un'opzione valida.").min(1, 'Campo obbligatorio.').positive("Seleziona un'opzione valida."),

  tourManagerEmail: z.preprocess((val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined), z.email('Formato non valido. (Es. info@eaglebooking.it)').optional()),

  administrationEmail: z.preprocess((val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined), z.email('Formato non valido. (Es. info@eaglebooking.it)').optional()),

  payrollConsultantEmail: z.preprocess((val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined), z.email('Formato non valido. (Es. info@eaglebooking.it)').optional()),

  notes: z.array(z.string('Campo malformato.').min(3, 'Almeno 3 caratteri.')).optional(),

  moCost: z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),

  venueManagerCost: z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),

  depositCost: z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),

  depositInvoiceNumber: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(1, 'Minimo 1 carattere.')
      .max(100, 'Massimo 100 caratteri.')
      .regex(/^[a-zA-Z0-9\-\/]+$/, 'Può contenere solo lettere, numeri, trattini e slash.')
      .optional()
  ),

  expenseReimbursement: z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),

  bookingPercentage: z.number('Campo malformato.').min(0, 'Minimo 0.').max(100, 'Massimo 100.').optional(),

  supplierCost: z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),

  moArtistAdvancedExpenses: z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),

  artistNetCost: z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),

  artistUpfrontCost: z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),

  hotel: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z.string('Campo malformato.').min(2, 'Minimo 2 caratteri.').max(300, 'Massimo 300 caratteri.').trim().optional()
  ),

  restaurant: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z.string('Campo malformato.').min(2, 'Minimo 2 caratteri.').max(300, 'Massimo 300 caratteri.').trim().optional()
  ),

  eveningContact: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z.string('Campo malformato.').min(2, 'Minimo 2 caratteri.').max(300, 'Massimo 300 caratteri.').trim().optional()
  ),

  moCoordinatorId: z.number("Seleziona un'opzione valida.").min(1, 'Campo obbligatorio.').positive("Seleziona un'opzione valida.").optional(),

  totalCost: z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),

  transportationsCost: z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),

  cashBalanceCost: z.number('Campo malformato.').positive('Può contenere solo numeri positivi.').optional(),

  soundCheckStart: z.preprocess((val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined), z.string('Campo malformato.').optional()),

  soundCheckEnd: z.preprocess((val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined), z.string('Campo malformato.').optional()),

  tecnicalRiderDocument: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .object(
        {
          url: z.url('Inserisci un file valido.').refine((url) => url.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}`), 'Campo non valido.'),
          name: z.string("Seleziona un'opzione valida."),
        },
        "Seleziona un'opzione valida."
      )
      .optional()
  ),

  contractSigning: z.boolean({ message: "Seleziona un'opzione valida." }),
  depositInvoiceIssuing: z.boolean({ message: "Seleziona un'opzione valida." }),
  depositReceiptVerification: z.boolean({ message: "Seleziona un'opzione valida." }),
  techSheetSubmission: z.boolean({ message: "Seleziona un'opzione valida." }),
  artistEngagement: z.boolean({ message: "Seleziona un'opzione valida." }),
  professionalsEngagement: z.boolean({ message: "Seleziona un'opzione valida." }),
  accompanyingPersonsEngagement: z.boolean({ message: "Seleziona un'opzione valida." }),
  performance: z.boolean({ message: "Seleziona un'opzione valida." }),
  postDateFeedback: z.boolean({ message: "Seleziona un'opzione valida." }),
  bordereau: z.boolean({ message: "Seleziona un'opzione valida." }),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
