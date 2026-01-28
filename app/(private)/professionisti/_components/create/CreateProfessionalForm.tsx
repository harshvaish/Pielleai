'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfessionalRole } from '@/lib/types';
import { createProfessional } from '@/lib/server-actions/professionals/create-professional';

const ROLE_LABELS: Record<ProfessionalRole, string> = {
  journalist: 'Giornalista',
  technician: 'Tecnico',
  photographer: 'Fotografo',
  backstage: 'Backstage',
  other: 'Altro',
};

type CreateProfessionalFormProps = {
  closeDialog: () => void;
};

type FormState = {
  fullName: string;
  role: ProfessionalRole;
  roleDescription: string;
  email: string;
  phone: string;
  competencies: string;
};

const defaultFormState: FormState = {
  fullName: '',
  role: 'journalist',
  roleDescription: '',
  email: '',
  phone: '',
  competencies: '',
};

export default function CreateProfessionalForm({ closeDialog }: CreateProfessionalFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const handleSubmit = () => {
    startTransition(async () => {
      const response = await createProfessional({
        fullName: formState.fullName.trim(),
        role: formState.role,
        roleDescription: formState.role === 'other' ? formState.roleDescription : null,
        email: formState.email || null,
        phone: formState.phone || null,
        competencies: formState.competencies || null,
      });

      if (!response.success || !response.data) {
        toast.error(response.message || 'Creazione professionista non riuscita.');
        return;
      }

      toast.success('Professionista creato.');
      setFormState(defaultFormState);
      closeDialog();
      router.refresh();
    });
  };

  return (
    <div className='grid gap-4'>
      <div className='grid gap-2'>
        <label className='text-sm font-semibold'>Nome completo</label>
        <Input
          placeholder='Nome completo'
          value={formState.fullName}
          onChange={(e) => setFormState((prev) => ({ ...prev, fullName: e.target.value }))}
        />
      </div>

      <div className='grid gap-2'>
        <label className='text-sm font-semibold'>Ruolo</label>
        <Select
          value={formState.role}
          onValueChange={(value) => setFormState((prev) => ({ ...prev, role: value as ProfessionalRole }))}
        >
          <SelectTrigger>
            <SelectValue placeholder='Ruolo' />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formState.role === 'other' && (
        <div className='grid gap-2'>
          <label className='text-sm font-semibold'>Descrizione ruolo</label>
          <Input
            placeholder='Descrizione ruolo'
            value={formState.roleDescription}
            onChange={(e) => setFormState((prev) => ({ ...prev, roleDescription: e.target.value }))}
          />
        </div>
      )}

      <div className='grid gap-2'>
        <label className='text-sm font-semibold'>Email</label>
        <Input
          type='email'
          placeholder='Email'
          value={formState.email}
          onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
        />
      </div>

      <div className='grid gap-2'>
        <label className='text-sm font-semibold'>Telefono</label>
        <Input
          placeholder='Telefono'
          value={formState.phone}
          onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
        />
      </div>

      <div className='grid gap-2'>
        <label className='text-sm font-semibold'>Competenze / certificazioni</label>
        <Input
          placeholder='Competenze / certificazioni'
          value={formState.competencies}
          onChange={(e) => setFormState((prev) => ({ ...prev, competencies: e.target.value }))}
        />
      </div>

      <div className='flex justify-end gap-2 pt-2'>
        <Button variant='ghost' onClick={closeDialog} disabled={isPending}>
          Annulla
        </Button>
         <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? 'Salvataggio...' : 'Salva'}
        </Button>
      </div>
    </div>
  );
}
