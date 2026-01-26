'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { it } from 'date-fns/locale';
import { format } from 'date-fns';
import { ArtistSelectData, Event as DomainEvent, MoCoordinator, UserRole, VenueSelectData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { eventFormSchema } from '@/lib/validation/event-form-schema';
import type { EventFormSchema } from '@/lib/validation/event-form-schema';
import { updateEvent } from '@/lib/server-actions/events/update-event';
import EventForm from '../form/EventForm';
import { useState } from 'react';
import { generateEventTitle } from '@/lib/utils/generate-event-title';
import { generateAndUploadEventSummaryPdf } from '../utils/event-summary';

type UpdateEventFormProps = {
  event: DomainEvent;
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
  userRole: UserRole;
  closeDialog?: () => void;
};

type FormContractStatus = EventFormSchema['contractStatus'];

const normalizeContractStatus = (
  status?: string | null
): FormContractStatus => {
  switch (status) {
    case 'draft':
    case 'sent':
    case 'declined':
    case 'voided':
      return status;
    case 'queued':
    case 'viewed':
    case 'signed':
      return 'sent';
    default:
      return 'draft';
  }
};

export default function UpdateEventForm({
  event,
  artists,
  venues,
  moCoordinators,
  userRole,
  closeDialog,
}: UpdateEventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ALL_CC_EMAILS = [
    "Tour Manager",
    "Admin",
    "team@agency.com",
    "finance@agency.com",
    "admin@agency.com",
  ];
  
  const buildDefaultCcBooleans = (
    contractCcs?: string[] | null
  ): boolean[] =>
    ALL_CC_EMAILS.map((email) =>
      contractCcs?.includes(email) ?? false
    );
  
  const toDate = (value: Date | string | null | undefined): Date | undefined => {
    if (!value) return undefined;
    const parsed = value instanceof Date ? value : new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  };

  const availabilityStart = toDate(event.availability.startDate);
  const availabilityEnd = toDate(event.availability.endDate);
  const paymentDate = toDate(event.paymentDate ?? null);
  const eventTitle =
    event.title?.trim() ||
    (availabilityStart && availabilityEnd
      ? generateEventTitle(
          event.artist.stageName?.trim() ||
            `${event.artist.name} ${event.artist.surname}`.trim(),
          event.venue.name,
          availabilityStart,
          availabilityEnd,
        )
      : `Evento #${event.id}`);

  const methods = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      artistId: event.artist.id,
      artistFullName: `${event.artist.name} ${event.artist.surname}`,
      artistStageName: event.artist.stageName || '',
      status: event.status,
      artistManagerProfileId: event.artistManager?.profileId || undefined,
      availability: {
        id: event.availability.id || undefined,
        startDate: availabilityStart,
        endDate: availabilityEnd,
      },
      venueId: event.venue.id,
      venueName: event.venue.name || '',
      venueAddress: event.venue.address || '',
      venueVatNumber: event.venue.vatCode || '',
      venueCompanyName: event.venue.company || '',
      artistManagerFullName: `${event?.artistManager?.name} ${event?.artistManager?.surname}`,
      tourManagerEmail:
        event.tourManagerEmail || event.artist?.tourManagerEmail || '',
      tourManagerName: event.tourManagerName || '',
      payrollConsultantEmail:
        event.payrollConsultantEmail || 'riccardo.gulisano@gmail.com',
      notes: event.notes.flatMap((note) => note.content) || [],
     
      moCost: parseFloat(event.moCost || '') || undefined,
      venueManagerCost: parseFloat(event.venueManagerCost || '') || undefined,
      depositCost: parseFloat(event.depositCost || '') || undefined,
      depositInvoiceNumber: event.depositInvoiceNumber || undefined,
      bookingPercentage: parseFloat(event.bookingPercentage || '') || undefined,
      moArtistAdvancedExpenses: parseFloat(event.moArtistAdvancedExpenses || '') || undefined,
      artistNetCost: parseFloat(event.artistNetCost || '') || undefined,
      artistUpfrontCost: parseFloat(event.artistUpfrontCost || '') || undefined,
      hotel: event.hotel || '',
      restaurant: event.restaurant || '',
      eveningContact: event.eveningContact || '',
      moCoordinatorId: event.moCoordinator?.id || undefined,
      totalCost: parseFloat(event.totalCost || '') || undefined,
      contractId: event.contract?.id || undefined,
      contractStatus: normalizeContractStatus(event.contract?.status),
      transportationsCost: parseFloat(event.transportationsCost || '') || undefined,
      cashBalanceCost: parseFloat(event.cashBalanceCost || '') || undefined,
      hotelCost : parseFloat(event.hotelCost || '') || undefined,
      restaurantCost: parseFloat(event.restaurantCost || '') || undefined,
      soundCheckEnd: event.soundCheckEnd || '',
      soundCheckStart: event.soundCheckStart || '',
      tecnicalRiderDocument:
        event.tecnicalRiderUrl && event.tecnicalRiderName
          ? {
              url: event.tecnicalRiderUrl,
              name: event.tecnicalRiderName,
            }
          : undefined,

      contractSigning: event.contractSigning ?? false,
      depositInvoiceIssuing: event.depositInvoiceIssuing ?? false,
      depositReceiptVerification: event.depositReceiptVerification ?? false,
      techSheetSubmission: event.techSheetSubmission ?? false,
      artistEngagement: event.artistEngagement ?? false,
      professionalsEngagement: event.professionalsEngagement ?? false,
      accompanyingPersonsEngagement: event.accompanyingPersonsEngagement ?? false,
      performance: event.performance ?? false,
      postDateFeedback: event.postDateFeedback ?? false,
      bordereau: event.bordereau ?? false,
      eventId: event.id,
      eventType: event.eventType ?? '',
      eventDate: availabilityStart ? format(availabilityStart, 'yyyy-MM-dd') : '',
      ccEmails: buildDefaultCcBooleans(event.contract?.ccs),
      eventStartTime : availabilityStart ? format(availabilityStart, 'HH:mm', { locale: it }) : '',
      eventEndTime : availabilityEnd ? format(availabilityEnd, 'HH:mm', { locale: it }) : '',
      contractDocument:
      event.contract?.fileUrl && event.contract?.fileName
        ? {
            url: event.contract.fileUrl,
            name: event.contract.fileName,
          }
        : undefined,

      paymentDate: paymentDate ? format(paymentDate, "yyyy-MM-dd") : "",
          upfrontPayment: parseFloat(event.artistUpfrontCost || '') || undefined,
    },
  });
  const { handleSubmit } = methods;
  const onSubmit = async (data: EventFormSchema) => {
    console.log("inside submit")
    setIsSubmitting(true);
    try {
      const response = await updateEvent(event.id, data);

      if (response.success) {
        toast.success('Evento aggiornato!');
        if (data.status === 'ended' && event.status !== 'ended') {
          try {
            await generateAndUploadEventSummaryPdf(event, {
              status: 'ended',
              startDate: data.availability?.startDate ?? null,
              endDate: data.availability?.endDate ?? null,
              eventType: data.eventType || null,
              artistName: data.artistFullName || null,
              artistStageName: data.artistStageName || null,
              venueName: data.venueName || null,
              venueAddress: data.venueAddress || null,
              venueCompany: data.venueCompanyName || null,
              venueVat: data.venueVatNumber || null,
              artistManagerName: data.artistManagerFullName || null,
              tourManagerEmail: data.tourManagerEmail || null,
              payrollConsultantEmail: data.payrollConsultantEmail || null,
              paymentDate: data.paymentDate || null,
              totalCost: data.totalCost ?? null,
              depositCost: data.depositCost ?? null,
              transportationsCost: data.transportationsCost ?? null,
              cashBalanceCost: data.cashBalanceCost ?? null,
              moCost: data.moCost ?? null,
              venueManagerCost: data.venueManagerCost ?? null,
              artistNetCost: data.artistNetCost ?? null,
              artistUpfrontCost: data.artistUpfrontCost ?? null,
              hotel: data.hotel || null,
              hotelCost: data.hotelCost ?? null,
              restaurant: data.restaurant || null,
              restaurantCost: data.restaurantCost ?? null,
              eveningContact: data.eveningContact || null,
              soundCheckStart: data.soundCheckStart || null,
              soundCheckEnd: data.soundCheckEnd || null,
              notes: data.notes || null,
              protocolNumber: event.protocolNumber ?? null,
            });
            toast.success('PDF evento generato.');
          } catch (error) {
            console.error('Errore generazione PDF evento:', error);
            toast.error('Errore durante la generazione del PDF evento.');
          }
        }
        if (closeDialog) {
          closeDialog();
        }
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (closeDialog) {
      closeDialog();
      return;
    }
    router.back();
  };
  return (
    <section className='max-h-full overflow-y-auto'>
      <FormProvider {...methods}>
        <form
          className='flex flex-col gap-1 pt-1 pb-2 px-2'
          onSubmit={handleSubmit(onSubmit)}
          noValidate={true}
        >
          <div className='flex items-center justify-between gap-3'>
            <h1 className='text-2xl font-bold'>Modifica evento</h1>
            <div className='flex items-center gap-1.5'>
              <Button
                type='button'
                size='sm'
                onClick={handleCancel}
                variant='ghost'
                className='text-destructive h-8 px-2'
                disabled={isSubmitting}
              >
                <X /> Annulla
              </Button>
              <Button
                type='submit'
                size='sm'
                className='h-8 px-3'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvataggio...' : 'Salva'}
              </Button>
            </div>
          </div>
          <div className='text-sm text-zinc-500 -mt-1'>{eventTitle}</div>

          <section className='bg-white p-6 rounded-2xl'>
            <EventForm
              artists={artists}
              venues={venues}
              moCoordinators={moCoordinators}
              event={event}
              mode="update"
              userRole={userRole}
              closeDialog={closeDialog}
            />
          </section>
        </form>
      </FormProvider>
    </section>
  );
}
