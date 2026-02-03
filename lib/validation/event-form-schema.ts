import * as z from 'zod/v4';
import {
  dateValidation,
  emailValidation,
  eventStatusEnumValidation,
  idValidation,
  paymentStatusEnumValidation,
  paymentMethodEnumValidation,
} from './_general';

export const eventFormSchema = z.object({
  artistId: idValidation,
  eventId: idValidation.optional(),
  contractId:idValidation.optional(),
  status: eventStatusEnumValidation.refine(
    (value) => !['cancelled', 'in-dispute'].includes(value),
    "Seleziona un'opzione valida.",
  ),

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
.enum(["draft", "queued", "sent", "viewed", "declined", "voided"])
.optional(),

/* ================= EVENT UI DETAILS ================= */

artistFullName: z.string().optional(),
artistStageName: z.string().optional(),
artistManagerFullName :  z.string().optional(),
venueName: z.string().optional(),
venueCompanyName: z.string().optional(),
venueVatNumber: z.string().optional(),
venueAddress: z.string().optional(),

eventType: z.enum(["live", "dj-set", "festival", ""]).optional(),
eventDate: z.string().optional(),
eventStartTime: z.string().optional(),
eventEndTime: z.string().optional(),
paymentDate:z.string().optional(),
upfrontPayment: z
.number('Campo malformato.')
.positive('Può contenere solo numeri positivi.')
.optional(), 
ccEmails: z.array(z.boolean()).optional(),

tourManagerName: z.string().optional(),

  tourManagerEmail: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    emailValidation.optional(),
  ),

  payrollConsultantEmail: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() !== '' ? val : undefined),
    emailValidation.optional(),
  ),

  notes: z.array(z.string('Campo malformato.').min(3, 'Almeno 3 caratteri.')).optional(),
  professionalIds: z.array(idValidation).optional(),

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
    
  contractSigning: z.boolean("Seleziona un'opzione valida.").optional(),
  depositInvoiceIssuing: z.boolean("Seleziona un'opzione valida.").optional(),
  depositReceiptVerification: z.boolean("Seleziona un'opzione valida.").optional(),
  techSheetSubmission: z.boolean("Seleziona un'opzione valida.").optional(),
  artistEngagement: z.boolean("Seleziona un'opzione valida.").optional(),
  professionalsEngagement: z.boolean("Seleziona un'opzione valida.").optional(),
  accompanyingPersonsEngagement: z.boolean("Seleziona un'opzione valida.").optional(),
  performance: z.boolean("Seleziona un'opzione valida.").optional(),
  postDateFeedback: z.boolean("Seleziona un'opzione valida.").optional(),
  bordereau: z.boolean("Seleziona un'opzione valida.").optional(),
  
  // Payment flow fields
  paymentStatus: paymentStatusEnumValidation.optional(),
  
  upfrontPaymentAmount: z
    .number('Campo malformato.')
    .positive('Deve essere un valore positivo.')
    .optional(),
  upfrontPaymentMethod: paymentMethodEnumValidation.optional(),
  upfrontPaymentDate: z.string('Campo malformato.').optional(),
  upfrontPaymentReference: z.string('Campo malformato.').optional(),
  upfrontPaymentNotes: z.string('Campo malformato.').optional(),
  upfrontPaymentSender: z.string('Campo malformato.').optional(),
  upfrontPaymentStripeId: z.string('Campo malformato.').optional(),
  upfrontInvoiceUrl: z.string('Campo malformato.').optional(),
  upfrontInvoiceName: z.string('Campo malformato.').optional(),
  upfrontConfirmationUrl: z.string('Campo malformato.').optional(),
  upfrontConfirmationName: z.string('Campo malformato.').optional(),
  
  finalBalanceAmount: z
    .number('Campo malformato.')
    .positive('Deve essere un valore positivo.')
    .optional(),
  finalBalanceMethod: paymentMethodEnumValidation.optional(),
  finalBalanceDate: z.string('Campo malformato.').optional(),
  finalBalanceReference: z.string('Campo malformato.').optional(),
  finalBalanceNotes: z.string('Campo malformato.').optional(),
  finalBalanceSender: z.string('Campo malformato.').optional(),
  finalBalanceStripeId: z.string('Campo malformato.').optional(),
  finalBalanceDeadline: z.string('Campo malformato.').optional(),
  finalInvoiceUrl: z.string('Campo malformato.').optional(),
  finalInvoiceName: z.string('Campo malformato.').optional(),
  finalConfirmationUrl: z.string('Campo malformato.').optional(),
  finalConfirmationName: z.string('Campo malformato.').optional(),
  
  contractSignedDate: z.string('Campo malformato.').optional(),
  contractDocumentUrl: z.string('Campo malformato.').optional(),
  
  contractDocument: z
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
  hostedEvent: z.boolean().optional(),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;

export const eventRequestFormSchema = eventFormSchema
  .pick({
    artistId: true,
    venueId: true,
    paymentDate: true,
    hostedEvent: true,
  })
  .extend({
    availability: z.object(
      {
        id: idValidation.optional(),
        startDate: dateValidation,
        endDate: dateValidation,
      },
      {
        message: "Seleziona un'opzione valida.",
      },
    ),
  });

export type EventRequestFormSchema = z.infer<typeof eventRequestFormSchema>;
