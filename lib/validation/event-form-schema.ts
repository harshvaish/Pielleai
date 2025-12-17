import * as z from 'zod/v4';
import {
  dateValidation,
  emailValidation,
  eventStatusEnumValidation,
  idValidation,
} from './_general';

export const eventFormSchema = z.object({
  artistId: idValidation,
  eventId: idValidation,
  status: eventStatusEnumValidation,

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

  /* ================= CONTRACT ================= */

contractStatus: z
.enum(["draft", "pending", "ready", "sent"])
.optional(),

/* ================= EVENT UI DETAILS ================= */

artistFullName: z.string().optional(),
artistStageName: z.string().optional(),

venueName: z.string().optional(),
venueCompanyName: z.string().optional(),
venueVatNumber: z.string().optional(),
venueAddress: z.string().optional(),

eventType: z.enum(["concert", "dj-set", "private-event"]).optional(),
eventDate: z.string().optional(),
eventStartTime: z.string().optional(),
eventEndTime: z.string().optional(),
depositPaymentDate:z.string().optional(),
upfrontPayment: z.string().optional(),
totalCachetText: z.string().optional(), 
transportCostText: z.string().optional(),
ccEmails: z.array(z.boolean()).optional(),


  tourManagerEmail: z.preprocess(
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

  bookingPercentage: z
    .number('Campo malformato.')
    .min(0, 'Minimo 0.')
    .max(100, 'Massimo 100.')
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

  hotelCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.')
    .optional(),

  restaurant: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    z
      .string('Campo malformato.')
      .min(2, 'Minimo 2 caratteri.')
      .max(300, 'Massimo 300 caratteri.')
      .trim()
      .optional(),
  ),

  restaurantCost: z
    .number('Campo malformato.')
    .positive('Può contenere solo numeri positivi.')
    .optional(),

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
    contractNumber: z
    .string('Campo malformato.')
    .min(1, 'Minimo 1 carattere.')
    .max(200, 'Massimo 200 caratteri.')
    .optional(),
  
  contractDate: z
    .string('Campo malformato.')
    .optional(), // stored as 'yyyy-mm-dd'
  
  signedContractDocument: z.any().optional(),
  
  contractInvoiceNumber: z
    .string('Campo malformato.')
    .min(1, 'Minimo 1 carattere.')
    .max(200, 'Massimo 200 caratteri.')
    .optional(),
  
  contractInvoiceAmount: z
    .number('Campo malformato.')
    .positive('Deve essere un valore positivo.')
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

export const eventRequestFormSchema = eventFormSchema
  .pick({
    artistId: true,
    venueId: true,
  })
  .extend({
    availability: z.object(
      {
        id: idValidation,
        startDate: dateValidation,
        endDate: dateValidation,
      },
      {
        message: "Seleziona un'opzione valida.",
      },
    ),
  });

export type EventRequestFormSchema = z.infer<typeof eventRequestFormSchema>;
