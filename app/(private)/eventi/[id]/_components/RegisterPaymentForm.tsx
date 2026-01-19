'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { registerPayment } from '../_actions/register-payment';

type PaymentType = 'upfront' | 'final-balance';

type RegisterPaymentFormProps = {
  eventId: number;
  paymentType: PaymentType;
  expectedAmount?: number;
  onSuccess?: () => void;
};

export default function RegisterPaymentForm({
  eventId,
  paymentType,
  expectedAmount,
  onSuccess,
}: RegisterPaymentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    amount: expectedAmount?.toString() || '',
    method: '',
    date: new Date().toISOString().split('T')[0],
    reference: '',
    sender: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.method || !formData.date || !formData.sender) {
      toast.error('Compila tutti i campi obbligatori');
      return;
    }

    startTransition(async () => {
      const result = await registerPayment({
        eventId,
        paymentType,
        amount: parseFloat(formData.amount),
        method: formData.method as any,
        date: formData.date,
        reference: formData.reference,
        sender: formData.sender,
        notes: formData.notes,
      });

      if (result.success) {
        toast.success('Pagamento registrato con successo');
        onSuccess?.();
      } else {
        toast.error(result.message || 'Errore durante la registrazione');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 p-4 border rounded-lg bg-zinc-50'>
      <h3 className='font-semibold text-sm'>
        Registra {paymentType === 'upfront' ? 'Acconto' : 'Saldo Finale'}
      </h3>

      <div className='grid grid-cols-2 gap-3'>
        {/* Amount */}
        <div>
          <label className='text-xs font-medium text-zinc-600'>Importo (€) *</label>
          <Input
            type='number'
            step='0.01'
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder='150.00'
            required
            disabled={isPending}
          />
        </div>

        {/* Method */}
        <div>
          <label className='text-xs font-medium text-zinc-600'>Metodo *</label>
          <Select
            value={formData.method}
            onValueChange={(value) => setFormData({ ...formData, method: value })}
            disabled={isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder='Seleziona...' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='bank-transfer-sepa'>Bonifico SEPA</SelectItem>
              <SelectItem value='bank-transfer-instant'>Bonifico Istantaneo</SelectItem>
              <SelectItem value='bank-transfer-other'>Bonifico Altro</SelectItem>
              <SelectItem value='cash'>Contanti</SelectItem>
              <SelectItem value='other'>Altro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div>
          <label className='text-xs font-medium text-zinc-600'>Data *</label>
          <Input
            type='date'
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            disabled={isPending}
          />
        </div>

        {/* Sender */}
        <div>
          <label className='text-xs font-medium text-zinc-600'>Mittente *</label>
          <Input
            type='text'
            value={formData.sender}
            onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
            placeholder='Nome locale/artista'
            required
            disabled={isPending}
          />
        </div>

        {/* Reference */}
        <div className='col-span-2'>
          <label className='text-xs font-medium text-zinc-600'>Riferimento CRO/TRN</label>
          <Input
            type='text'
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            placeholder='CRO123456789'
            disabled={isPending}
          />
        </div>

        {/* Notes */}
        <div className='col-span-2'>
          <label className='text-xs font-medium text-zinc-600'>Note</label>
          <Input
            type='text'
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder='Note opzionali'
            disabled={isPending}
          />
        </div>
      </div>

      <Button type='submit' disabled={isPending} className='w-full'>
        {isPending ? 'Salvataggio...' : 'Registra Pagamento'}
      </Button>
    </form>
  );
}
