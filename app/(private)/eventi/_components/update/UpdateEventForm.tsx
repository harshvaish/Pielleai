'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { it } from 'date-fns/locale';
import { format } from 'date-fns';
import { ArtistSelectData,   Event as DomainEvent, MoCoordinator, VenueSelectData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { EventFormSchema, eventFormSchema } from '@/lib/validation/event-form-schema';
import { updateEvent } from '@/lib/server-actions/events/update-event';
import EventForm from '../form/EventForm';
import { useTransition } from 'react';

type UpdateEventFormProps = {
  event: DomainEvent;
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
  closeDialog: () => void;
};

export default function UpdateEventForm({
  event,
  artists,
  venues,
  moCoordinators,
  closeDialog,
}: UpdateEventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // event.availability.startDate = new Date(event.availability.startDate);
  // event.availability.endDate = new Date(event.availability.endDate);
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
        startDate: event.availability.startDate || undefined,
        endDate: event.availability.endDate || undefined,
      },
      venueId: event.venue.id,
      venueName: event.venue.name || '',
      venueAddress: event.venue.address || '',
      venueVatNumber: event.venue.vatCode || '',
      venueCompanyName: event.venue.company || '',
      tourManagerEmail: event.tourManagerEmail || '',
      tourManagerName: event.tourManagerName || '',
      payrollConsultantEmail: event.payrollConsultantEmail || '',
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
      transportationsCost: parseFloat(event.transportationsCost || '') || undefined,
      cashBalanceCost: parseFloat(event.cashBalanceCost || '') || undefined,
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
      eventType: event.eventType,
      eventDate: format(event.availability.startDate, 'yyyy-MM-dd'),
      eventStartTime : format(event.availability.startDate, 'HH:mm', { locale: it }),
      eventEndTime : format(event.availability.endDate, 'HH:mm', { locale: it }),
      paymentDate: event.paymentDate
      ? format(event.paymentDate, "yyyy-MM-dd")
      : "",
          upfrontPayment: parseFloat(event.depositCost || '') || undefined,

    },
  });
  const { handleSubmit } = methods;
  const onSubmit = async (data: EventFormSchema) => {
    startTransition(async () => {
      const response = await updateEvent(event.id, data);

      if (response.success) {
        closeDialog();
        toast.success('Evento aggiornato!');
        startTransition(async () => router.refresh());
      } else {
        toast.error(response.message);
      }
    });
  };
  return (
    <section className='max-h-full overflow-y-auto'>
      <FormProvider {...methods}>
        <form
          className='flex flex-col gap-4 p-2'
          onSubmit={handleSubmit(onSubmit)}
          noValidate={true}
        >
          <div className='text-2xl font-bold mb-4'>Modifica evento</div>

          <EventForm
            artists={artists}
            venues={venues}
            moCoordinators={moCoordinators}
            event={event}
            mode="update"
            closeDialog={closeDialog}
          />

          <div className='flex justify-between'>
            <Button
              type='button'
              onClick={closeDialog}
              variant='ghost'
              className='text-destructive'
              disabled={isPending}
            >
              <X /> Annulla
            </Button>
            <Button
              type='submit'
              disabled={isPending}
            >
              {isPending ? 'Aggiornamento...' : 'Modifica'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
