import BackButton from '@/app/_components/BackButton';
import { Separator } from '@/components/ui/separator';
import EventStatusBadge from '@/app/(private)/_components/Badges/EventStatusBadge';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { notFound, redirect } from 'next/navigation';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { hasRole, resolveNextPath } from '@/lib/utils';
import { getEventSummary } from '@/lib/data/events/get-event-summary';
import { EventType } from '@/lib/types';
import { TIME_ZONE } from '@/lib/constants';
import { database } from '@/lib/database/connection';
import { events, contracts } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { generateEventTitle } from '@/lib/utils/generate-event-title';
import RegisterPaymentForm from './_components/RegisterPaymentForm';
import PayWithStripeButton from './_components/PayWithStripeButton';
import PaymentSuccessHandler from './_components/PaymentSuccessHandler';
import SyncContractButton from './_components/SyncContractButton';
import { activatePaymentFlowIfContractSigned } from './_actions/activate-payment-flow';

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  'dj-set': 'DJ set',
  live: 'Live',
  festival: 'Festival',
};

type EventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['admin', 'artist-manager', 'venue-manager'])) {
    notFound();
  }

  const { id } = await params;
  const eventId = Number(id);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    notFound();
  }

  const event = await getEventSummary(eventId);
  if (!event) {
    notFound();
  }

  // Automatically activate payment flow if contract is signed
  await activatePaymentFlowIfContractSigned(eventId);

  // Get payment data
  const [paymentData] = await database
    .select({
      paymentStatus: events.paymentStatus,
      upfrontPaymentAmount: events.upfrontPaymentAmount,
      upfrontPaymentMethod: events.upfrontPaymentMethod,
      upfrontPaymentDate: events.upfrontPaymentDate,
      upfrontPaymentReference: events.upfrontPaymentReference,
      upfrontPaidAt: events.upfrontPaidAt,
      finalBalanceAmount: events.finalBalanceAmount,
      finalBalanceMethod: events.finalBalanceMethod,
      finalBalanceDate: events.finalBalanceDate,
      finalBalanceReference: events.finalBalanceReference,
      finalBalanceDeadline: events.finalBalanceDeadline,
      balancePaidAt: events.balancePaidAt,
      fullyPaidAt: events.fullyPaidAt,
    })
    .from(events)
    .where(eq(events.id, eventId));

  // Get contract status
  const [contractData] = await database
    .select({
      id: contracts.id,
      status: contracts.status,
      contractDate: contracts.contractDate,
      fileUrl: contracts.fileUrl,
      fileName: contracts.fileName,
      envelopeId: contracts.envelopeId,
    })
    .from(contracts)
    .where(eq(contracts.eventId, eventId));

  const startLabel = format(toZonedTime(event.startDate, TIME_ZONE), 'dd/MM/yyyy, HH:mm');
  const endLabel = format(toZonedTime(event.endDate, TIME_ZONE), 'dd/MM/yyyy, HH:mm');
  const artistName = `${event.artist.name} ${event.artist.surname}`.trim();
  const artistLabel = event.artist.stageName?.trim() || artistName;
  const eventTypeLabel = event.eventType ? EVENT_TYPE_LABELS[event.eventType] : null;
  const isAdmin = hasRole(user, ['admin']);
  const eventTitle =
    event.title?.trim() ||
    generateEventTitle(artistLabel, event.venue.name, event.startDate, event.endDate);

  console.log('[EventPage] Payment Data:', {
    paymentStatus: paymentData?.paymentStatus,
    upfrontPaymentAmount: paymentData?.upfrontPaymentAmount,
    upfrontPaidAt: paymentData?.upfrontPaidAt,
    isAdmin,
    showPaymentButton: isAdmin && paymentData?.paymentStatus === 'upfront-required' && !paymentData?.upfrontPaidAt,
  });

  return (
    <div className='max-w-3xl space-y-6'>
      <PaymentSuccessHandler eventId={eventId} />
      
      <div className='flex justify-between items-center'>
        <BackButton />
      </div>

      {/* Event Details Section */}
      <section className='bg-white p-6 rounded-2xl space-y-4'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4'>
          <div className='space-y-1'>
            <div className='text-xl font-bold'>{eventTitle}</div>
            <div className='text-sm text-zinc-500'>{event.venue.name}</div>
          </div>
          <div className='flex items-center gap-2'>
            <EventStatusBadge status={event.status} />
            {eventTypeLabel && <Badge variant='secondary'>{eventTypeLabel}</Badge>}
          </div>
        </div>

        <Separator />

        <div className='grid grid-cols-[minmax(180px,max-content)_1fr] gap-3 text-sm'>
          <span className='font-semibold text-zinc-600'>Inizio evento</span>
          <span className='font-medium text-zinc-500'>{startLabel}</span>
          <span className='font-semibold text-zinc-600'>Fine evento</span>
          <span className='font-medium text-zinc-500'>{endLabel}</span>
          <span className='font-semibold text-zinc-600'>Artista</span>
          <span className='font-medium text-zinc-500'>
            {artistName}
            {event.artist.stageName ? ` (@${event.artist.stageName})` : ''}
          </span>
          <span className='font-semibold text-zinc-600'>Locale</span>
          <span className='font-medium text-zinc-500'>{event.venue.name}</span>
          <span className='font-semibold text-zinc-600'>Città</span>
          <span className='font-medium text-zinc-500'>{event.venue.city || '-'}</span>
          <span className='font-semibold text-zinc-600'>Indirizzo</span>
          <span className='font-medium text-zinc-500'>{event.venue.address || '-'}</span>
        </div>
      </section>

      {/* Contract Status Section */}
      <section className='bg-white p-6 rounded-2xl space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-bold'>Contratto</h2>
          {isAdmin && contractData?.envelopeId && contractData.status !== 'signed' && (
            <SyncContractButton
              contractId={contractData.id}
              envelopeId={contractData.envelopeId}
              eventId={eventId}
            />
          )}
        </div>
        <Separator />
        <div className='grid grid-cols-[minmax(180px,max-content)_1fr] gap-3 text-sm'>
          <span className='font-semibold text-zinc-600'>Stato Contratto</span>
          <span className='font-medium text-zinc-500'>
            {contractData?.status ? (
              <Badge variant={contractData.status === 'signed' || contractData.status === 'voided' ? 'default' : 'secondary'}>
                {contractData.status === 'signed' && 'Firmato'}
                {contractData.status === 'voided' && 'Archiviato'}
                {contractData.status === 'sent' && 'Inviato'}
                {contractData.status === 'draft' && 'Bozza'}
                {contractData.status === 'declined' && 'Rifiutato'}
                {!['signed', 'voided', 'sent', 'draft', 'declined'].includes(contractData.status) && contractData.status}
              </Badge>
            ) : (
              'Nessun contratto'
            )}
          </span>
          {contractData?.contractDate && (
            <>
              <span className='font-semibold text-zinc-600'>Data Contratto</span>
              <span className='font-medium text-zinc-500'>
                {format(new Date(contractData.contractDate), 'dd/MM/yyyy')}
              </span>
            </>
          )}
          {contractData?.fileUrl && (
            <>
              <span className='font-semibold text-zinc-600'>Documento</span>
              <a
                href={contractData.fileUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:underline'
              >
                Visualizza contratto
              </a>
            </>
          )}
        </div>
      </section>

      {/* Payment Status Section */}
      <section className='bg-white p-6 rounded-2xl space-y-4'>
        <h2 className='text-lg font-bold'>Pagamenti</h2>
        <Separator />
        
        {/* Overall Payment Status */}
        <div className='grid grid-cols-[minmax(180px,max-content)_1fr] gap-3 text-sm'>
          <span className='font-semibold text-zinc-600'>Stato Pagamento</span>
          <span className='font-medium'>
            {paymentData?.paymentStatus ? (
              <Badge
                variant={
                  paymentData.paymentStatus === 'fully-paid' ? 'default' :
                  paymentData.paymentStatus === 'upfront-paid' ? 'default' :
                  paymentData.paymentStatus === 'pending' ? 'secondary' :
                  'outline'
                }
              >
                {paymentData.paymentStatus === 'pending' && 'In Attesa'}
                {paymentData.paymentStatus === 'upfront-required' && 'Acconto Richiesto'}
                {paymentData.paymentStatus === 'upfront-paid' && 'Acconto Ricevuto'}
                {paymentData.paymentStatus === 'balance-required' && 'Saldo Richiesto'}
                {paymentData.paymentStatus === 'fully-paid' && 'Completamente Pagato'}
                {paymentData.paymentStatus === 'expired' && 'Scaduto'}
                {paymentData.paymentStatus === 'failed' && 'Fallito'}
              </Badge>
            ) : (
              'N/A'
            )}
          </span>
        </div>

        {/* Upfront Payment Details */}
        {(paymentData?.upfrontPaymentAmount || paymentData?.paymentStatus === 'upfront-required') && (
          <>
            <Separator />
            <div className='space-y-2'>
              <h3 className='font-semibold text-sm'>Acconto (50%)</h3>
              <div className='grid grid-cols-[minmax(180px,max-content)_1fr] gap-3 text-sm'>
                <span className='font-semibold text-zinc-600'>Importo</span>
                <span className='font-medium text-zinc-500'>
                  {paymentData.upfrontPaymentAmount ? `€${paymentData.upfrontPaymentAmount}` : 'Da definire'}
                </span>
                {paymentData.upfrontPaymentMethod && (
                  <>
                    <span className='font-semibold text-zinc-600'>Metodo</span>
                    <span className='font-medium text-zinc-500'>
                      {paymentData.upfrontPaymentMethod === 'bank-transfer-sepa' && 'Bonifico SEPA'}
                      {paymentData.upfrontPaymentMethod === 'bank-transfer-instant' && 'Bonifico Istantaneo'}
                      {paymentData.upfrontPaymentMethod === 'stripe' && 'Stripe'}
                      {paymentData.upfrontPaymentMethod === 'cash' && 'Contanti'}
                      {paymentData.upfrontPaymentMethod === 'other' && 'Altro'}
                    </span>
                  </>
                )}
                {paymentData.upfrontPaymentDate && (
                  <>
                    <span className='font-semibold text-zinc-600'>Data Pagamento</span>
                    <span className='font-medium text-zinc-500'>
                      {format(new Date(paymentData.upfrontPaymentDate), 'dd/MM/yyyy')}
                    </span>
                  </>
                )}
                {paymentData.upfrontPaymentReference && (
                  <>
                    <span className='font-semibold text-zinc-600'>Riferimento</span>
                    <span className='font-medium text-zinc-500'>{paymentData.upfrontPaymentReference}</span>
                  </>
                )}
              </div>

              {/* Payment Options - Show if payment not yet received */}
              {paymentData?.paymentStatus === 'upfront-required' && !paymentData?.upfrontPaidAt && (
                <div className='mt-4 space-y-3'>
                  {/* Stripe Payment Button - Available to all users */}
                  <div>
                    <p className='text-xs font-medium text-zinc-600 mb-2'>Pagamento Online</p>
                    <PayWithStripeButton
                      eventId={eventId}
                      paymentType='upfront'
                      amount={paymentData.upfrontPaymentAmount ? parseFloat(paymentData.upfrontPaymentAmount) : 0}
                      eventTitle={`Evento #${eventId}`}
                      venueName={event.venue.name}
                      disabled={!paymentData.upfrontPaymentAmount}
                    />
                  </div>

                  {/* Manual Registration - Admin only */}
                  {isAdmin && (
                    <>
                      {/* Separator */}
                      <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                          <span className='w-full border-t' />
                        </div>
                        <div className='relative flex justify-center text-xs uppercase'>
                          <span className='bg-white px-2 text-zinc-500'>oppure</span>
                        </div>
                      </div>

                      {/* Manual Registration */}
                      <div>
                        <p className='text-xs font-medium text-zinc-600 mb-2'>Registrazione Manuale (Admin)</p>
                        <RegisterPaymentForm
                          eventId={eventId}
                          paymentType='upfront'
                          expectedAmount={paymentData.upfrontPaymentAmount ? parseFloat(paymentData.upfrontPaymentAmount) : undefined}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Final Balance Payment Details */}
        {(paymentData?.finalBalanceAmount || paymentData?.paymentStatus === 'balance-required' || paymentData?.paymentStatus === 'upfront-paid') && (
          <>
            <Separator />
            <div className='space-y-2'>
              <h3 className='font-semibold text-sm'>Saldo Finale (50%)</h3>
              <div className='grid grid-cols-[minmax(180px,max-content)_1fr] gap-3 text-sm'>
                {paymentData.finalBalanceDeadline && (
                  <>
                    <span className='font-semibold text-zinc-600'>Scadenza</span>
                    <span className='font-medium text-zinc-500'>
                      {format(new Date(paymentData.finalBalanceDeadline), 'dd/MM/yyyy')}
                    </span>
                  </>
                )}
                <span className='font-semibold text-zinc-600'>Importo</span>
                <span className='font-medium text-zinc-500'>
                  €{paymentData.finalBalanceAmount || '0.00'}
                </span>

                {/* Final Balance Payment Details - Show if paid */}
                {paymentData?.balancePaidAt && (
                  <>
                    <span className='font-semibold text-zinc-600'>Metodo</span>
                    <span className='font-medium text-zinc-500'>
                      {paymentData.finalBalanceMethod === 'bank-transfer-sepa' && 'Bonifico SEPA'}
                      {paymentData.finalBalanceMethod === 'bank-transfer-instant' && 'Bonifico Istantaneo'}
                      {paymentData.finalBalanceMethod === 'stripe' && 'Stripe'}
                      {paymentData.finalBalanceMethod === 'cash' && 'Contanti'}
                      {paymentData.finalBalanceMethod === 'other' && 'Altro'}
                    </span>
                  </>
                )}
                {paymentData?.finalBalanceDate && (
                  <>
                    <span className='font-semibold text-zinc-600'>Data Pagamento</span>
                    <span className='font-medium text-zinc-500'>
                      {format(new Date(paymentData.finalBalanceDate), 'dd/MM/yyyy')}
                    </span>
                  </>
                )}
                {paymentData?.finalBalanceReference && (
                  <>
                    <span className='font-semibold text-zinc-600'>Riferimento</span>
                    <span className='font-medium text-zinc-500'>{paymentData.finalBalanceReference}</span>
                  </>
                )}
              </div>

              {/* Payment Options - Show if balance not yet received */}
              {(paymentData?.paymentStatus === 'balance-required' || paymentData?.paymentStatus === 'upfront-paid') && !paymentData?.balancePaidAt && (
                <div className='mt-4 space-y-3'>
                  {/* Stripe Payment Button - Available to all users */}
                  <div>
                    <p className='text-xs font-medium text-zinc-600 mb-2'>Pagamento Online</p>
                    <PayWithStripeButton
                      eventId={eventId}
                      paymentType='final-balance'
                      amount={paymentData.finalBalanceAmount ? parseFloat(paymentData.finalBalanceAmount) : 0}
                      eventTitle={`Evento #${eventId}`}
                      venueName={event.venue.name}
                      disabled={!paymentData.finalBalanceAmount}
                    />
                  </div>

                  {/* Manual Registration - Admin only */}
                  {isAdmin && (
                    <>
                      {/* Separator */}
                      <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                          <span className='w-full border-t' />
                        </div>
                        <div className='relative flex justify-center text-xs uppercase'>
                          <span className='bg-white px-2 text-zinc-500'>oppure</span>
                        </div>
                      </div>

                      {/* Manual Registration */}
                      <div>
                        <p className='text-xs font-medium text-zinc-600 mb-2'>Registrazione Manuale (Admin)</p>
                        <RegisterPaymentForm
                          eventId={eventId}
                          paymentType='final-balance'
                          expectedAmount={paymentData.finalBalanceAmount ? parseFloat(paymentData.finalBalanceAmount) : undefined}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
