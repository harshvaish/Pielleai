'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { ArtistSelectData, UserRole, VenueSelectData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { eventRequestFormSchema, EventRequestFormSchema } from '@/lib/validation/event-form-schema';
import EventRequestForm from '../form/EventRequestForm';
import { createEventRequest } from '@/lib/server-actions/events/create-event-request';
import { useState } from 'react';

type CreateEventFormProps = {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  userRole: UserRole;
  closeDialog?: () => void;
};

export default function CreateEventRequestForm({
  artists,
  venues,
  userRole,
  closeDialog,
}: CreateEventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    resolver: zodResolver(eventRequestFormSchema),
    defaultValues: {
      artistId: undefined,
      availability: undefined,
      venueId: undefined,
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: EventRequestFormSchema) => {
    setIsSubmitting(true);
    try {
      const response = await createEventRequest(data);

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
          className='flex flex-col gap-4 p-2'
          onSubmit={handleSubmit(onSubmit)}
          noValidate={true}
        >
          <EventRequestForm
            artists={artists}
            venues={venues}
            userRole={userRole}
          />

          <div className='flex justify-between'>
            <Button
              type='button'
              onClick={handleCancel}
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
