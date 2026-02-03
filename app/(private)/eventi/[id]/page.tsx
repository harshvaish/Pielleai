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
import { getContractPreviewUrl } from '@/lib/utils/contract-preview';
import RegisterPaymentForm from './_components/RegisterPaymentForm';
import PayWithStripeButton from './_components/PayWithStripeButton';
import PaymentSuccessHandler from './_components/PaymentSuccessHandler';
import SyncContractButton from './_components/SyncContractButton';
import { activatePaymentFlowIfContractSigned } from './_actions/activate-payment-flow';
import Link from 'next/link';
import { getEventRevisionContext } from '@/lib/data/events/get-event-revision-context';
import { getEventRevisionHistory } from '@/lib/data/events/get-event-revision-history';
import CreateRevisionDialog from './_components/CreateRevisionDialog';
import RevisionHistoryPanel from './_components/RevisionHistoryPanel';
import GuestParticipantSection from './_components/GuestParticipantSection';
import { getEventGuests } from '@/lib/data/events/get-event-guests';
import ProfessionalsSection from './_components/ProfessionalsSection';
import { getEventProfessionals } from '@/lib/data/events/get-event-professionals';
import { getProfessionalsCached } from '@/lib/cache/professionals';
import { HostedEventBadge } from '@/app/(private)/_components/Badges/HostedEventBadge';
import { getEventSummaryDocument } from '@/lib/data/documents/get-event-summary-document';
import RemoveApprovedVenueButton from './_components/RemoveApprovedVenueButton';
import CancelEventButton from './_components/CancelEventButton';
import CancellationAccountingToggle from './_components/CancellationAccountingToggle';
import RetryLegalDisputeEmailButton from './_components/RetryLegalDisputeEmailButton';

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

  const revisionContext = await getEventRevisionContext(eventId);
  if (!revisionContext) {
    notFound();
  }

  const isAdmin = hasRole(user, ['admin']);
  const resolvedEventId = isAdmin ? eventId : revisionContext.latestEventId;

  if (!isAdmin && resolvedEventId !== eventId) {
    redirect(`/eventi/${resolvedEventId}`);
  }

  const event = await getEventSummary(resolvedEventId);
  if (!event) {
    notFound();
  }

  // Automatically activate payment flow if contract is signed
  await activatePaymentFlowIfContractSigned(resolvedEventId);

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
    .where(eq(events.id, resolvedEventId));

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
    .where(eq(contracts.eventId, resolvedEventId));

  const startLabel = format(toZonedTime(event.startDate, TIME_ZONE), 'dd/MM/yyyy, HH:mm');
  const endLabel = format(toZonedTime(event.endDate, TIME_ZONE), 'dd/MM/yyyy, HH:mm');
  const artistName = `${event.artist.name} ${event.artist.surname}`.trim();
  const artistLabel = event.artist.stageName?.trim() || artistName;
  const eventTypeLabel = event.eventType ? EVENT_TYPE_LABELS[event.eventType] : null;
  const revisionHistory = isAdmin ? await getEventRevisionHistory(resolvedEventId) : [];
  const canViewAccreditation = hasRole(user, ['admin', 'artist-manager']);
  const eventGuests = canViewAccreditation ? await getEventGuests(resolvedEventId) : [];
  const eventProfessionals = hasRole(user, ['admin', 'artist-manager'])
    ? await getEventProfessionals(resolvedEventId)
    : [];
  const allProfessionals = isAdmin ? await getProfessionalsCached() : [];
  const eventSummaryDoc =
    event.status === 'ended' ? await getEventSummaryDocument(resolvedEventId) : null;
  const eventTitle =
    event.title?.trim() ||
    generateEventTitle(artistLabel, event.venue.name, event.startDate, event.endDate);
  const isCancelled = ['cancelled', 'in-dispute'].includes(event.status);

  const CANCELLATION_REQUESTED_BY_LABELS: Record<string, string> = {
    venue: 'Locale',
    booking: 'Booking',
  };

  const CANCELLATION_TYPE_LABELS: Record<string, string> = {
    venue: 'Annullamento locale',
    peaceful: 'Annullamento pacifico',
    'legal-dispute': 'Contestazione legale',
  };

  const ROLE_LABELS: Record<string, string> = {
    admin: 'Admin',
    'artist-manager': 'Manager Artista',
    'venue-manager': 'Promoter Locale',
    user: 'Utente',
  };

  const formatDateTime = (value?: string | Date | null) =>
    value
      ? format(toZonedTime(new Date(value), TIME_ZONE), 'dd/MM/yyyy HH:mm')
      : '-';

  const paymentStatus = paymentData?.paymentStatus ?? 'pending';
  const allowedEventStatus = ['pre-confirmed', 'confirmed'].includes(event.status);
  const isPreConfirmedAwaitingContract =
    event.status === 'pre-confirmed' && paymentStatus === 'pending';
  const isContractSignedAwaitingUpfront = paymentStatus === 'upfront-required';
  const isBookedAwaitingBalance = ['upfront-paid', 'balance-required'].includes(paymentStatus);
  const isFullyConfirmed = ['fully-paid', 'balance-paid'].includes(paymentStatus);

  const canRemoveVenue =
    isAdmin &&
    allowedEventStatus &&
    (isPreConfirmedAwaitingContract || isContractSignedAwaitingUpfront || isBookedAwaitingBalance) &&
    !isFullyConfirmed &&
    !isCancelled;

  const removeVenueDisabledReason = !isAdmin
    ? undefined
    : !allowedEventStatus
      ? 'Operazione consentita solo per eventi pre-confermati o confermati.'
      : isCancelled
        ? 'Operazione non consentita: evento annullato.'
      : isFullyConfirmed
        ? 'Operazione non consentita: evento completamente pagato.'
        : 'Operazione non consentita per lo stato corrente.';

  const canCancelEvent = ['proposed', 'pre-confirmed', 'confirmed'].includes(event.status);
  const cancelEventDisabledReason =
    event.status === 'ended'
      ? 'Operazione non consentita: evento già concluso.'
      : event.status === 'rejected'
        ? 'Operazione non consentita: evento già rifiutato.'
        : 'Operazione non consentita per lo stato corrente.';

  console.log('[EventPage] Payment Data:', {
    paymentStatus: paymentData?.paymentStatus,
    upfrontPaymentAmount: paymentData?.upfrontPaymentAmount,
    upfrontPaidAt: paymentData?.upfrontPaidAt,
    isAdmin,
    showPaymentButton: isAdmin && paymentData?.paymentStatus === 'upfront-required' && !paymentData?.upfrontPaidAt,
  });

  return (
    <div className='max-w-3xl space-y-6'>
      {/* Hosted Event Badge */}
      {event.hostedEvent && (
        <div className="flex justify-end">
          <span className="mb-2"><HostedEventBadge /></span>
        </div>
      )}
      <PaymentSuccessHandler eventId={resolvedEventId} />
      
      <div className='flex justify-between items-center gap-4'>
        <BackButton />
        {isAdmin && event.status === 'ended' && (
          <CreateRevisionDialog eventId={event.id} />
        )}
      </div>

      {/* Event Details Section */}
      <section className='bg-white p-6 rounded-2xl space-y-4'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4'>
          <div className='space-y-3'>
            <div className='text-xl font-bold'>{eventTitle}</div>
            <div className='flex flex-wrap gap-2'>
              <Link href={`/artisti/${event.artist.slug}`}>
                <Badge variant='secondary' className='cursor-pointer hover:bg-zinc-200 transition-colors'>
                  Artista: {artistLabel}
                </Badge>
              </Link>
              {event.artistManager && (
                <Link href={`/manager-artisti/${event.artistManager.id}`}>
                  <Badge variant='secondary' className='cursor-pointer hover:bg-zinc-200 transition-colors'>
                    Manager Artista: {event.artistManager.name} {event.artistManager.surname}
                  </Badge>
                </Link>
              )}
              <Link href={`/locali/${event.venue.slug}`}>
                <Badge variant='secondary' className='cursor-pointer hover:bg-zinc-200 transition-colors'>
                  Locale: {event.venue.name}
                </Badge>
              </Link>
              {event.venueManager && (
                <Link href={`/promoter-locali/${event.venueManager.id}`}>
                  <Badge variant='secondary' className='cursor-pointer hover:bg-zinc-200 transition-colors'>
                    Manager Locale: {event.venueManager.name} {event.venueManager.surname}
                  </Badge>
                </Link>
              )}
            </div>
          </div>
          <div className='flex items-center gap-2 flex-wrap'>
            <EventStatusBadge status={event.status} />
            {eventTypeLabel && <Badge variant='secondary'>{eventTypeLabel}</Badge>}
            {event.protocolNumber && <Badge variant='secondary'>Protocollo: {event.protocolNumber}</Badge>}
            {typeof event.revisionNumber === 'number' && (
              <Badge variant='outline'>Revisione v{event.revisionNumber}</Badge>
            )}
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

      {isAdmin && revisionHistory.length > 0 && (
        <RevisionHistoryPanel history={revisionHistory} currentEventId={event.id} />
      )}

      {canViewAccreditation && (
        <GuestParticipantSection
          eventId={event.id}
          initialGuests={eventGuests}
          guestLimit={event.guestLimit ?? 50}
          isAdmin={isAdmin}
        />
      )}

      {hasRole(user, ['admin', 'artist-manager']) && (
        <ProfessionalsSection
          eventId={event.id}
          professionals={eventProfessionals}
          allProfessionals={allProfessionals}
          isAdmin={isAdmin}
        />
      )}

      {event.status === 'ended' && (
        <section className='bg-white p-6 rounded-2xl space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-bold'>Report evento</h2>
            {eventSummaryDoc && (
              <a
                href={eventSummaryDoc.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-sm text-blue-600 hover:underline'
              >
                Scarica PDF
              </a>
            )}
          </div>
          <Separator />
          {eventSummaryDoc ? (
            <div className='text-sm text-zinc-600'>
              {eventSummaryDoc.name}
              {eventSummaryDoc.uploadedAt ? ` · ${eventSummaryDoc.uploadedAt}` : ''}
            </div>
          ) : (
            <div className='text-sm text-zinc-500'>PDF non disponibile.</div>
          )}
        </section>
      )}

      {/* Contract Status Section */}
      <section className='bg-white p-6 rounded-2xl space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-bold'>Contratto</h2>
          {isAdmin && contractData?.envelopeId && contractData.status !== 'signed' && (
            <SyncContractButton
              contractId={contractData.id}
              envelopeId={contractData.envelopeId}
              eventId={event.id}
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
                href={
                  getContractPreviewUrl(contractData.fileUrl, `${eventTitle}.pdf`) ||
                  contractData.fileUrl
                }
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
                      eventId={event.id}
                      paymentType='upfront'
                      amount={paymentData.upfrontPaymentAmount ? parseFloat(paymentData.upfrontPaymentAmount) : 0}
                      eventTitle={`Evento #${event.id}`}
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
                          eventId={event.id}
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
                      eventId={event.id}
                      paymentType='final-balance'
                      amount={paymentData.finalBalanceAmount ? parseFloat(paymentData.finalBalanceAmount) : 0}
                      eventTitle={`Evento #${event.id}`}
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
                          eventId={event.id}
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

      {isCancelled && (
        <section className='bg-white p-6 rounded-2xl space-y-4 border border-amber-100'>
          <div className='flex items-center justify-between gap-3'>
            <h2 className='text-lg font-bold text-amber-700'>Annullamento evento</h2>
            <EventStatusBadge status={event.status} size='sm' />
          </div>
          <Separator />
          <div className='grid grid-cols-[minmax(180px,max-content)_1fr] gap-3 text-sm'>
            <span className='font-semibold text-zinc-600'>Richiedente</span>
            <span className='font-medium text-zinc-500'>
              {event.cancellationRequestedBy
                ? CANCELLATION_REQUESTED_BY_LABELS[event.cancellationRequestedBy] ??
                  event.cancellationRequestedBy
                : '-'}
            </span>
            <span className='font-semibold text-zinc-600'>Tipo annullamento</span>
            <span className='font-medium text-zinc-500'>
              {event.cancellationType
                ? CANCELLATION_TYPE_LABELS[event.cancellationType] ?? event.cancellationType
                : '-'}
            </span>
            <span className='font-semibold text-zinc-600'>Data annullamento</span>
            <span className='font-medium text-zinc-500'>
              {formatDateTime(event.cancellationAt)}
            </span>
            <span className='font-semibold text-zinc-600'>Utente</span>
            <span className='font-medium text-zinc-500'>
              {event.cancellationUserId ?? '-'}
              {event.cancellationUserRole
                ? ` (${ROLE_LABELS[event.cancellationUserRole] ?? event.cancellationUserRole})`
                : ''}
            </span>
          </div>

          {event.cancellationNotes && (
            <div className='space-y-1'>
              <div className='text-sm font-semibold text-zinc-600'>Motivazione</div>
              <div className='text-sm text-zinc-500 whitespace-pre-line'>
                {event.cancellationNotes}
              </div>
            </div>
          )}

          {event.cancellationType === 'peaceful' && (
            <div className='rounded-lg border border-zinc-200 p-3 space-y-2'>
              <div className='flex items-center justify-between gap-3'>
                <div className='space-y-1'>
                  <div className='text-sm font-semibold'>
                    Storno fattura e aggiornamento contabile completati
                  </div>
                  {event.cancellationAccountingCompletedAt && (
                    <div className='text-xs text-zinc-500'>
                      Completato il {formatDateTime(event.cancellationAccountingCompletedAt)}
                    </div>
                  )}
                </div>
                <CancellationAccountingToggle
                  eventId={event.id}
                  initialCompleted={Boolean(event.cancellationAccountingCompleted)}
                  disabled={!isAdmin}
                />
              </div>
              {!isAdmin && (
                <p className='text-xs text-zinc-500'>
                  Solo admin può aggiornare lo stato contabile.
                </p>
              )}
            </div>
          )}

          {event.cancellationType === 'legal-dispute' && (
            <div className='rounded-lg border border-orange-200 bg-orange-50/50 p-3 space-y-2 text-sm'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='flex flex-wrap items-center gap-2'>
                  <Badge variant='secondary'>In contestazione legale</Badge>
                  <span className='text-zinc-600'>
                    {event.cancellationLegalEmailSentAt
                      ? `Email legale inviata il ${formatDateTime(event.cancellationLegalEmailSentAt)}`
                      : 'Email legale non ancora inviata.'}
                  </span>
                </div>
                {isAdmin && !event.cancellationLegalEmailSentAt && (
                  <RetryLegalDisputeEmailButton eventId={event.id} />
                )}
              </div>
              {event.cancellationLegalEmailTo && (
                <div className='text-xs text-zinc-500'>
                  Destinatari: {event.cancellationLegalEmailTo}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {isAdmin && !isCancelled && (
        <section className='bg-white p-6 rounded-2xl space-y-3 border border-amber-100'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <h2 className='text-lg font-bold text-amber-700'>Annullamento evento</h2>
            <CancelEventButton
              eventId={event.id}
              eventTitle={eventTitle}
              disabled={!canCancelEvent}
              disabledReason={cancelEventDisabledReason}
            />
          </div>
          <p className='text-sm text-zinc-500'>
            Registra un annullamento specificando il richiedente, il tipo e la motivazione.
            L&apos;operazione è riservata agli admin.
          </p>
        </section>
      )}

      {isAdmin && (
        <section className='bg-white p-6 rounded-2xl space-y-3 border border-red-100'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <h2 className='text-lg font-bold text-red-600'>Rimozione locale approvato</h2>
            <RemoveApprovedVenueButton
              eventId={event.id}
              eventTitle={eventTitle}
              venueName={event.venue.name}
              canRemove={canRemoveVenue}
              disabledReason={removeVenueDisabledReason}
            />
          </div>
          <p className='text-sm text-zinc-500'>
            Usa questa azione per rimuovere il locale prima della conferma finale. Il motivo della
            rimozione e gli aggiornamenti del contratto verranno registrati nel log evento.
          </p>
        </section>
      )}
    </div>
  );
}
