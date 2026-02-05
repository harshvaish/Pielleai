import { addDays, isBefore } from 'date-fns';

/**
 * Payment flow utility functions for managing event payments
 */

export type PaymentStatus =
  | 'pending'
  | 'upfront-required'
  | 'upfront-paid'
  | 'balance-required'
  | 'balance-paid'
  | 'fully-paid'
  | 'expired'
  | 'failed';

/**
 * Determines if upfront payment can be activated for an event
 * Rule: Contract must be signed (digitally or manually uploaded)
 */
export function canActivateUpfrontPayment(
  contractSigned: boolean,
  contractDocumentUrl?: string | null,
  contractSignedDate?: Date | string | null,
): boolean {
  return contractSigned || !!contractDocumentUrl || !!contractSignedDate;
}

/**
 * Determines if final balance payment can be activated
 * Rule: Upfront payment must be completed
 */
export function canActivateFinalBalance(
  upfrontPaymentDate?: Date | string | null,
  upfrontPaymentAmount?: number | string | null,
): boolean {
  return !!upfrontPaymentDate && !!upfrontPaymentAmount;
}

/**
 * Calculates the final balance payment deadline
 * Default: 30 days before event start date
 * Can be overridden manually by admin
 */
export function calculateFinalBalanceDeadline(
  eventStartDate: Date,
  daysBeforeEvent: number = 30,
): Date {
  return addDays(eventStartDate, -daysBeforeEvent);
}

/**
 * Checks if a payment deadline has expired
 */
export function isPaymentExpired(deadline: Date): boolean {
  return isBefore(deadline, new Date());
}

/**
 * Determines the next payment status based on current state and actions
 */
export function getNextPaymentStatus(
  currentStatus: PaymentStatus,
  action: 'contract-signed' | 'upfront-paid' | 'balance-paid' | 'deadline-expired',
): PaymentStatus {
  switch (action) {
    case 'contract-signed':
      if (currentStatus === 'pending') {
        return 'upfront-required';
      }
      break;

    case 'upfront-paid':
      if (currentStatus === 'upfront-required' || currentStatus === 'pending') {
        return 'balance-required';
      }
      break;

    case 'balance-paid':
      if (currentStatus === 'balance-required') {
        return 'fully-paid';
      }
      break;

    case 'deadline-expired':
      return 'expired';
  }

  return currentStatus;
}

/**
 * Calculates upfront payment amount (50% of total)
 */
export function calculateUpfrontAmount(totalCost: number): number {
  return totalCost * 0.5;
}

/**
 * Calculates final balance amount (remaining 50%)
 */
export function calculateFinalBalanceAmount(totalCost: number, upfrontPaid: number): number {
  return totalCost - upfrontPaid;
}

/**
 * Validates that upfront payment is approximately 50% of total
 * Allows small variance for rounding
 */
export function validateUpfrontAmount(
  upfrontAmount: number,
  totalCost: number,
  tolerancePercent: number = 1,
): boolean {
  const expectedUpfront = totalCost * 0.5;
  const tolerance = totalCost * (tolerancePercent / 100);
  return Math.abs(upfrontAmount - expectedUpfront) <= tolerance;
}

/**
 * Validates that total payments match total cost
 */
export function validateTotalPayments(
  upfrontAmount: number,
  finalBalanceAmount: number,
  totalCost: number,
  tolerancePercent: number = 1,
): boolean {
  const totalPaid = upfrontAmount + finalBalanceAmount;
  const tolerance = totalCost * (tolerancePercent / 100);
  return Math.abs(totalPaid - totalCost) <= tolerance;
}

/**
 * Gets human-readable payment status message
 */
export function getPaymentStatusMessage(status: PaymentStatus): string {
  const messages: Record<PaymentStatus, string> = {
    pending: 'In attesa del contratto',
    'upfront-required': 'Acconto richiesto (50%)',
    'upfront-paid': 'Acconto ricevuto',
    'balance-required': 'Saldo richiesto (50%)',
    'balance-paid': 'Saldo ricevuto',
    'fully-paid': 'Pagamento completato',
    expired: 'Scaduto',
    failed: 'Pagamento fallito',
  };
  return messages[status] || status;
}

/**
 * Gets the timestamp field name for a payment status
 */
export function getPaymentStatusTimestampField(status: PaymentStatus): string {
  const fields: Record<PaymentStatus, string> = {
    pending: 'paymentPendingAt',
    'upfront-required': 'upfrontRequiredAt',
    'upfront-paid': 'upfrontPaidAt',
    'balance-required': 'balanceRequiredAt',
    'balance-paid': 'balancePaidAt',
    'fully-paid': 'fullyPaidAt',
    expired: 'paymentExpiredAt',
    failed: 'paymentExpiredAt',
  };
  return fields[status] || '';
}

/**
 * Creates timestamp updates for payment status transitions
 */
export function createPaymentStatusTimestamps(
  newStatus: PaymentStatus,
): Record<string, Date | null> {
  const now = new Date();
  const updates: Record<string, Date | null> = {};

  switch (newStatus) {
    case 'upfront-required':
      updates.upfrontRequiredAt = now;
      break;
    case 'upfront-paid':
      updates.upfrontPaidAt = now;
      break;
    case 'balance-required':
      updates.balanceRequiredAt = now;
      break;
    case 'balance-paid':
      updates.balancePaidAt = now;
      break;
    case 'fully-paid':
      updates.fullyPaidAt = now;
      break;
    case 'expired':
      updates.paymentExpiredAt = now;
      break;
  }

  return updates;
}

/**
 * Creates timestamp updates for event status transitions
 */
export function createEventStatusTimestamps(
  newStatus:
    | 'proposed'
    | 'pre-confirmed'
    | 'confirmed'
    | 'rejected'
    | 'ended'
    | 'cancelled'
    | 'in-dispute',
): Record<string, Date | null> {
  const now = new Date();
  const updates: Record<string, Date | null> = {};

  switch (newStatus) {
    case 'proposed':
      updates.proposedAt = now;
      break;
    case 'pre-confirmed':
      updates.preConfirmedAt = now;
      break;
    case 'confirmed':
      updates.confirmedAt = now;
      break;
    case 'rejected':
      updates.rejectedAt = now;
      break;
    case 'ended':
      updates.endedAt = now;
      break;
    case 'cancelled':
    case 'in-dispute':
      break;
  }

  return updates;
}
