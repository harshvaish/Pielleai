/**
 * Event Timeline Utilities
 * Generates timeline from event status and payment timestamps
 */

export type TimelineEventType =
  | 'event-proposed'
  | 'event-pre-confirmed'
  | 'event-confirmed'
  | 'event-rejected'
  | 'event-ended'
  | 'contract-signed'
  | 'payment-pending'
  | 'upfront-required'
  | 'upfront-paid'
  | 'balance-required'
  | 'balance-paid'
  | 'fully-paid'
  | 'payment-expired';

export interface TimelineEvent {
  type: TimelineEventType;
  timestamp: Date;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
}

interface EventTimestamps {
  // Event status timestamps
  proposedAt?: Date | string | null;
  preConfirmedAt?: Date | string | null;
  confirmedAt?: Date | string | null;
  rejectedAt?: Date | string | null;
  endedAt?: Date | string | null;
  
  // Payment timestamps
  paymentPendingAt?: Date | string | null;
  upfrontRequiredAt?: Date | string | null;
  upfrontPaidAt?: Date | string | null;
  balanceRequiredAt?: Date | string | null;
  balancePaidAt?: Date | string | null;
  fullyPaidAt?: Date | string | null;
  paymentExpiredAt?: Date | string | null;
  
  // Contract
  contractSignedDate?: Date | string | null;
  
  // Payment details
  upfrontPaymentAmount?: number | string | null;
  upfrontPaymentMethod?: string | null;
  finalBalanceAmount?: number | string | null;
  finalBalanceMethod?: string | null;
}

/**
 * Generates a complete event timeline from all timestamps
 */
