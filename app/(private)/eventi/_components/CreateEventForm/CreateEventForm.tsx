'use client';

import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { ArtistSelectData, MoCoordinator, VenueSelectData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  EventFormSchema,
  eventFormSchema,
} from '@/lib/validation/eventFormSchema';
import SearchArtistSelect from './SearchArtistSelect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { EVENTS_STATUS } from '@/lib/constants';
import EventStatusBadge from '../EventStatusBadge';
import ArtistManagerSelect from './ArtistManagerSelect';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import VenueSelect from './VenueSelect';
import { Input } from '@/components/ui/input';
import EventNotesInput from './EventNotesInput';
import ArtistAvailabilitySelect from './ArtistAvailabilitySelect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PdfUploadInput from '@/app/(private)/eventi/_components/CreateEventForm/PdfUploadInput';
import { Checkbox } from '@/components/ui/checkbox';
import { createEvent } from '@/lib/server-actions/events/create-event';

export default function CreateEventForm({
  artists,
  venues,
  moCoordinators,
  closeDialog,
}: {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
  closeDialog: () => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const methods = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      artistId: undefined,
      status: 'proposed',
      artistManagerProfileId: undefined,
      availability: undefined,
      venueId: undefined,

      administrationEmail: '',
      payrollConsultantEmail: '',
      notes: [],

      moCost: undefined,
      venueManagerCost: undefined,
      depositCost: undefined,
      depositInvoiceNumber: undefined,
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
  const router = useRouter();

  const onSubmit = async (data: EventFormSchema) => {
    setIsLoading(true);
    const response = await createEvent(data);

    if (response.success) {
      toast.success('Evento creato!');
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
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate={true}
        >
          <div className='text-2xl font-bold mb-4'>Crea evento</div>

          <div className='flex justify-between items-center gap-2'>
            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Artista</div>
              <Controller
                control={methods.control}
                name='artistId'
                render={({ field }) => (
                  <SearchArtistSelect
                    artists={artists}
                    value={field.value}
                    setValue={field.onChange}
                    hasError={!!methods.formState.errors.artistId}
                  />
                )}
              />
              {methods.formState.errors.artistId && (
                <p className='text-xs text-destructive mt-2'>
                  {methods.formState.errors.artistId.message as string}
                </p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Stato</div>
              <Controller
                control={methods.control}
                name='status'
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className={cn(
                        'min-w-40',
                        methods.formState.errors.status &&
                          'border-destructive text-destructive'
                      )}
                      size='sm'
                    >
                      <EventStatusBadge status={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENTS_STATUS.map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                        >
                          <EventStatusBadge status={status} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {methods.formState.errors.status && (
                <p className='text-xs text-destructive mt-2'>
                  {methods.formState.errors.status.message as string}
                </p>
              )}
            </div>
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Locale</div>
            <VenueSelect venues={venues} />
            {methods.formState.errors.venueId && (
              <p className='text-xs text-destructive mt-2'>
                {methods.formState.errors.venueId.message as string}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Data</div>
            <ArtistAvailabilitySelect />
            {methods.formState.errors.availability && (
              <p className='text-xs text-destructive mt-2'>
                {methods.formState.errors.availability.message as string}
              </p>
            )}
          </div>

          <Tabs
            defaultValue='a'
            className='bg-zinc-50 p-1 rounded-2xl border'
          >
            <TabsList className='w-full justify-start gap-4 bg-white p-1 rounded-xl overflow-x-auto'>
              <TabsTrigger value='a'>Contatti</TabsTrigger>
              <TabsTrigger value='b'>Financial</TabsTrigger>
              <TabsTrigger value='c'>Scheda tecnica</TabsTrigger>
              <TabsTrigger value='d'>Attività</TabsTrigger>
            </TabsList>

            <TabsContent
              value='a'
              className='flex flex-col gap-4 p-2'
            >
              <div className='flex flex-col'>
                <div className='text-sm font-semibold mb-2'>
                  Manager artista
                </div>
                <ArtistManagerSelect />
                {methods.formState.errors.artistManagerProfileId && (
                  <p className='text-xs text-destructive mt-2'>
                    {
                      methods.formState.errors.artistManagerProfileId
                        .message as string
                    }
                  </p>
                )}
              </div>

              <div className='flex flex-col'>
                <div className='text-sm font-semibold mb-2'>
                  Amministrazione
                </div>
                <Input
                  type='email'
                  {...methods.register('administrationEmail')}
                  placeholder='amministrazione@eaglebooking.it'
                  className={
                    methods.formState.errors.administrationEmail
                      ? 'border-destructive text-destructive'
                      : ''
                  }
                />
                {methods.formState.errors.administrationEmail && (
                  <p className='text-xs text-destructive mt-2'>
                    {
                      methods.formState.errors.administrationEmail
                        .message as string
                    }
                  </p>
                )}
              </div>

              <div className='flex flex-col'>
                <div className='text-sm font-semibold mb-2'>
                  Consulente paghe e contributi
                </div>
                <Input
                  type='email'
                  {...methods.register('payrollConsultantEmail')}
                  placeholder='consulente@eaglebooking.it'
                  className={
                    methods.formState.errors.payrollConsultantEmail
                      ? 'border-destructive text-destructive'
                      : ''
                  }
                />
                {methods.formState.errors.payrollConsultantEmail && (
                  <p className='text-xs text-destructive mt-2'>
                    {
                      methods.formState.errors.payrollConsultantEmail
                        .message as string
                    }
                  </p>
                )}
              </div>

              <Separator className='bg-zinc-200' />

              <EventNotesInput />
            </TabsContent>

            <TabsContent
              value='b'
              className='flex flex-col gap-4 p-2'
            >
              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Cachet lordo</div>
                  <Input
                    {...methods.register('moCost', {
                      valueAsNumber: true,
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={
                      methods.formState.errors.moCost
                        ? 'border-destructive text-destructive'
                        : ''
                    }
                  />
                  {methods.formState.errors.moCost && (
                    <p className='text-xs text-destructive mt-2'>
                      {methods.formState.errors.moCost.message as string}
                    </p>
                  )}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Fee promoter</div>
                  <Input
                    {...methods.register('venueManagerCost', {
                      valueAsNumber: true,
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={
                      methods.formState.errors.venueManagerCost
                        ? 'border-destructive text-destructive'
                        : ''
                    }
                  />
                  {methods.formState.errors.venueManagerCost && (
                    <p className='text-xs text-destructive mt-2'>
                      {
                        methods.formState.errors.venueManagerCost
                          .message as string
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Acconto</div>
                  <Input
                    {...methods.register('depositCost', {
                      valueAsNumber: true,
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={
                      methods.formState.errors.depositCost
                        ? 'border-destructive text-destructive'
                        : ''
                    }
                  />
                  {methods.formState.errors.depositCost && (
                    <p className='text-xs text-destructive mt-2'>
                      {methods.formState.errors.depositCost.message as string}
                    </p>
                  )}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>
                    Numero fattura acconto
                  </div>
                  <Input
                    {...methods.register('depositInvoiceNumber')}
                    placeholder='123456789'
                    className={
                      methods.formState.errors.depositInvoiceNumber
                        ? 'border-destructive text-destructive'
                        : ''
                    }
                  />
                  {methods.formState.errors.depositInvoiceNumber && (
                    <p className='text-xs text-destructive mt-2'>
                      {
                        methods.formState.errors.depositInvoiceNumber
                          .message as string
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>
                    Rimborso spese
                  </div>
                  <Input
                    {...methods.register('expenseReimbursement', {
                      valueAsNumber: true,
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={
                      methods.formState.errors.expenseReimbursement
                        ? 'border-destructive text-destructive'
                        : ''
                    }
                  />
                  {methods.formState.errors.expenseReimbursement && (
                    <p className='text-xs text-destructive mt-2'>
                      {
                        methods.formState.errors.expenseReimbursement
                          .message as string
                      }
                    </p>
                  )}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>
                    Percentuale booking
                  </div>
                  <Input
                    {...methods.register('bookingPercentage', {
                      valueAsNumber: true,
                    })}
                    placeholder='30%'
                    type='number'
                    min={0}
                    step={0.01}
                    className={
                      methods.formState.errors.bookingPercentage
                        ? 'border-destructive text-destructive'
                        : ''
                    }
                  />
                  {methods.formState.errors.bookingPercentage && (
                    <p className='text-xs text-destructive mt-2'>
                      {
                        methods.formState.errors.bookingPercentage
                          .message as string
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Fornitore</div>
                  <Input
                    {...methods.register('supplierCost', {
                      valueAsNumber: true,
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={
                      methods.formState.errors.supplierCost
                        ? 'border-destructive text-destructive'
                        : ''
                    }
                  />
                  {methods.formState.errors.supplierCost && (
                    <p className='text-xs text-destructive mt-2'>
                      {methods.formState.errors.supplierCost.message as string}
                    </p>
                  )}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>
                    Spese anticipate da Milano Ovest per Artista
                  </div>
                  <Input
                    {...methods.register('moArtistAdvancedExpenses', {
                      valueAsNumber: true,
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={
                      methods.formState.errors.moArtistAdvancedExpenses
                        ? 'border-destructive text-destructive'
                        : ''
                    }
                  />
                  {methods.formState.errors.moArtistAdvancedExpenses && (
                    <p className='text-xs text-destructive mt-2'>
                      {
                        methods.formState.errors.moArtistAdvancedExpenses
                          .message as string
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>
                    Netto artista
                  </div>
                  <Input
                    {...methods.register('artistNetCost', {
                      valueAsNumber: true,
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={
                      methods.formState.errors.artistNetCost
                        ? 'border-destructive text-destructive'
                        : ''
                    }
                  />
                  {methods.formState.errors.artistNetCost && (
                    <p className='text-xs text-destructive mt-2'>
                      {methods.formState.errors.artistNetCost.message as string}
                    </p>
                  )}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>
                    Anticipo artista
                  </div>
                  <Input
                    {...methods.register('artistUpfrontCost', {
                      valueAsNumber: true,
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={
                      methods.formState.errors.artistUpfrontCost
                        ? 'border-destructive text-destructive'
                        : ''
                    }
                  />
                  {methods.formState.errors.artistUpfrontCost && (
                    <p className='text-xs text-destructive mt-2'>
                      {
                        methods.formState.errors.artistUpfrontCost
                          .message as string
                      }
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value='c'
              className='flex flex-col gap-4 p-2'
            >
              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Hotel</div>
                  <Input
                    {...methods.register('hotel')}
                    placeholder='Milano Ovest Hotel'
                    className={
                      methods.formState.errors.hotel
                        ? 'border-destructive text-destructive'
                        : ''
                    }
                  />
                  {methods.formState.errors.hotel && (
                    <p className='text-xs text-destructive mt-2'>
                      {methods.formState.errors.hotel.message as string}
                    </p>
                  )}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Ristorante</div>
                  <Input
                    {...methods.register('restaurant')}
                    placeholder='MoPizza'
                    className={
                      methods.formState.errors.restaurant
                        ? 'border-destructive text-destructive'
                        : ''
                    }
                  />
                  {methods.formState.errors.restaurant && (
                    <p className='text-xs text-destructive mt-2'>
                      {methods.formState.errors.restaurant.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>
                    Referente serata
                  </div>
                  <Input
                    {...methods.register('eveningContact')}
                    placeholder='Mario Rossi'
                    className={
                      methods.formState.errors.eveningContact
                        ? 'border-destructive text-destructive'
                        : ''
                    }
                  />
                  {methods.formState.errors.eveningContact && (
                    <p className='text-xs text-destructive mt-2'>
                      {
                        methods.formState.errors.eveningContact
                          .message as string
                      }
                    </p>
                  )}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>
                    Coordinatore Milano Ovest
                  </div>

                  <Controller
                    control={methods.control}
                    name='moCoordinatorId'
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(v) => field.onChange(parseInt(v))}
                      >
                        <SelectTrigger
                          id='moCoordinatorId'
                          className={cn(
                            'w-full',
                            methods.formState.errors.moCoordinatorId &&
                              'border-destructive text-destructive'
                          )}
                          size='sm'
                        >
                          {moCoordinators.find((mc) => mc.id == field.value)
                            ?.name || 'Seleziona coordinatore'}
                        </SelectTrigger>
                        <SelectContent>
                          {moCoordinators.map((mc) => (
                            <SelectItem
                              key={mc.id}
                              value={mc.id.toString()}
                            >
                              {mc.name} {mc.surname}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {methods.formState.errors.moCoordinatorId && (
                    <p className='text-xs text-destructive mt-2'>
                      {
                        methods.formState.errors.moCoordinatorId
                          .message as string
                      }
                    </p>
                  )}
                </div>
              </div>

              <Separator className='bg-zinc-200' />

              <div className='grid grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>
                    Incasso totale
                  </div>
                  <Input
                    {...methods.register('totalCost', {
                      valueAsNumber: true,
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={
                      methods.formState.errors.totalCost
                        ? 'border-destructive text-destructive'
                        : ''
                    }
                  />
                  {methods.formState.errors.totalCost && (
                    <p className='text-xs text-destructive mt-2'>
                      {methods.formState.errors.totalCost.message as string}
                    </p>
                  )}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>
                    Saldo trasporti
                  </div>
                  <Input
                    {...methods.register('transportationsCost', {
                      valueAsNumber: true,
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={
                      methods.formState.errors.transportationsCost
                        ? 'border-destructive text-destructive'
                        : ''
                    }
                  />
                  {methods.formState.errors.transportationsCost && (
                    <p className='text-xs text-destructive mt-2'>
                      {
                        methods.formState.errors.transportationsCost
                          .message as string
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className='flex flex-col'>
                <div className='text-sm font-semibold mb-2'>Saldo cassa</div>
                <Input
                  {...methods.register('cashBalanceCost', {
                    valueAsNumber: true,
                  })}
                  placeholder='1000'
                  type='number'
                  min={0}
                  step={0.01}
                  className={
                    methods.formState.errors.cashBalanceCost
                      ? 'border-destructive text-destructive'
                      : ''
                  }
                />
                {methods.formState.errors.cashBalanceCost && (
                  <p className='text-xs text-destructive mt-2'>
                    {methods.formState.errors.cashBalanceCost.message as string}
                  </p>
                )}
              </div>

              <Separator className='bg-zinc-200' />

              <div className='grid grid-cols-2 gap-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex flex-col'>
                    <div className='text-sm font-semibold mb-2'>
                      Inizio sound-check
                    </div>
                    <Input
                      {...methods.register('soundCheckStart')}
                      type='time'
                      className={cn(
                        'appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none',
                        methods.formState.errors.soundCheckStart
                          ? 'border-destructive text-destructive'
                          : ''
                      )}
                    />
                    {methods.formState.errors.soundCheckStart && (
                      <p className='text-xs text-destructive mt-2'>
                        {
                          methods.formState.errors.soundCheckStart
                            .message as string
                        }
                      </p>
                    )}
                  </div>
                  <div className='flex flex-col'>
                    <div className='text-sm font-semibold mb-2'>
                      Fine sound-check
                    </div>
                    <Input
                      {...methods.register('soundCheckEnd')}
                      type='time'
                      className={cn(
                        'appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none',
                        methods.formState.errors.soundCheckEnd
                          ? 'border-destructive text-destructive'
                          : ''
                      )}
                    />
                    {methods.formState.errors.soundCheckEnd && (
                      <p className='text-xs text-destructive mt-2'>
                        {
                          methods.formState.errors.soundCheckEnd
                            .message as string
                        }
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>
                    Rider tecnico
                  </div>
                  <PdfUploadInput />
                  {methods.formState.errors.tecnicalRiderDocument && (
                    <p className='text-xs text-destructive mt-2'>
                      {
                        methods.formState.errors.tecnicalRiderDocument
                          .message as string
                      }
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value='d'
              className='flex flex-col gap-4 p-2'
            >
              <div className='text-sm font-semibold'>Trattativa pre-evento</div>

              <div className='flex flex-col'>
                <Controller
                  control={methods.control}
                  name='contractSigning'
                  render={({ field }) => (
                    <label
                      htmlFor='contractSigning'
                      className={cn(
                        'flex items-center gap-2 text-sm cursor-pointer',
                        field.value && 'text-zinc-500',
                        methods.formState.errors.contractSigning &&
                          'text-destructive'
                      )}
                    >
                      <Checkbox
                        id='contractSigning'
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      Firma del contratto
                    </label>
                  )}
                />
                {methods.formState.errors.contractSigning && (
                  <p className='text-xs text-destructive'>
                    {methods.formState.errors.contractSigning.message as string}
                  </p>
                )}
              </div>

              <div className='flex flex-col'>
                <Controller
                  control={methods.control}
                  name='depositInvoiceIssuing'
                  render={({ field }) => (
                    <label
                      htmlFor='depositInvoiceIssuing'
                      className={cn(
                        'flex items-center gap-2 text-sm cursor-pointer',
                        field.value && 'text-zinc-500',
                        methods.formState.errors.depositInvoiceIssuing &&
                          'text-destructive'
                      )}
                    >
                      <Checkbox
                        id='depositInvoiceIssuing'
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      Emissione fattura acconto
                    </label>
                  )}
                />
                {methods.formState.errors.depositInvoiceIssuing && (
                  <p className='text-xs text-destructive'>
                    {
                      methods.formState.errors.depositInvoiceIssuing
                        .message as string
                    }
                  </p>
                )}
              </div>

              <div className='flex flex-col'>
                <Controller
                  control={methods.control}
                  name='depositReceiptVerification'
                  render={({ field }) => (
                    <label
                      htmlFor='depositReceiptVerification'
                      className={cn(
                        'flex items-center gap-2 text-sm cursor-pointer',
                        field.value && 'text-zinc-500',
                        methods.formState.errors.depositReceiptVerification &&
                          'text-destructive'
                      )}
                    >
                      <Checkbox
                        id='depositReceiptVerification'
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      Verifica ricezione acconto
                    </label>
                  )}
                />
                {methods.formState.errors.depositReceiptVerification && (
                  <p className='text-xs text-destructive'>
                    {
                      methods.formState.errors.depositReceiptVerification
                        .message as string
                    }
                  </p>
                )}
              </div>

              <div className='flex flex-col'>
                <Controller
                  control={methods.control}
                  name='techSheetSubmission'
                  render={({ field }) => (
                    <label
                      htmlFor='techSheetSubmission'
                      className={cn(
                        'flex items-center gap-2 text-sm cursor-pointer',
                        field.value && 'text-zinc-500',
                        methods.formState.errors.techSheetSubmission &&
                          'text-destructive'
                      )}
                    >
                      <Checkbox
                        id='techSheetSubmission'
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      Recupero e invio scheda tecnica
                    </label>
                  )}
                />
                {methods.formState.errors.techSheetSubmission && (
                  <p className='text-xs text-destructive'>
                    {
                      methods.formState.errors.techSheetSubmission
                        .message as string
                    }
                  </p>
                )}
              </div>

              <div className='flex flex-col'>
                <Controller
                  control={methods.control}
                  name='artistEngagement'
                  render={({ field }) => (
                    <label
                      htmlFor='artistEngagement'
                      className={cn(
                        'flex items-center gap-2 text-sm cursor-pointer',
                        field.value && 'text-zinc-500',
                        methods.formState.errors.artistEngagement &&
                          'text-destructive'
                      )}
                    >
                      <Checkbox
                        id='artistEngagement'
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      Incarico artista
                    </label>
                  )}
                />
                {methods.formState.errors.artistEngagement && (
                  <p className='text-xs text-destructive'>
                    {
                      methods.formState.errors.artistEngagement
                        .message as string
                    }
                  </p>
                )}
              </div>

              <div className='flex flex-col'>
                <Controller
                  control={methods.control}
                  name='professionalsEngagement'
                  render={({ field }) => (
                    <label
                      htmlFor='professionalsEngagement'
                      className={cn(
                        'flex items-center gap-2 text-sm cursor-pointer',
                        field.value && 'text-zinc-500',
                        methods.formState.errors.professionalsEngagement &&
                          'text-destructive'
                      )}
                    >
                      <Checkbox
                        id='professionalsEngagement'
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      Incarico professionisti
                    </label>
                  )}
                />
                {methods.formState.errors.professionalsEngagement && (
                  <p className='text-xs text-destructive'>
                    {
                      methods.formState.errors.professionalsEngagement
                        .message as string
                    }
                  </p>
                )}
              </div>

              <div className='flex flex-col'>
                <Controller
                  control={methods.control}
                  name='accompanyingPersonsEngagement'
                  render={({ field }) => (
                    <label
                      htmlFor='accompanyingPersonsEngagement'
                      className={cn(
                        'flex items-center gap-2 text-sm cursor-pointer',
                        field.value && 'text-zinc-500',
                        methods.formState.errors
                          .accompanyingPersonsEngagement && 'text-destructive'
                      )}
                    >
                      <Checkbox
                        id='accompanyingPersonsEngagement'
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      Ingaggio accompagnatori
                    </label>
                  )}
                />
                {methods.formState.errors.accompanyingPersonsEngagement && (
                  <p className='text-xs text-destructive'>
                    {
                      methods.formState.errors.accompanyingPersonsEngagement
                        .message as string
                    }
                  </p>
                )}
              </div>

              <div className='text-sm font-semibold'>
                Giorno dell&apos;evento
              </div>

              <div className='flex flex-col'>
                <Controller
                  control={methods.control}
                  name='performance'
                  render={({ field }) => (
                    <label
                      htmlFor='performance'
                      className={cn(
                        'flex items-center gap-2 text-sm cursor-pointer',
                        field.value && 'text-zinc-500',
                        methods.formState.errors.performance &&
                          'text-destructive'
                      )}
                    >
                      <Checkbox
                        id='performance'
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      Performance
                    </label>
                  )}
                />
                {methods.formState.errors.performance && (
                  <p className='text-xs text-destructive'>
                    {methods.formState.errors.performance.message as string}
                  </p>
                )}
              </div>

              <div className='text-sm font-semibold'>Post evento</div>

              <div className='flex flex-col'>
                <Controller
                  control={methods.control}
                  name='postDateFeedback'
                  render={({ field }) => (
                    <label
                      htmlFor='postDateFeedback'
                      className={cn(
                        'flex items-center gap-2 text-sm cursor-pointer',
                        field.value && 'text-zinc-500',
                        methods.formState.errors.postDateFeedback &&
                          'text-destructive'
                      )}
                    >
                      <Checkbox
                        id='postDateFeedback'
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      Feedback post-evento
                    </label>
                  )}
                />
                {methods.formState.errors.postDateFeedback && (
                  <p className='text-xs text-destructive'>
                    {
                      methods.formState.errors.postDateFeedback
                        .message as string
                    }
                  </p>
                )}
              </div>

              <div className='flex flex-col'>
                <Controller
                  control={methods.control}
                  name='bordereau'
                  render={({ field }) => (
                    <label
                      htmlFor='bordereau'
                      className={cn(
                        'flex items-center gap-2 text-sm cursor-pointer',
                        field.value && 'text-zinc-500',
                        methods.formState.errors.bordereau && 'text-destructive'
                      )}
                    >
                      <Checkbox
                        id='bordereau'
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                      Bordereau
                    </label>
                  )}
                />
                {methods.formState.errors.bordereau && (
                  <p className='text-xs text-destructive'>
                    {methods.formState.errors.bordereau.message as string}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>

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
              {isLoading ? 'Creazione evento...' : 'Crea evento'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
