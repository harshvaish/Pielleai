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

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const isBlacklistBlocked = errors.venueId?.type === 'blacklist';

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
    <section className={closeDialog ? 'min-h-0 max-h-full overflow-y-auto' : undefined}>
      <FormProvider {...methods}>
        <form
          className='flex flex-col gap-2 p-2'
          onSubmit={handleSubmit(onSubmit)}
          noValidate={true}
        >
          <div className='flex items-center justify-between gap-4'>
            <h1 className='text-2xl font-bold'>Crea evento</h1>
            <div className='flex items-center gap-2'>
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
                disabled={isSubmitting || isBlacklistBlocked}
              >
                {isSubmitting ? 'Creazione evento...' : 'Crea evento'}
              </Button>
            </div>
          </div>

          <section className='bg-white p-6 rounded-2xl'>
            <EventRequestForm
              artists={artists}
              venues={venues}
              userRole={userRole}
            />
          </section>
        </form>
      </FormProvider>
    </section>
  );
}