export function generateEventTimeline(timestamps: EventTimestamps): TimelineEvent[] {
  const timeline: TimelineEvent[] = [];

  // Event status events
  if (timestamps.proposedAt) {
    timeline.push({
      type: 'event-proposed',
      timestamp: new Date(timestamps.proposedAt),
      title: 'Evento proposto',
      description: 'L\'evento è stato creato e proposto',
    });
  }

  if (timestamps.preConfirmedAt) {
    timeline.push({
      type: 'event-pre-confirmed',
      timestamp: new Date(timestamps.preConfirmedAt),
      title: 'Evento pre-confermato',
      description: 'L\'evento è stato pre-confermato',
    });
  }

  if (timestamps.confirmedAt) {
    timeline.push({
      type: 'event-confirmed',
      timestamp: new Date(timestamps.confirmedAt),
      title: 'Evento confermato',
      description: 'L\'evento è stato definitivamente confermato',
    });
  }

  if (timestamps.rejectedAt) {
    timeline.push({
      type: 'event-rejected',
      timestamp: new Date(timestamps.rejectedAt),
      title: 'Evento rifiutato',
      description: 'L\'evento è stato rifiutato',
    });
  }

  if (timestamps.endedAt) {
    timeline.push({
      type: 'event-ended',
      timestamp: new Date(timestamps.endedAt),
      title: 'Evento terminato',
      description: 'L\'evento si è concluso',
    });
  }

  // Contract event
  if (timestamps.contractSignedDate) {
    timeline.push({
      type: 'contract-signed',
      timestamp: new Date(timestamps.contractSignedDate),
      title: 'Contratto firmato',
      description: 'Il contratto è stato firmato digitalmente o caricato',
    });
  }

  // Payment timeline events
  if (timestamps.paymentPendingAt) {
    timeline.push({
      type: 'payment-pending',
      timestamp: new Date(timestamps.paymentPendingAt),
      title: 'Pagamento in attesa',
      description: 'In attesa della firma del contratto per abilitare il pagamento',
    });
  }

  if (timestamps.upfrontRequiredAt) {
    timeline.push({
      type: 'upfront-required',
      timestamp: new Date(timestamps.upfrontRequiredAt),
      title: 'Acconto richiesto',
      description: `Acconto del 50% richiesto${timestamps.upfrontPaymentAmount ? ` (€${timestamps.upfrontPaymentAmount})` : ''}`,
      metadata: {
        amount: timestamps.upfrontPaymentAmount,
      },
    });
  }

  if (timestamps.upfrontPaidAt) {
    timeline.push({
      type: 'upfront-paid',
      timestamp: new Date(timestamps.upfrontPaidAt),
      title: 'Acconto ricevuto',
      description: `Acconto pagato tramite ${getPaymentMethodLabel(timestamps.upfrontPaymentMethod)}`,
      metadata: {
        amount: timestamps.upfrontPaymentAmount,
        method: timestamps.upfrontPaymentMethod,
      },
    });
  }

  if (timestamps.balanceRequiredAt) {
    timeline.push({
      type: 'balance-required',
      timestamp: new Date(timestamps.balanceRequiredAt),
      title: 'Saldo richiesto',
      description: `Saldo finale del 50% richiesto${timestamps.finalBalanceAmount ? ` (€${timestamps.finalBalanceAmount})` : ''}`,
      metadata: {
        amount: timestamps.finalBalanceAmount,
      },
    });
  }

  if (timestamps.balancePaidAt) {
    timeline.push({
      type: 'balance-paid',
      timestamp: new Date(timestamps.balancePaidAt),
      title: 'Saldo ricevuto',
      description: `Saldo finale pagato tramite ${getPaymentMethodLabel(timestamps.finalBalanceMethod)}`,
      metadata: {
        amount: timestamps.finalBalanceAmount,
        method: timestamps.finalBalanceMethod,
      },
    });
  }

  if (timestamps.fullyPaidAt) {
    timeline.push({
      type: 'fully-paid',
      timestamp: new Date(timestamps.fullyPaidAt),
      title: 'Pagamento completato',
      description: 'L\'evento è stato completamente pagato',
    });
  }

  if (timestamps.paymentExpiredAt) {
    timeline.push({
      type: 'payment-expired',
      timestamp: new Date(timestamps.paymentExpiredAt),
      title: 'Pagamento scaduto',
      description: 'La scadenza del pagamento è stata superata',
    });
  }

  // Sort timeline by timestamp (most recent first)
  return timeline.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Gets human-readable payment method label
 */
function getPaymentMethodLabel(method?: string | null): string {
  const labels: Record<string, string> = {
    'stripe': 'Stripe',
    'bank-transfer-sepa': 'Bonifico SEPA',
    'bank-transfer-instant': 'Bonifico istantaneo',
    'bank-transfer-other': 'Bonifico bancario',
    'cash': 'Contanti',
    'other': 'Altro',
  };
  return method ? labels[method] || method : 'metodo non specificato';
}

/**
 * Gets the most recent timeline event
 */
export function getLatestTimelineEvent(timeline: TimelineEvent[]): TimelineEvent | null {
  return timeline.length > 0 ? timeline[0] : null;
}

/**
 * Filters timeline by event type
 */
export function filterTimelineByType(
  timeline: TimelineEvent[],
  types: TimelineEventType[],
): TimelineEvent[] {
  return timeline.filter((event) => types.includes(event.type));
}

/**
 * Gets payment-related timeline events only
 */
export function getPaymentTimeline(timeline: TimelineEvent[]): TimelineEvent[] {
  const paymentTypes: TimelineEventType[] = [
    'payment-pending',
    'upfront-required',
    'upfront-paid',
    'balance-required',
    'balance-paid',
    'fully-paid',
    'payment-expired',
    'contract-signed',
  ];
  return filterTimelineByType(timeline, paymentTypes);
}

/**
 * Gets event status timeline events only
 */
export function getEventStatusTimeline(timeline: TimelineEvent[]): TimelineEvent[] {
  const statusTypes: TimelineEventType[] = [
    'event-proposed',
    'event-pre-confirmed',
    'event-confirmed',
    'event-rejected',
    'event-ended',
  ];
  return filterTimelineByType(timeline, statusTypes);
}
