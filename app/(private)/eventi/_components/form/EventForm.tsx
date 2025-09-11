'use client';

import { ArtistSelectData, MoCoordinator, VenueSelectData } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import EventStatusBadge from '../../../_components/badges/EventStatusBadge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PdfUploadInput from '@/app/(private)/eventi/_components/form/PdfUploadInput';
import { Checkbox } from '@/components/ui/checkbox';
import VenueSelect from './VenueSelect';
import ArtistAvailabilitySelect from './ArtistAvailabilitySelect';
import ArtistManagerSelect from './ArtistManagerSelect';
import EventNotesInput from './EventNotesInput';
import { Controller, useFormContext } from 'react-hook-form';
import ArtistSelect from './ArtistSelect';
import { eventStatus } from '@/lib/database/schema';
import { EventFormSchema } from '@/lib/validation/event-form-schema';

type EventForm = {
  artists: ArtistSelectData[];
  venues: VenueSelectData[];
  moCoordinators: MoCoordinator[];
};

export default function EventForm({ artists, venues, moCoordinators }: EventForm) {
  const {
    watch,
    register,
    control,
    formState: { errors },
  } = useFormContext<EventFormSchema>();

  const selectedVenueId = watch('venueId');
  const selectedVenue = venues.find((venue) => venue.id == selectedVenueId);

  return (
    <>
      <div className='flex justify-between items-center gap-2'>
        <div className='flex flex-col'>
          <div className='text-sm font-semibold mb-2'>Artista</div>
          <Controller
            control={control}
            name='artistId'
            render={({ field }) => (
              <ArtistSelect
                artists={artists}
                value={field.value}
                setValue={field.onChange}
                hasError={!!errors.artistId}
              />
            )}
          />
          {errors.artistId && (
            <p className='text-xs text-destructive mt-2'>{errors.artistId.message as string}</p>
          )}
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
                  {eventStatus.enumValues.map((status) => (
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
          {errors.status && (
            <p className='text-xs text-destructive mt-2'>{errors.status.message as string}</p>
          )}
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='text-sm font-semibold mb-2'>Data</div>
        <ArtistAvailabilitySelect />
        {errors.availability && (
          <p className='text-xs text-destructive mt-2'>Seleziona una disponibilità valida.</p>
        )}
      </div>

      <div className='grid sm:grid-cols-2 gap-4'>
        <div className='flex flex-col'>
          <div className='text-sm font-semibold mb-2'>Location</div>
          <VenueSelect venues={venues} />
          {errors.venueId && (
            <p className='text-xs text-destructive mt-2'>{errors.venueId.message as string}</p>
          )}
        </div>

        <div className='flex flex-col'>
          <div className='text-sm font-semibold mb-2'>Indirizzo del locale</div>

          <div className='h-10 flex items-center text-sm'>
            {selectedVenue?.address ? (
              <span className='truncate'>{selectedVenue?.address}</span>
            ) : (
              <span className='text-zinc-400'>Seleziona un locale</span>
            )}
          </div>
        </div>
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
            {errors.artistManagerProfileId && (
              <p className='text-xs text-destructive mt-2'>
                {errors.artistManagerProfileId.message as string}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Tour manager</div>
            <Input
              type='email'
              {...register('tourManagerEmail')}
              placeholder='tour.manager@eaglebooking.it'
              className={errors.tourManagerEmail ? 'border-destructive text-destructive' : ''}
            />
            {errors.tourManagerEmail && (
              <p className='text-xs text-destructive mt-2'>
                {errors.tourManagerEmail.message as string}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Assistenza</div>
            <Input
              type='email'
              {...register('administrationEmail')}
              placeholder='info@eaglebooking.it'
              className={errors.administrationEmail ? 'border-destructive text-destructive' : ''}
            />
            {errors.administrationEmail && (
              <p className='text-xs text-destructive mt-2'>
                {errors.administrationEmail.message as string}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Ingaggi</div>
            <Input
              type='email'
              {...register('payrollConsultantEmail')}
              placeholder='consulente@eaglebooking.it'
              className={errors.payrollConsultantEmail ? 'border-destructive text-destructive' : ''}
            />
            {errors.payrollConsultantEmail && (
              <p className='text-xs text-destructive mt-2'>
                {errors.payrollConsultantEmail.message as string}
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
          <div className='grid sm:grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Cachet lordo</div>
              <Input
                {...register('moCost', {
                  setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={errors.moCost ? 'border-destructive text-destructive' : ''}
              />
              {errors.moCost && (
                <p className='text-xs text-destructive mt-2'>{errors.moCost.message as string}</p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Nome promoter</div>

              <div className='h-10 flex items-center text-sm'>
                {selectedVenue?.manager?.name ? (
                  <span className='truncate'>
                    {selectedVenue?.manager?.name} {selectedVenue?.manager?.surname}
                  </span>
                ) : (
                  <span className='text-zinc-400'>Seleziona un locale</span>
                )}
              </div>
            </div>
          </div>

          <div className='grid sm:grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Acconto</div>
              <Input
                {...register('depositCost', {
                  setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={errors.depositCost ? 'border-destructive text-destructive' : ''}
              />
              {errors.depositCost && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.depositCost.message as string}
                </p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Fee promoter</div>
              <Input
                {...register('venueManagerCost', {
                  setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={errors.venueManagerCost ? 'border-destructive text-destructive' : ''}
              />
              {errors.venueManagerCost && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.venueManagerCost.message as string}
                </p>
              )}
            </div>
          </div>

          <div className='grid sm:grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Numero fattura acconto</div>
              <Input
                {...register('depositInvoiceNumber')}
                placeholder='123456789'
                className={errors.depositInvoiceNumber ? 'border-destructive text-destructive' : ''}
              />
              {errors.depositInvoiceNumber && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.depositInvoiceNumber.message as string}
                </p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Rimborso spese</div>
              <Input
                {...register('expenseReimbursement', {
                  setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={errors.expenseReimbursement ? 'border-destructive text-destructive' : ''}
              />
              {errors.expenseReimbursement && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.expenseReimbursement.message as string}
                </p>
              )}
            </div>
          </div>

          <div className='grid sm:grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Percentuale booking</div>
              <Input
                {...register('bookingPercentage', {
                  setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                })}
                placeholder='30%'
                type='number'
                min={0}
                step={0.01}
                className={errors.bookingPercentage ? 'border-destructive text-destructive' : ''}
              />
              {errors.bookingPercentage && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.bookingPercentage.message as string}
                </p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Fornitore</div>
              <Input
                {...register('supplierCost', {
                  setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={errors.supplierCost ? 'border-destructive text-destructive' : ''}
              />
              {errors.supplierCost && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.supplierCost.message as string}
                </p>
              )}
            </div>
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>
              Spese anticipate da Milano Ovest per Artista
            </div>
            <Input
              {...register('moArtistAdvancedExpenses', {
                setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
              })}
              placeholder='1000'
              type='number'
              min={0}
              step={0.01}
              className={
                errors.moArtistAdvancedExpenses ? 'border-destructive text-destructive' : ''
              }
            />
            {errors.moArtistAdvancedExpenses && (
              <p className='text-xs text-destructive mt-2'>
                {errors.moArtistAdvancedExpenses.message as string}
              </p>
            )}
          </div>

          <div className='grid sm:grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Netto artista</div>
              <Input
                {...register('artistNetCost', {
                  setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={errors.artistNetCost ? 'border-destructive text-destructive' : ''}
              />
              {errors.artistNetCost && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.artistNetCost.message as string}
                </p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Anticipo artista</div>
              <Input
                {...register('artistUpfrontCost', {
                  setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={errors.artistUpfrontCost ? 'border-destructive text-destructive' : ''}
              />
              {errors.artistUpfrontCost && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.artistUpfrontCost.message as string}
                </p>
              )}
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
                {...register('hotel')}
                placeholder='Milano Ovest Hotel'
                className={errors.hotel ? 'border-destructive text-destructive' : ''}
              />
              {errors.hotel && (
                <p className='text-xs text-destructive mt-2'>{errors.hotel.message as string}</p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Ristorante</div>
              <Input
                {...register('restaurant')}
                placeholder='MoPizza'
                className={errors.restaurant ? 'border-destructive text-destructive' : ''}
              />
              {errors.restaurant && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.restaurant.message as string}
                </p>
              )}
            </div>
          </div>

          <div className='grid sm:grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Referente serata</div>
              <Input
                {...register('eveningContact')}
                placeholder='Mario Rossi'
                className={errors.eveningContact ? 'border-destructive text-destructive' : ''}
              />
              {errors.eveningContact && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.eveningContact.message as string}
                </p>
              )}
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
                      className={cn(
                        'w-full',
                        errors.moCoordinatorId && 'border-destructive text-destructive',
                      )}
                      size='sm'
                    >
                      {moCoordinators.find((mc) => mc.id == field.value)?.name ||
                        'Seleziona coordinatore'}
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

              {errors.moCoordinatorId && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.moCoordinatorId.message as string}
                </p>
              )}
            </div>
          </div>

          <Separator className='bg-zinc-200' />

          <div className='grid sm:grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Incasso totale</div>
              <Input
                {...register('totalCost', {
                  setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={errors.totalCost ? 'border-destructive text-destructive' : ''}
              />
              {errors.totalCost && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.totalCost.message as string}
                </p>
              )}
            </div>

            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Saldo trasporti</div>
              <Input
                {...register('transportationsCost', {
                  setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
                })}
                placeholder='1000'
                type='number'
                min={0}
                step={0.01}
                className={errors.transportationsCost ? 'border-destructive text-destructive' : ''}
              />
              {errors.transportationsCost && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.transportationsCost.message as string}
                </p>
              )}
            </div>
          </div>

          <div className='flex flex-col'>
            <div className='text-sm font-semibold mb-2'>Saldo cassa</div>
            <Input
              {...register('cashBalanceCost', {
                setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
              })}
              placeholder='1000'
              type='number'
              min={0}
              step={0.01}
              className={errors.cashBalanceCost ? 'border-destructive text-destructive' : ''}
            />
            {errors.cashBalanceCost && (
              <p className='text-xs text-destructive mt-2'>
                {errors.cashBalanceCost.message as string}
              </p>
            )}
          </div>

          <Separator className='bg-zinc-200' />

          <div className='grid sm:grid-cols-2 gap-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col'>
                <div className='text-sm font-semibold mb-2'>Inizio sound-check</div>
                <Input
                  {...register('soundCheckStart')}
                  type='time'
                  className={cn(
                    'appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none',
                    errors.soundCheckStart ? 'border-destructive text-destructive' : '',
                  )}
                />
                {errors.soundCheckStart && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.soundCheckStart.message as string}
                  </p>
                )}
              </div>
              <div className='flex flex-col'>
                <div className='text-sm font-semibold mb-2'>Fine sound-check</div>
                <Input
                  {...register('soundCheckEnd')}
                  type='time'
                  className={cn(
                    'appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none',
                    errors.soundCheckEnd ? 'border-destructive text-destructive' : '',
                  )}
                />
                {errors.soundCheckEnd && (
                  <p className='text-xs text-destructive mt-2'>
                    {errors.soundCheckEnd.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className='flex flex-col'>
              <div className='text-sm font-semibold mb-2'>Rider tecnico</div>
              <PdfUploadInput />
              {errors.tecnicalRiderDocument && (
                <p className='text-xs text-destructive mt-2'>
                  {errors.tecnicalRiderDocument.message as string}
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
              control={control}
              name='contractSigning'
              render={({ field }) => (
                <label
                  htmlFor='contractSigning'
                  className={cn(
                    'flex items-center gap-2 text-sm cursor-pointer',
                    field.value && 'text-zinc-400',
                    errors.contractSigning && 'text-destructive',
                  )}
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
            {errors.contractSigning && (
              <p className='text-xs text-destructive'>{errors.contractSigning.message as string}</p>
            )}
          </div>

          <div className='flex flex-col'>
            <Controller
              control={control}
              name='depositInvoiceIssuing'
              render={({ field }) => (
                <label
                  htmlFor='depositInvoiceIssuing'
                  className={cn(
                    'flex items-center gap-2 text-sm cursor-pointer',
                    field.value && 'text-zinc-400',
                    errors.depositInvoiceIssuing && 'text-destructive',
                  )}
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
            {errors.depositInvoiceIssuing && (
              <p className='text-xs text-destructive'>
                {errors.depositInvoiceIssuing.message as string}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <Controller
              control={control}
              name='depositReceiptVerification'
              render={({ field }) => (
                <label
                  htmlFor='depositReceiptVerification'
                  className={cn(
                    'flex items-center gap-2 text-sm cursor-pointer',
                    field.value && 'text-zinc-400',
                    errors.depositReceiptVerification && 'text-destructive',
                  )}
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
            {errors.depositReceiptVerification && (
              <p className='text-xs text-destructive'>
                {errors.depositReceiptVerification.message as string}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <Controller
              control={control}
              name='techSheetSubmission'
              render={({ field }) => (
                <label
                  htmlFor='techSheetSubmission'
                  className={cn(
                    'flex items-center gap-2 text-sm cursor-pointer',
                    field.value && 'text-zinc-400',
                    errors.techSheetSubmission && 'text-destructive',
                  )}
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
            {errors.techSheetSubmission && (
              <p className='text-xs text-destructive'>
                {errors.techSheetSubmission.message as string}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <Controller
              control={control}
              name='artistEngagement'
              render={({ field }) => (
                <label
                  htmlFor='artistEngagement'
                  className={cn(
                    'flex items-center gap-2 text-sm cursor-pointer',
                    field.value && 'text-zinc-400',
                    errors.artistEngagement && 'text-destructive',
                  )}
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
            {errors.artistEngagement && (
              <p className='text-xs text-destructive'>
                {errors.artistEngagement.message as string}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <Controller
              control={control}
              name='professionalsEngagement'
              render={({ field }) => (
                <label
                  htmlFor='professionalsEngagement'
                  className={cn(
                    'flex items-center gap-2 text-sm cursor-pointer',
                    field.value && 'text-zinc-400',
                    errors.professionalsEngagement && 'text-destructive',
                  )}
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
            {errors.professionalsEngagement && (
              <p className='text-xs text-destructive'>
                {errors.professionalsEngagement.message as string}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <Controller
              control={control}
              name='accompanyingPersonsEngagement'
              render={({ field }) => (
                <label
                  htmlFor='accompanyingPersonsEngagement'
                  className={cn(
                    'flex items-center gap-2 text-sm cursor-pointer',
                    field.value && 'text-zinc-400',
                    errors.accompanyingPersonsEngagement && 'text-destructive',
                  )}
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
            {errors.accompanyingPersonsEngagement && (
              <p className='text-xs text-destructive'>
                {errors.accompanyingPersonsEngagement.message as string}
              </p>
            )}
          </div>

          <div className='text-sm font-semibold'>Giorno dell&apos;evento</div>

          <div className='flex flex-col'>
            <Controller
              control={control}
              name='performance'
              render={({ field }) => (
                <label
                  htmlFor='performance'
                  className={cn(
                    'flex items-center gap-2 text-sm cursor-pointer',
                    field.value && 'text-zinc-400',
                    errors.performance && 'text-destructive',
                  )}
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
            {errors.performance && (
              <p className='text-xs text-destructive'>{errors.performance.message as string}</p>
            )}
          </div>

          <div className='text-sm font-semibold'>Post evento</div>

          <div className='flex flex-col'>
            <Controller
              control={control}
              name='postDateFeedback'
              render={({ field }) => (
                <label
                  htmlFor='postDateFeedback'
                  className={cn(
                    'flex items-center gap-2 text-sm cursor-pointer',
                    field.value && 'text-zinc-400',
                    errors.postDateFeedback && 'text-destructive',
                  )}
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
            {errors.postDateFeedback && (
              <p className='text-xs text-destructive'>
                {errors.postDateFeedback.message as string}
              </p>
            )}
          </div>

          <div className='flex flex-col'>
            <Controller
              control={control}
              name='bordereau'
              render={({ field }) => (
                <label
                  htmlFor='bordereau'
                  className={cn(
                    'flex items-center gap-2 text-sm cursor-pointer',
                    field.value && 'text-zinc-400',
                    errors.bordereau && 'text-destructive',
                  )}
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
            {errors.bordereau && (
              <p className='text-xs text-destructive'>{errors.bordereau.message as string}</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
