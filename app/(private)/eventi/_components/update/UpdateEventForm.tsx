'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { ArtistSelectData, Event, MoCoordinator, VenueSelectData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { EventFormSchema, eventFormSchema } from '@/lib/validation/eventFormSchema';
import { useState } from 'react';
import { updateEvent } from '@/lib/server-actions/events/update-event';
import EventForm from '../form/EventForm';

type UpdateEventFormProps = {
  event: Event;
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
  closeDialog: () => void;
};

export default function UpdateEventForm({ event, artists, venues, moCoordinators, closeDialog }: UpdateEventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const methods = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      artistId: event.artist.id,
      status: event.status,
      artistManagerProfileId: event.artistManager?.profileId || undefined,
      availability: {
        id: event.availability.id,
        startDate: event.availability.startDate,
        endDate: event.availability.endDate,
      },
      venueId: event.venue.id,

      administrationEmail: event.administrationEmail || '',
      payrollConsultantEmail: event.payrollConsultantEmail || '',
      notes: event.notes.flatMap((note) => note.content) || [],

      moCost: parseFloat(event.moCost || '') || undefined,
      venueManagerCost: parseFloat(event.venueManagerCost || '') || undefined,
      depositCost: parseFloat(event.depositCost || '') || undefined,
      depositInvoiceNumber: event.depositInvoiceNumber || undefined,
      expenseReimbursement: parseFloat(event.expenseReimbursement || '') || undefined,
      bookingPercentage: parseFloat(event.bookingPercentage || '') || undefined,
      supplierCost: parseFloat(event.supplierCost || '') || undefined,
      moArtistAdvancedExpenses: parseFloat(event.moArtistAdvancedExpenses || '') || undefined,
      artistNetCost: parseFloat(event.artistNetCost || '') || undefined,
      artistUpfrontCost: parseFloat(event.artistUpfrontCost || '') || undefined,

      hotel: event.hotel || '',
      restaurant: event.restaurant || '',
      eveningContact: event.eveningContact || '',
      moCoordinatorId: event.moCoordinator?.id || undefined,
      totalCost: parseFloat(event.totalCost || '') || undefined,
      transportationsCost: parseFloat(event.transportationsCost || '') || undefined,
      cashBalanceCost: parseFloat(event.cashBalanceCost || '') || undefined,
      soundCheckStart: event.soundCheckStart || '',
      soundCheckEnd: event.soundCheckEnd || '',

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
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: EventFormSchema) => {
    setIsLoading(true);
    const response = await updateEvent(event.id, data);

    if (response.success) {
      toast.success('Evento aggiornato!');
      router.refresh();
      closeDialog();
    } else {
      toast.error(response.message);
    }

    setIsLoading(false);
  };

  return (
    <section className='max-h-full overflow-y-auto'>
      <FormProvider {...methods}>
        <form
          className='flex flex-col gap-4'
          onSubmit={handleSubmit(onSubmit)}
          noValidate={true}
        >
          <div className='text-2xl font-bold mb-4'>Crea evento</div>

          <EventForm
            artists={artists}
            venues={venues}
            moCoordinators={moCoordinators}
          />

          <div className='flex justify-between'>
            <Button
              type='button'
              onClick={closeDialog}
              variant='ghost'
              className='text-destructive'
              disabled={isLoading}
            >
              <X /> Annulla
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? 'Aggiornamento...' : 'Modifica'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
