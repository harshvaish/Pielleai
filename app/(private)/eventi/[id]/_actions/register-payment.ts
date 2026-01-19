'use server';

import { database } from '@/lib/database/connection';
import { events } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

type RegisterPaymentInput = {
  eventId: number;
  paymentType: 'upfront' | 'final-balance';
  amount: number;
  method: 'bank-transfer-sepa' | 'bank-transfer-instant' | 'bank-transfer-other' | 'cash' | 'stripe' | 'other';
  date: string;
  reference: string;
  sender: string;
  notes: string;
};

export async function registerPayment(input: RegisterPaymentInput) {
  try {
    const { eventId, paymentType, amount, method, date, reference, sender, notes } = input;

    if (amount <= 0) {
      return { success: false, message: 'Importo non valido' };
    }

    const paymentDate = new Date(date);

    if (paymentType === 'upfront') {
      // Register upfront payment
      await database
        .update(events)
        .set({
          paymentStatus: 'upfront-paid',
          upfrontPaymentAmount: amount.toString(),
          upfrontPaymentMethod: method,
          upfrontPaymentDate: paymentDate.toISOString(),
          upfrontPaymentReference: reference || null,
          upfrontPaymentSender: sender,
          upfrontPaymentNotes: notes || null,
          upfrontPaidAt: new Date().toISOString(),
          balanceRequiredAt: new Date().toISOString(),
        })
        .where(eq(events.id, eventId));
    } else {
      // Register final balance payment
      await database
        .update(events)
        .set({
          paymentStatus: 'fully-paid',
          finalBalanceAmount: amount.toString(),
          finalBalanceMethod: method,
          finalBalanceDate: paymentDate.toISOString(),
          finalBalanceReference: reference || null,
          finalBalanceSender: sender,
          finalBalanceNotes: notes || null,
          balancePaidAt: new Date().toISOString(),
          fullyPaidAt: new Date().toISOString(),
          status: 'confirmed',
          confirmedAt: new Date().toISOString(),
        })
        .where(eq(events.id, eventId));
    }

    revalidatePath(`/eventi/${eventId}`);

    return {
      success: true,
      message: paymentType === 'upfront' ? 'Acconto registrato' : 'Saldo registrato',
    };
  } catch (error) {
    console.error('[registerPayment] error:', error);
    return { success: false, message: 'Errore durante la registrazione del pagamento' };
  }
}
