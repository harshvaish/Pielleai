'use client';

import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { ArtistSelectData, Event, MoCoordinator, VenueSelectData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { EventFormSchema, eventFormSchema } from '@/lib/validation/eventFormSchema';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { EVENTS_STATUS } from '@/lib/constants';
import EventStatusBadge from '../EventStatusBadge';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PdfUploadInput from '@/app/(private)/eventi/_components/create/PdfUploadInput';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import SearchArtistSelect from '../create/SearchArtistSelect';
import VenueSelect from '../create/VenueSelect';
import ArtistAvailabilitySelect from '../create/ArtistAvailabilitySelect';
import ArtistManagerSelect from '../create/ArtistManagerSelect';
import EventNotesInput from '../create/EventNotesInput';
import { updateEvent } from '@/lib/server-actions/events/update-event';

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
        date: format(event.availability.startDate, 'yyyy-MM-dd'),
        startTime: format(event.availability.startDate, 'HH:mm'),
        endTime: format(event.availability.endDate, 'HH:mm'),
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

      tecnicalRiderDocument: {
        url: event.tecnicalRiderUrl || '',
        name: event.tecnicalRiderName || '',
      },

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

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

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

          <div className='flex justify-between items-center gap-2'>
            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Artista</div>
              <Controller
                control={control}
                name='artistId'
                render={({ field }) => (
                  <SearchArtistSelect
                    artists={artists}
                    value={field.value}
                    setValue={field.onChange}
                    hasError={!!errors.artistId}
                  />
                )}
              />
              {errors.artistId && <p className='text-xs text-destructive mt-2'>{errors.artistId.message}</p>}
            </div>

            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Stato</div>
              <Controller
                control={control}
                name='status'
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className={cn('min-w-40', errors.status && 'border-destructive text-destructive')}
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
              {errors.status && <p className='text-xs text-destructive mt-2'>{errors.status.message}</p>}
            </div>
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Locale</div>
            <VenueSelect venues={venues} />
            {errors.venueId && <p className='text-xs text-destructive mt-2'>{errors.venueId.message}</p>}
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Data</div>
            <ArtistAvailabilitySelect />
            {errors.availability && <p className='text-xs text-destructive mt-2'>{errors.availability.message}</p>}
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
                <div className='text-sm font-semibold mb-2'>Manager artista</div>
                <ArtistManagerSelect />
                {errors.artistManagerProfileId && <p className='text-xs text-destructive mt-2'>{errors.artistManagerProfileId.message}</p>}
              </div>

              <div className='flex flex-col'>
                <div className='text-sm font-semibold mb-2'>Amministrazione</div>
                <Input
                  type='email'
                  {...methods.register('administrationEmail')}
                  placeholder='amministrazione@eaglebooking.it'
                  className={errors.administrationEmail ? 'border-destructive text-destructive' : ''}
                />
                {errors.administrationEmail && <p className='text-xs text-destructive mt-2'>{errors.administrationEmail.message}</p>}
              </div>

              <div className='flex flex-col'>
                <div className='text-sm font-semibold mb-2'>Consulente paghe e contributi</div>
                <Input
                  type='email'
                  {...methods.register('payrollConsultantEmail')}
                  placeholder='consulente@eaglebooking.it'
                  className={errors.payrollConsultantEmail ? 'border-destructive text-destructive' : ''}
                />
                {errors.payrollConsultantEmail && <p className='text-xs text-destructive mt-2'>{errors.payrollConsultantEmail.message}</p>}
              </div>

              <Separator className='bg-zinc-200' />

              <EventNotesInput />
            </TabsContent>

            <TabsContent
              value='b'
              className='flex flex-col gap-4 p-2'
            >
              <div className='grid sm:grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Cachet lordo</div>
                  <Input
                    {...methods.register('moCost', {
                      setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={errors.moCost ? 'border-destructive text-destructive' : ''}
                  />
                  {errors.moCost && <p className='text-xs text-destructive mt-2'>{errors.moCost.message}</p>}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Fee promoter</div>
                  <Input
                    {...methods.register('venueManagerCost', {
                      setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={errors.venueManagerCost ? 'border-destructive text-destructive' : ''}
                  />
                  {errors.venueManagerCost && <p className='text-xs text-destructive mt-2'>{errors.venueManagerCost.message}</p>}
                </div>
              </div>

              <div className='grid sm:grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Acconto</div>
                  <Input
                    {...methods.register('depositCost', {
                      setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={errors.depositCost ? 'border-destructive text-destructive' : ''}
                  />
                  {errors.depositCost && <p className='text-xs text-destructive mt-2'>{errors.depositCost.message}</p>}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Numero fattura acconto</div>
                  <Input
                    {...methods.register('depositInvoiceNumber')}
                    placeholder='123456789'
                    className={errors.depositInvoiceNumber ? 'border-destructive text-destructive' : ''}
                  />
                  {errors.depositInvoiceNumber && <p className='text-xs text-destructive mt-2'>{errors.depositInvoiceNumber.message}</p>}
                </div>
              </div>

              <div className='grid sm:grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Rimborso spese</div>
                  <Input
                    {...methods.register('expenseReimbursement', {
                      setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={errors.expenseReimbursement ? 'border-destructive text-destructive' : ''}
                  />
                  {errors.expenseReimbursement && <p className='text-xs text-destructive mt-2'>{errors.expenseReimbursement.message}</p>}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Percentuale booking</div>
                  <Input
                    {...methods.register('bookingPercentage', {
                      setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                    })}
                    placeholder='30%'
                    type='number'
                    min={0}
                    step={0.01}
                    className={errors.bookingPercentage ? 'border-destructive text-destructive' : ''}
                  />
                  {errors.bookingPercentage && <p className='text-xs text-destructive mt-2'>{errors.bookingPercentage.message}</p>}
                </div>
              </div>

              <div className='grid sm:grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Fornitore</div>
                  <Input
                    {...methods.register('supplierCost', {
                      setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={errors.supplierCost ? 'border-destructive text-destructive' : ''}
                  />
                  {errors.supplierCost && <p className='text-xs text-destructive mt-2'>{errors.supplierCost.message}</p>}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Spese anticipate da Milano Ovest per Artista</div>
                  <Input
                    {...methods.register('moArtistAdvancedExpenses', {
                      setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={errors.moArtistAdvancedExpenses ? 'border-destructive text-destructive' : ''}
                  />
                  {errors.moArtistAdvancedExpenses && <p className='text-xs text-destructive mt-2'>{errors.moArtistAdvancedExpenses.message}</p>}
                </div>
              </div>

              <div className='grid sm:grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Netto artista</div>
                  <Input
                    {...methods.register('artistNetCost', {
                      setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={errors.artistNetCost ? 'border-destructive text-destructive' : ''}
                  />
                  {errors.artistNetCost && <p className='text-xs text-destructive mt-2'>{errors.artistNetCost.message}</p>}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Anticipo artista</div>
                  <Input
                    {...methods.register('artistUpfrontCost', {
                      setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={errors.artistUpfrontCost ? 'border-destructive text-destructive' : ''}
                  />
                  {errors.artistUpfrontCost && <p className='text-xs text-destructive mt-2'>{errors.artistUpfrontCost.message}</p>}
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value='c'
              className='flex flex-col gap-4 p-2'
            >
              <div className='grid sm:grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Hotel</div>
                  <Input
                    {...methods.register('hotel')}
                    placeholder='Milano Ovest Hotel'
                    className={errors.hotel ? 'border-destructive text-destructive' : ''}
                  />
                  {errors.hotel && <p className='text-xs text-destructive mt-2'>{errors.hotel.message}</p>}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Ristorante</div>
                  <Input
                    {...methods.register('restaurant')}
                    placeholder='MoPizza'
                    className={errors.restaurant ? 'border-destructive text-destructive' : ''}
                  />
                  {errors.restaurant && <p className='text-xs text-destructive mt-2'>{errors.restaurant.message}</p>}
                </div>
              </div>

              <div className='grid sm:grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Referente serata</div>
                  <Input
                    {...methods.register('eveningContact')}
                    placeholder='Mario Rossi'
                    className={errors.eveningContact ? 'border-destructive text-destructive' : ''}
                  />
                  {errors.eveningContact && <p className='text-xs text-destructive mt-2'>{errors.eveningContact.message}</p>}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Coordinatore Milano Ovest</div>

                  <Controller
                    control={control}
                    name='moCoordinatorId'
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(v) => field.onChange(parseInt(v))}
                      >
                        <SelectTrigger
                          id='moCoordinatorId'
                          className={cn('w-full', errors.moCoordinatorId && 'border-destructive text-destructive')}
                          size='sm'
                        >
                          {moCoordinators.find((mc) => mc.id == field.value)?.name || 'Seleziona coordinatore'}
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

                  {errors.moCoordinatorId && <p className='text-xs text-destructive mt-2'>{errors.moCoordinatorId.message}</p>}
                </div>
              </div>

              <Separator className='bg-zinc-200' />

              <div className='grid sm:grid-cols-2 gap-4'>
                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Incasso totale</div>
                  <Input
                    {...methods.register('totalCost', {
                      setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={errors.totalCost ? 'border-destructive text-destructive' : ''}
                  />
                  {errors.totalCost && <p className='text-xs text-destructive mt-2'>{errors.totalCost.message}</p>}
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Saldo trasporti</div>
                  <Input
                    {...methods.register('transportationsCost', {
                      setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                    })}
                    placeholder='1000'
                    type='number'
                    min={0}
                    step={0.01}
                    className={errors.transportationsCost ? 'border-destructive text-destructive' : ''}
                  />
                  {errors.transportationsCost && <p className='text-xs text-destructive mt-2'>{errors.transportationsCost.message}</p>}
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
                  className={errors.cashBalanceCost ? 'border-destructive text-destructive' : ''}
                />
                {errors.cashBalanceCost && <p className='text-xs text-destructive mt-2'>{errors.cashBalanceCost.message}</p>}
              </div>

              <Separator className='bg-zinc-200' />

              <div className='grid sm:grid-cols-2 gap-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex flex-col'>
                    <div className='text-sm font-semibold mb-2'>Inizio sound-check</div>
                    <Input
                      {...methods.register('soundCheckStart')}
                      type='time'
                      className={cn(
                        'appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none',
                        errors.soundCheckStart ? 'border-destructive text-destructive' : ''
                      )}
                    />
                    {errors.soundCheckStart && <p className='text-xs text-destructive mt-2'>{errors.soundCheckStart.message}</p>}
                  </div>
                  <div className='flex flex-col'>
                    <div className='text-sm font-semibold mb-2'>Fine sound-check</div>
                    <Input
                      {...methods.register('soundCheckEnd')}
                      type='time'
                      className={cn(
                        'appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none',
                        errors.soundCheckEnd ? 'border-destructive text-destructive' : ''
                      )}
                    />
                    {errors.soundCheckEnd && <p className='text-xs text-destructive mt-2'>{errors.soundCheckEnd.message}</p>}
                  </div>
                </div>

                <div className='flex flex-col'>
                  <div className='text-sm font-semibold mb-2'>Rider tecnico</div>
                  <PdfUploadInput />
                  {errors.tecnicalRiderDocument && <p className='text-xs text-destructive mt-2'>{errors.tecnicalRiderDocument.message}</p>}
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
                  control={control}
                  name='contractSigning'
                  render={({ field }) => (
                    <label
                      htmlFor='contractSigning'
                      className={cn('flex items-center gap-2 text-sm cursor-pointer', field.value && 'text-zinc-500', errors.contractSigning && 'text-destructive')}
                    >
                      <Checkbox
                        id='contractSigning'
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                      Firma del contratto
                    </label>
                  )}
                />
                {errors.contractSigning && <p className='text-xs text-destructive'>{errors.contractSigning.message}</p>}
              </div>

              <div className='flex flex-col'>
                <Controller
                  control={control}
                  name='depositInvoiceIssuing'
                  render={({ field }) => (
                    <label
                      htmlFor='depositInvoiceIssuing'
                      className={cn('flex items-center gap-2 text-sm cursor-pointer', field.value && 'text-zinc-500', errors.depositInvoiceIssuing && 'text-destructive')}
                    >
                      <Checkbox
                        id='depositInvoiceIssuing'
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                      Emissione fattura acconto
                    </label>
                  )}
                />
                {errors.depositInvoiceIssuing && <p className='text-xs text-destructive'>{errors.depositInvoiceIssuing.message}</p>}
              </div>

              <div className='flex flex-col'>
                <Controller
                  control={control}
                  name='depositReceiptVerification'
                  render={({ field }) => (
                    <label
                      htmlFor='depositReceiptVerification'
                      className={cn('flex items-center gap-2 text-sm cursor-pointer', field.value && 'text-zinc-500', errors.depositReceiptVerification && 'text-destructive')}
                    >
                      <Checkbox
                        id='depositReceiptVerification'
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                      Verifica ricezione acconto
                    </label>
                  )}
                />
                {errors.depositReceiptVerification && <p className='text-xs text-destructive'>{errors.depositReceiptVerification.message}</p>}
              </div>

              <div className='flex flex-col'>
                <Controller
                  control={control}
                  name='techSheetSubmission'
                  render={({ field }) => (
                    <label
                      htmlFor='techSheetSubmission'
                      className={cn('flex items-center gap-2 text-sm cursor-pointer', field.value && 'text-zinc-500', errors.techSheetSubmission && 'text-destructive')}
                    >
                      <Checkbox
                        id='techSheetSubmission'
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                      Recupero e invio scheda tecnica
                    </label>
                  )}
                />
                {errors.techSheetSubmission && <p className='text-xs text-destructive'>{errors.techSheetSubmission.message}</p>}
              </div>

              <div className='flex flex-col'>
                <Controller
                  control={control}
                  name='artistEngagement'
                  render={({ field }) => (
                    <label
                      htmlFor='artistEngagement'
                      className={cn('flex items-center gap-2 text-sm cursor-pointer', field.value && 'text-zinc-500', errors.artistEngagement && 'text-destructive')}
                    >
                      <Checkbox
                        id='artistEngagement'
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                      Incarico artista
                    </label>
                  )}
                />
                {errors.artistEngagement && <p className='text-xs text-destructive'>{errors.artistEngagement.message}</p>}
              </div>

              <div className='flex flex-col'>
                <Controller
                  control={control}
                  name='professionalsEngagement'
                  render={({ field }) => (
                    <label
                      htmlFor='professionalsEngagement'
                      className={cn('flex items-center gap-2 text-sm cursor-pointer', field.value && 'text-zinc-500', errors.professionalsEngagement && 'text-destructive')}
                    >
                      <Checkbox
                        id='professionalsEngagement'
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                      Incarico professionisti
                    </label>
                  )}
                />
                {errors.professionalsEngagement && <p className='text-xs text-destructive'>{errors.professionalsEngagement.message}</p>}
              </div>

              <div className='flex flex-col'>
                <Controller
                  control={control}
                  name='accompanyingPersonsEngagement'
                  render={({ field }) => (
                    <label
                      htmlFor='accompanyingPersonsEngagement'
                      className={cn('flex items-center gap-2 text-sm cursor-pointer', field.value && 'text-zinc-500', errors.accompanyingPersonsEngagement && 'text-destructive')}
                    >
                      <Checkbox
                        id='accompanyingPersonsEngagement'
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                      Ingaggio accompagnatori
                    </label>
                  )}
                />
                {errors.accompanyingPersonsEngagement && <p className='text-xs text-destructive'>{errors.accompanyingPersonsEngagement.message}</p>}
              </div>

              <div className='text-sm font-semibold'>Giorno dell&apos;evento</div>

              <div className='flex flex-col'>
                <Controller
                  control={control}
                  name='performance'
                  render={({ field }) => (
                    <label
                      htmlFor='performance'
                      className={cn('flex items-center gap-2 text-sm cursor-pointer', field.value && 'text-zinc-500', errors.performance && 'text-destructive')}
                    >
                      <Checkbox
                        id='performance'
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                      Performance
                    </label>
                  )}
                />
                {errors.performance && <p className='text-xs text-destructive'>{errors.performance.message}</p>}
              </div>

              <div className='text-sm font-semibold'>Post evento</div>

              <div className='flex flex-col'>
                <Controller
                  control={control}
                  name='postDateFeedback'
                  render={({ field }) => (
                    <label
                      htmlFor='postDateFeedback'
                      className={cn('flex items-center gap-2 text-sm cursor-pointer', field.value && 'text-zinc-500', errors.postDateFeedback && 'text-destructive')}
                    >
                      <Checkbox
                        id='postDateFeedback'
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                      Feedback post-evento
                    </label>
                  )}
                />
                {errors.postDateFeedback && <p className='text-xs text-destructive'>{errors.postDateFeedback.message}</p>}
              </div>

              <div className='flex flex-col'>
                <Controller
                  control={control}
                  name='bordereau'
                  render={({ field }) => (
                    <label
                      htmlFor='bordereau'
                      className={cn('flex items-center gap-2 text-sm cursor-pointer', field.value && 'text-zinc-500', errors.bordereau && 'text-destructive')}
                    >
                      <Checkbox
                        id='bordereau'
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                      Bordereau
                    </label>
                  )}
                />
                {errors.bordereau && <p className='text-xs text-destructive'>{errors.bordereau.message}</p>}
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
              {isLoading ? 'Aggiornamento...' : 'Modifica'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
