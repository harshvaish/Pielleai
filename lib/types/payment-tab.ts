/**
 * Type definitions for Payment Tab data
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

export type PaymentMethod =
  | 'stripe'
  | 'bank-transfer-sepa'
  | 'bank-transfer-instant'
  | 'bank-transfer-other'
  | 'cash'
  | 'other';

export interface PaymentDocument {
  url: string;
  name: string;
}

export interface UpfrontPaymentData {
  amount: number | null;
  method: PaymentMethod | null;
  date: Date | null;
  reference: string | null;
  notes: string | null;
  sender: string | null;
  stripeId: string | null;
  invoice: PaymentDocument | null;
  confirmation: PaymentDocument | null;
}

export interface FinalBalancePaymentData {
  amount: number | null;
  method: PaymentMethod | null;
  date: Date | null;
  deadline: Date | null;
  reference: string | null;
  notes: string | null;
  sender: string | null;
  stripeId: string | null;
  invoice: PaymentDocument | null;
  confirmation: PaymentDocument | null;
}

export interface PaymentTabData {
  // Overall status
  status: PaymentStatus;
  
  // Upfront payment (50%)
  upfront: UpfrontPaymentData;
  
  // Final balance (50%)
  finalBalance: FinalBalancePaymentData;
  
  // Contract
  contractSigned: boolean;
  contractSignedDate: Date | null;
  contractDocumentUrl: string | null;
  
  // Stripe payment links
  upfrontPaymentLink: string | null;
  finalBalancePaymentLink: string | null;
  
  // Timestamps for status tracking
  timestamps: {
    paymentPendingAt: Date | null;
    upfrontRequiredAt: Date | null;
    upfrontPaidAt: Date | null;
    balanceRequiredAt: Date | null;
    balancePaidAt: Date | null;
    fullyPaidAt: Date | null;
    paymentExpiredAt: Date | null;
  };
}

/**
 * Helper to format payment method for display
 */
export function formatPaymentMethod(method: PaymentMethod | null): string {
  if (!method) return '-';
  
  const labels: Record<PaymentMethod, string> = {
    stripe: 'Stripe',
    'bank-transfer-sepa': 'Bonifico SEPA',
    'bank-transfer-instant': 'Bonifico Istantaneo',
    'bank-transfer-other': 'Bonifico Bancario',
    cash: 'Contanti',
    other: 'Altro',
  };
  
  return labels[method] || method;
}

/**
 * Helper to format payment status for display
 */
export function formatPaymentStatus(status: PaymentStatus): {
  label: string;
  color: 'default' | 'warning' | 'success' | 'error';
} {
  const statusMap: Record<
    PaymentStatus,
    { label: string; color: 'default' | 'warning' | 'success' | 'error' }
  > = {
    pending: { label: 'In Attesa', color: 'default' },
    'upfront-required': { label: 'Acconto Richiesto', color: 'warning' },
    'upfront-paid': { label: 'Acconto Ricevuto', color: 'success' },
    'balance-required': { label: 'Saldo Richiesto', color: 'warning' },
    'balance-paid': { label: 'Saldo Ricevuto', color: 'success' },
    'fully-paid': { label: 'Completamente Pagato', color: 'success' },
    expired: { label: 'Scaduto', color: 'error' },
    failed: { label: 'Fallito', color: 'error' },
  };
  
  return statusMap[status] || { label: status, color: 'default' };
}

/**
 * Helper to determine if upfront payment is allowed
 */
export function canMakeUpfrontPayment(data: PaymentTabData): boolean {
  return (
    data.contractSigned &&
    (data.status === 'upfront-required' || data.status === 'pending') &&
    !data.upfront.date
  );
}

/**
 * Helper to determine if final balance payment is allowed
 */
export function canMakeFinalBalancePayment(data: PaymentTabData): boolean {
  return (
    data.status === 'balance-required' &&
    !!data.upfront.date &&
    !data.finalBalance.date
  );
}

/**
 * Helper to check if payment is overdue
 */
export function isPaymentOverdue(deadline: Date | null): boolean {
  if (!deadline) return false;
  return new Date() > deadline;
}

/**
 * Helper to get days until deadline
 */
export function getDaysUntilDeadline(deadline: Date | null): number | null {
  if (!deadline) return null;
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
