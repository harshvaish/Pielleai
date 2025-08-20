'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function StepThree() {
  const [openItem, setOpenItem] = useState<string>('tiktok');
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Accordion
        type='single'
        collapsible
        value={openItem}
        onValueChange={setOpenItem}
        className='flex flex-col gap-4'
      >
        <AccordionItem
          value='tiktok'
          className={cn('rounded-2xl overflow-hidden', openItem === 'tiktok' ? 'border' : 'border-none')}
        >
          <AccordionTrigger className='text-lg font-medium bg-zinc-50 p-6'>TikTok</AccordionTrigger>
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
                className={errors.tiktokUrl ? 'border-destructive text-destructive' : ''}
              />
              {errors.tiktokUrl && <p className='text-xs text-destructive mt-2'>{errors.tiktokUrl.message as string}</p>}
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
                className={errors.tiktokUsername ? 'border-destructive text-destructive' : ''}
              />
              {errors.tiktokUsername && <p className='text-xs text-destructive mt-2'>{errors.tiktokUsername.message as string}</p>}
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
                className={errors.tiktokFollowers ? 'border-destructive text-destructive' : ''}
              />
              {errors.tiktokFollowers && <p className='text-xs text-destructive mt-2'>{errors.tiktokFollowers.message as string}</p>}
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
                    className={cn('block w-full', errors.tiktokCreatedAt && 'border-destructive text-destructive')}
                    type='date'
                    {...field}
                  />
                )}
              />
              {errors.tiktokCreatedAt && <p className='text-xs text-destructive mt-2'>{errors.tiktokCreatedAt.message as string}</p>}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value='facebook'
          className={cn('rounded-2xl overflow-hidden', openItem === 'facebook' ? 'border' : 'border-none')}
        >
          <AccordionTrigger className='text-lg font-medium bg-zinc-50 p-6'>Facebook</AccordionTrigger>
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
                className={errors.facebookUrl ? 'border-destructive text-destructive' : ''}
              />
              {errors.facebookUrl && <p className='text-xs text-destructive mt-2'>{errors.facebookUrl.message as string}</p>}
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
                className={errors.facebookUsername ? 'border-destructive text-destructive' : ''}
              />
              {errors.facebookUsername && <p className='text-xs text-destructive mt-2'>{errors.facebookUsername.message as string}</p>}
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
                className={errors.facebookFollowers ? 'border-destructive text-destructive' : ''}
              />
              {errors.facebookFollowers && <p className='text-xs text-destructive mt-2'>{errors.facebookFollowers.message as string}</p>}
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
                    className={cn('block w-full', errors.facebookCreatedAt && 'border-destructive text-destructive')}
                    type='date'
                    {...field}
                  />
                )}
              />
              {errors.facebookCreatedAt && <p className='text-xs text-destructive mt-2'>{errors.facebookCreatedAt.message as string}</p>}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value='instagram'
          className={cn('rounded-2xl overflow-hidden', openItem === 'instagram' ? 'border' : 'border-none')}
        >
          <AccordionTrigger className='text-lg font-medium bg-zinc-50 p-6'>Instagram</AccordionTrigger>
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
                className={errors.instagramUrl ? 'border-destructive text-destructive' : ''}
              />
              {errors.instagramUrl && <p className='text-xs text-destructive mt-2'>{errors.instagramUrl.message as string}</p>}
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
                className={errors.instagramUsername ? 'border-destructive text-destructive' : ''}
              />
              {errors.instagramUsername && <p className='text-xs text-destructive mt-2'>{errors.instagramUsername.message as string}</p>}
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
                className={errors.instagramFollowers ? 'border-destructive text-destructive' : ''}
              />
              {errors.instagramFollowers && <p className='text-xs text-destructive mt-2'>{errors.instagramFollowers.message as string}</p>}
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
                    className={cn('block w-full', errors.instagramCreatedAt && 'border-destructive text-destructive')}
                    type='date'
                    {...field}
                  />
                )}
              />
              {errors.instagramCreatedAt && <p className='text-xs text-destructive mt-2'>{errors.instagramCreatedAt.message as string}</p>}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value='x'
          className={cn('rounded-2xl overflow-hidden', openItem === 'x' ? 'border' : 'border-none')}
        >
          <AccordionTrigger className='text-lg font-medium bg-zinc-50 p-6'>X</AccordionTrigger>
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
                className={errors.xUrl ? 'border-destructive text-destructive' : ''}
              />
              {errors.xUrl && <p className='text-xs text-destructive mt-2'>{errors.xUrl.message as string}</p>}
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
                className={errors.xUsername ? 'border-destructive text-destructive' : ''}
              />
              {errors.xUsername && <p className='text-xs text-destructive mt-2'>{errors.xUsername.message as string}</p>}
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
                className={errors.xFollowers ? 'border-destructive text-destructive' : ''}
              />
              {errors.xFollowers && <p className='text-xs text-destructive mt-2'>{errors.xFollowers.message as string}</p>}
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
                    className={cn('block w-full', errors.xCreatedAt && 'border-destructive text-destructive')}
                    type='date'
                    {...field}
                  />
                )}
              />
              {errors.xCreatedAt && <p className='text-xs text-destructive mt-2'>{errors.xCreatedAt.message as string}</p>}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
