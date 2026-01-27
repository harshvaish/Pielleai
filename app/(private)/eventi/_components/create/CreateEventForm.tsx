'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { ArtistSelectData, MoCoordinator, ProfessionalSelectData, UserRole, VenueSelectData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { EventFormSchema, eventFormSchema } from '@/lib/validation/event-form-schema';
import { createEvent } from '@/lib/server-actions/events/create-event';
import EventForm from '../form/EventForm';
import { useState } from 'react';

type CreateEventFormProps = {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
  professionals: ProfessionalSelectData[];
  userRole: UserRole;
  closeDialog?: () => void;
};

export default function CreateEventForm({
  artists,
  venues,
  moCoordinators,
  professionals,
  userRole,
  closeDialog,
}: CreateEventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      artistId: undefined,
      status: 'proposed',
      availability: undefined,
      venueId: undefined,

      artistManagerProfileId: undefined,
      tourManagerEmail: '',
      payrollConsultantEmail: 'riccardo.gulisano@gmail.com',
      notes: [],
      professionalIds: [],

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
      paymentDate: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: EventFormSchema) => {
    setIsSubmitting(true);
    try {
      const response = await createEvent(data);

      if (response.success) {
        toast.success('Evento creato!');
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
            <h1 className='text-2xl font-bold'>Crea evento</h1>
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
                {isSubmitting ? 'Creazione evento...' : 'Crea evento'}
              </Button>
            </div>
          </div>

          <section className='bg-white p-6 rounded-2xl'>
            <EventForm
              artists={artists}
              venues={venues}
              moCoordinators={moCoordinators}
              professionals={professionals}
              userRole={userRole}
              mode="create"
            />
          </section>
        </form>
      </FormProvider>
    </section>
  );
}
