'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { ArtistSelectData, VenueSelectData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { eventRequestFormSchema, EventRequestFormSchema } from '@/lib/validation/event-form-schema';
import EventRequestForm from '../form/EventRequestForm';
import { createEventRequest } from '@/lib/server-actions/events/create-event-request';

type CreateEventFormProps = {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  closeDialog: () => void;
};

export default function CreateEventRequestForm({
  artists,
  venues,
  closeDialog,
}: CreateEventFormProps) {
  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(eventRequestFormSchema),
    defaultValues: {
      artistId: undefined,
      artistManagerProfileId: undefined,

      availability: undefined,

      venueId: undefined,
      tourManagerEmail: '',
      administrationEmail: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: EventRequestFormSchema) => {
    const response = await createEventRequest(data);

    if (response.success) {
      toast.success('Evento creato!');
      router.refresh();
      closeDialog();
    } else {
      toast.error(response.message);
    }
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

          <EventRequestForm
            artists={artists}
            venues={venues}
          />

          <div className='flex justify-between'>
            <Button
              type='button'
              onClick={closeDialog}
              variant='ghost'
              className='text-destructive'
              disabled={isSubmitting}
            >
              <X /> Annulla
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creazione evento...' : 'Crea evento'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
