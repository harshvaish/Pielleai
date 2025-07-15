'use client';

import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { VenueData } from '@/lib/types';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { format } from 'date-fns';
import {
  venueS3FormSchema,
  VenueS3FormSchema,
} from '@/lib/validation/venueFormSchema';
import { editVenueSocialData } from '@/lib/server-actions/venues/edit-artist-social-data';

export default function SocialDataForm({
  venueData,
  closeDialog,
}: {
  venueData: VenueData;
  closeDialog: () => void;
}) {
  const [openItem, setOpenItem] = useState<string>('tiktok');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const defaultValues = useMemo(
    () => ({
      tiktokUrl: venueData.tiktokUrl || '',
      tiktokUsername: venueData.tiktokUsername || '',
      tiktokFollowers: venueData.tiktokFollowers || undefined,
      tiktokCreatedAt: venueData.tiktokCreatedAt
        ? format(new Date(venueData.tiktokCreatedAt), 'yyyy-MM-dd')
        : undefined,

      facebookUrl: venueData.facebookUrl || '',
      facebookUsername: venueData.facebookUsername || '',
      facebookFollowers: venueData.facebookFollowers || undefined,
      facebookCreatedAt: venueData.facebookCreatedAt
        ? format(new Date(venueData.facebookCreatedAt), 'yyyy-MM-dd')
        : undefined,

      instagramUrl: venueData.instagramUrl || '',
      instagramUsername: venueData.instagramUsername || '',
      instagramFollowers: venueData.instagramFollowers || undefined,
      instagramCreatedAt: venueData.instagramCreatedAt
        ? format(new Date(venueData.instagramCreatedAt), 'yyyy-MM-dd')
        : undefined,

      xUrl: venueData.xUrl || '',
      xUsername: venueData.xUsername || '',
      xFollowers: venueData.xFollowers || undefined,
      xCreatedAt: venueData.xCreatedAt
        ? format(new Date(venueData.xCreatedAt), 'yyyy-MM-dd')
        : undefined,
    }),
    [venueData]
  );

  const methods = useForm({
    resolver: zodResolver(venueS3FormSchema),
    defaultValues: defaultValues,
  });

  const router = useRouter();

  const {
    register,
    control,
    formState: { isDirty, errors },
  } = methods;

  const onSubmit = async (data: VenueS3FormSchema) => {
    if (!isDirty) {
      toast.info('Nessun dato modificato.');
      return;
    }
    setIsSubmitting(true);

    const response = await editVenueSocialData({
      venueId: venueData.id,
      data: data,
    });

    if (response.success) {
      methods.reset(data); // new form status, isDirty to false
      toast.success('Scheda locale aggiornata!');
      closeDialog();
      router.refresh();
    } else {
      toast.error(response.message);
    }
    setIsSubmitting(false);
  };

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col gap-4'
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className='text-xl text-center font-bold'>Social</div>
        <Accordion
          type='single'
          collapsible
          value={openItem}
          onValueChange={setOpenItem}
          className='flex flex-col gap-4'
        >
          <AccordionItem
            value='tiktok'
            className={cn(
              'rounded-2xl overflow-hidden',
              openItem === 'tiktok' ? 'border' : 'border-none'
            )}
          >
            <AccordionTrigger className='text-lg font-medium bg-zinc-50 p-6'>
              TikTok
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 p-6'>
              <div className='flex flex-col'>
                <label
                  htmlFor='tiktokUrl'
                  className='block text-sm font-semibold mb-2'
                >
                  URL profilo
                </label>
                <Input
                  id='tiktokUrl'
                  {...register('tiktokUrl')}
                  placeholder='https://www.tiktok.com/...'
                  className={
                    errors.tiktokUrl
                      ? 'border-destructive text-destructive'
                      : ''
                  }
                />
                {errors.tiktokUrl && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.tiktokUrl.message as string}
                  </p>
                )}
              </div>
              <div className='flex flex-col'>
                <label
                  htmlFor='tiktokUsername'
                  className='block text-sm font-semibold mb-2'
                >
                  Nome profilo
                </label>
                <Input
                  id='tiktokUsername'
                  {...register('tiktokUsername')}
                  placeholder='Shiva'
                  className={
                    errors.tiktokUsername
                      ? 'border-destructive text-destructive'
                      : ''
                  }
                />
                {errors.tiktokUsername && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.tiktokUsername.message as string}
                  </p>
                )}
              </div>
              <div className='flex flex-col'>
                <label
                  htmlFor='tiktokFollowers'
                  className='block text-sm font-semibold mb-2'
                >
                  Numero di followers
                </label>
                <Input
                  id='tiktokFollowers'
                  {...register('tiktokFollowers', {
                    valueAsNumber: true,
                  })}
                  placeholder='1000'
                  type='number'
                  min={0}
                  step={1}
                  className={
                    errors.tiktokFollowers
                      ? 'border-destructive text-destructive'
                      : ''
                  }
                />
                {errors.tiktokFollowers && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.tiktokFollowers.message as string}
                  </p>
                )}
              </div>
              <div className='flex flex-col'>
                <label
                  htmlFor='tiktokCreatedAt'
                  className='block text-sm font-semibold mb-2'
                >
                  Data di creazione
                </label>
                <Controller
                  control={control}
                  name='tiktokCreatedAt'
                  render={({ field }) => (
                    <Input
                      id='tiktokCreatedAt'
                      className={cn(
                        'block w-full',
                        errors.tiktokCreatedAt &&
                          'border-destructive text-destructive'
                      )}
                      type='date'
                      {...field}
                      value={field.value as string | undefined}
                    />
                  )}
                />
                {errors.tiktokCreatedAt && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.tiktokCreatedAt.message as string}
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='facebook'
            className={cn(
              'rounded-2xl overflow-hidden',
              openItem === 'facebook' ? 'border' : 'border-none'
            )}
          >
            <AccordionTrigger className='text-lg font-medium bg-zinc-50 p-6'>
              Facebook
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 p-6'>
              <div className='flex flex-col'>
                <label
                  htmlFor='facebookUrl'
                  className='block text-sm font-semibold mb-2'
                >
                  URL profilo
                </label>
                <Input
                  id='facebookUrl'
                  {...register('facebookUrl')}
                  placeholder='https://www.facebook.com/...'
                  className={
                    errors.facebookUrl
                      ? 'border-destructive text-destructive'
                      : ''
                  }
                />
                {errors.facebookUrl && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.facebookUrl.message as string}
                  </p>
                )}
              </div>
              <div className='flex flex-col'>
                <label
                  htmlFor='facebookUsername'
                  className='block text-sm font-semibold mb-2'
                >
                  Nome profilo
                </label>
                <Input
                  id='facebookUsername'
                  {...register('facebookUsername')}
                  placeholder='Shiva'
                  className={
                    errors.facebookUsername
                      ? 'border-destructive text-destructive'
                      : ''
                  }
                />
                {errors.facebookUsername && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.facebookUsername.message as string}
                  </p>
                )}
              </div>
              <div className='flex flex-col'>
                <label
                  htmlFor='facebookFollowers'
                  className='block text-sm font-semibold mb-2'
                >
                  Numero di followers
                </label>
                <Input
                  id='facebookFollowers'
                  {...register('facebookFollowers')}
                  placeholder='1000'
                  type='number'
                  min={0}
                  step={1}
                  className={
                    errors.facebookFollowers
                      ? 'border-destructive text-destructive'
                      : ''
                  }
                />
                {errors.facebookFollowers && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.facebookFollowers.message as string}
                  </p>
                )}
              </div>
              <div className='flex flex-col'>
                <label
                  htmlFor='facebookCreatedAt'
                  className='block text-sm font-semibold mb-2'
                >
                  Data di creazione
                </label>
                <Controller
                  control={control}
                  name='facebookCreatedAt'
                  render={({ field }) => (
                    <Input
                      id='facebookCreatedAt'
                      className={cn(
                        'block w-full',
                        errors.facebookCreatedAt &&
                          'border-destructive text-destructive'
                      )}
                      type='date'
                      {...field}
                      value={field.value as string | undefined}
                    />
                  )}
                />
                {errors.facebookCreatedAt && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.facebookCreatedAt.message as string}
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='instagram'
            className={cn(
              'rounded-2xl overflow-hidden',
              openItem === 'instagram' ? 'border' : 'border-none'
            )}
          >
            <AccordionTrigger className='text-lg font-medium bg-zinc-50 p-6'>
              Instagram
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 p-6'>
              <div className='flex flex-col'>
                <label
                  htmlFor='instagramUrl'
                  className='block text-sm font-semibold mb-2'
                >
                  URL profilo
                </label>
                <Input
                  id='instagramUrl'
                  {...register('instagramUrl')}
                  placeholder='https://www.instagram.com/...'
                  className={
                    errors.instagramUrl
                      ? 'border-destructive text-destructive'
                      : ''
                  }
                />
                {errors.instagramUrl && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.instagramUrl.message as string}
                  </p>
                )}
              </div>
              <div className='flex flex-col'>
                <label
                  htmlFor='instagramUsername'
                  className='block text-sm font-semibold mb-2'
                >
                  Nome profilo
                </label>
                <Input
                  id='instagramUsername'
                  {...register('instagramUsername')}
                  placeholder='Shiva'
                  className={
                    errors.instagramUsername
                      ? 'border-destructive text-destructive'
                      : ''
                  }
                />
                {errors.instagramUsername && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.instagramUsername.message as string}
                  </p>
                )}
              </div>
              <div className='flex flex-col'>
                <label
                  htmlFor='instagramFollowers'
                  className='block text-sm font-semibold mb-2'
                >
                  Numero di followers
                </label>
                <Input
                  id='instagramFollowers'
                  {...register('instagramFollowers')}
                  placeholder='1000'
                  type='number'
                  min={0}
                  step={1}
                  className={
                    errors.instagramFollowers
                      ? 'border-destructive text-destructive'
                      : ''
                  }
                />
                {errors.instagramFollowers && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.instagramFollowers.message as string}
                  </p>
                )}
              </div>
              <div className='flex flex-col'>
                <label
                  htmlFor='instagramCreatedAt'
                  className='block text-sm font-semibold mb-2'
                >
                  Data di creazione
                </label>
                <Controller
                  control={control}
                  name='instagramCreatedAt'
                  render={({ field }) => (
                    <Input
                      id='instagramCreatedAt'
                      className={cn(
                        'block w-full',
                        errors.instagramCreatedAt &&
                          'border-destructive text-destructive'
                      )}
                      type='date'
                      {...field}
                      value={field.value as string | undefined}
                    />
                  )}
                />
                {errors.instagramCreatedAt && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.instagramCreatedAt.message as string}
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value='x'
            className={cn(
              'rounded-2xl overflow-hidden',
              openItem === 'x' ? 'border' : 'border-none'
            )}
          >
            <AccordionTrigger className='text-lg font-medium bg-zinc-50 p-6'>
              X
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 p-6'>
              <div className='flex flex-col'>
                <label
                  htmlFor='xUrl'
                  className='block text-sm font-semibold mb-2'
                >
                  URL profilo
                </label>
                <Input
                  id='xUrl'
                  {...register('xUrl')}
                  placeholder='https://www.x.com/...'
                  className={
                    errors.xUrl ? 'border-destructive text-destructive' : ''
                  }
                />
                {errors.xUrl && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.xUrl.message as string}
                  </p>
                )}
              </div>
              <div className='flex flex-col'>
                <label
                  htmlFor='xUsername'
                  className='block text-sm font-semibold mb-2'
                >
                  Nome profilo
                </label>
                <Input
                  id='xUsername'
                  {...register('xUsername')}
                  placeholder='Shiva'
                  className={
                    errors.xUsername
                      ? 'border-destructive text-destructive'
                      : ''
                  }
                />
                {errors.xUsername && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.xUsername.message as string}
                  </p>
                )}
              </div>
              <div className='flex flex-col'>
                <label
                  htmlFor='xFollowers'
                  className='block text-sm font-semibold mb-2'
                >
                  Numero di followers
                </label>
                <Input
                  id='xFollowers'
                  {...register('xFollowers')}
                  placeholder='1000'
                  type='number'
                  min={0}
                  step={1}
                  className={
                    errors.xFollowers
                      ? 'border-destructive text-destructive'
                      : ''
                  }
                />
                {errors.xFollowers && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.xFollowers.message as string}
                  </p>
                )}
              </div>
              <div className='flex flex-col'>
                <label
                  htmlFor='xCreatedAt'
                  className='block text-sm font-semibold mb-2'
                >
                  Data di creazione
                </label>
                <Controller
                  control={control}
                  name='xCreatedAt'
                  render={({ field }) => (
                    <Input
                      id='xCreatedAt'
                      className={cn(
                        'block w-full',
                        errors.xCreatedAt &&
                          'border-destructive text-destructive'
                      )}
                      type='date'
                      {...field}
                      value={field.value as string | undefined}
                    />
                  )}
                />
                {errors.xCreatedAt && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.xCreatedAt.message as string}
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className='flex justify-between mt-4'>
          <Button
            type='button'
            onClick={closeDialog}
            variant='ghost'
            className='text-destructive'
            disabled={isSubmitting}
          >
            <X size={16} /> Annulla
          </Button>

          <Button
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvataggio...' : 'Salva'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
