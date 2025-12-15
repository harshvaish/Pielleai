'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { ArtistSelectData, MoCoordinator, VenueSelectData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { EventFormSchema, eventFormSchema } from '@/lib/validation/event-form-schema';
import { createEvent } from '@/lib/server-actions/events/create-event';
import EventForm from '../form/EventForm';
import { useTransition } from 'react';

type CreateEventFormProps = {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
  closeDialog: () => void;
};

export default function CreateEventForm({
  artists,
  venues,
  moCoordinators,
  closeDialog,
}: CreateEventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const methods = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      artistId: undefined,
      status: 'proposed',
      availability: undefined,
      venueId: undefined,

      artistManagerProfileId: undefined,
      tourManagerEmail: '',
      payrollConsultantEmail: '',
      notes: [],

      moCost: undefined,
      venueManagerCost: undefined,
      depositCost: undefined,
      depositInvoiceNumber: '',
      bookingPercentage: undefined,
      moArtistAdvancedExpenses: undefined,
      artistNetCost: undefined,
      artistUpfrontCost: undefined,

      hotel: '',
      restaurant: '',
      eveningContact: '',
      moCoordinatorId: undefined,
      totalCost: undefined,
      transportationsCost: undefined,
      cashBalanceCost: undefined,
      soundCheckStart: '',
      soundCheckEnd: '',

      tecnicalRiderDocument: undefined,

      contractSigning: false,
      depositInvoiceIssuing: false,
      depositReceiptVerification: false,
      techSheetSubmission: false,
      artistEngagement: false,
      professionalsEngagement: false,
      accompanyingPersonsEngagement: false,

      performance: false,

      postDateFeedback: false,
      bordereau: false,
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: EventFormSchema) => {
    startTransition(async () => {
      const response = await createEvent(data);

      if (response.success) {
        closeDialog();
        toast.success('Evento creato!');
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
          <div className='text-2xl font-bold mb-4'>Crea evento</div>

          <EventForm
            artists={artists}
            venues={venues}
            moCoordinators={moCoordinators}
            mode ="create"
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
              {isPending ? 'Creazione evento...' : 'Crea evento'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
