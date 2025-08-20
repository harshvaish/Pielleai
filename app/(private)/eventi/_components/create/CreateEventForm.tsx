'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { ArtistSelectData, MoCoordinator, VenueSelectData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { EventFormSchema, eventFormSchema } from '@/lib/validation/eventFormSchema';
import { useState } from 'react';
import { createEvent } from '@/lib/server-actions/events/create-event';
import EventForm from '../form/EventForm';

type CreateEventFormProps = {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
  closeDialog: () => void;
};

export default function CreateEventForm({ artists, venues, moCoordinators, closeDialog }: CreateEventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const methods = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      artistId: undefined,
      status: 'proposed',
      availability: undefined,
      venueId: undefined,

      artistManagerProfileId: undefined,
      tourManagerEmail: '',
      administrationEmail: '',
      payrollConsultantEmail: '',
      notes: [],

      moCost: undefined,
      venueManagerCost: undefined,
      depositCost: undefined,
      depositInvoiceNumber: '',
      expenseReimbursement: undefined,
      bookingPercentage: undefined,
      supplierCost: undefined,
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
    setLoading(true);
    const response = await createEvent(data);

    if (response.success) {
      toast.success('Evento creato!');
      router.refresh();
      closeDialog();
    } else {
      toast.error(response.message);
    }

    setLoading(false);
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
              disabled={loading}
            >
              <X /> Annulla
            </Button>
            <Button
              type='submit'
              disabled={loading}
            >
              {loading ? 'Creazione evento...' : 'Crea evento'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
