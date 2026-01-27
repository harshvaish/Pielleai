'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Professional, ProfessionalListItem, ProfessionalRole } from '@/lib/types';
import { createProfessional } from '@/lib/server-actions/professionals/create-professional';
import { updateProfessional } from '@/lib/server-actions/professionals/update-professional';
import { deleteProfessional } from '@/lib/server-actions/professionals/delete-professional';

const ROLE_LABELS: Record<ProfessionalRole, string> = {
  journalist: 'Giornalista',
  technician: 'Tecnico',
  photographer: 'Fotografo',
  backstage: 'Backstage',
  other: 'Altro',
};

type ProfessionalsTableProps = {
  initialProfessionals: ProfessionalListItem[];
  isAdmin: boolean;
};

type ProfessionalFormState = {
  fullName: string;
  role: ProfessionalRole;
  roleDescription: string;
  email: string;
  phone: string;
  competencies: string;
};

const defaultFormState: ProfessionalFormState = {
  fullName: '',
  role: 'journalist',
  roleDescription: '',
  email: '',
  phone: '',
  competencies: '',
};

function EditProfessionalDialog({
  professional,
  isAdmin,
  onUpdated,
  onDeleted,
}: {
  professional: ProfessionalListItem;
  isAdmin: boolean;
  onUpdated: (updated: Professional) => void;
  onDeleted: (id: number) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<ProfessionalFormState>({
    fullName: professional.fullName,
    role: professional.role,
    roleDescription: professional.roleDescription ?? '',
    email: professional.email ?? '',
    phone: professional.phone ?? '',
    competencies: professional.competencies ?? '',
  });

  const handleSave = () => {
    startTransition(async () => {
      const response = await updateProfessional({
        professionalId: professional.id,
        fullName: formState.fullName,
        role: formState.role,
        roleDescription: formState.role === 'other' ? formState.roleDescription : null,
        email: formState.email || null,
        phone: formState.phone || null,
        competencies: formState.competencies || null,
      });

      if (!response.success || !response.data) {
        toast.error(response.message || 'Aggiornamento professionista non riuscito.');
        return;
      }

      onUpdated(response.data);
      toast.success('Professionista aggiornato.');
      setOpen(false);
      router.refresh();
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const response = await deleteProfessional({ professionalId: professional.id });
      if (!response.success) {
        toast.error(response.message || 'Eliminazione professionista non riuscita.');
        return;
      }
      toast.success('Professionista eliminato.');
      onDeleted(professional.id);
      setOpen(false);
      router.refresh();
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setFormState({
        fullName: professional.fullName,
        role: professional.role,
        roleDescription: professional.roleDescription ?? '',
        email: professional.email ?? '',
        phone: professional.phone ?? '',
        competencies: professional.competencies ?? '',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size='sm' variant='secondary' disabled={!isAdmin}>
          Modifica
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogTitle>Modifica professionista</DialogTitle>
        <DialogDescription>Aggiorna i dati del profilo professionale.</DialogDescription>
        <div className='grid gap-3'>
          <Input
            placeholder='Nome completo'
            value={formState.fullName}
            onChange={(e) => setFormState((prev) => ({ ...prev, fullName: e.target.value }))}
          />
          <Select
            value={formState.role}
            onValueChange={(value) =>
              setFormState((prev) => ({ ...prev, role: value as ProfessionalRole }))
            }
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
          {formState.role === 'other' && (
            <Input
              placeholder='Descrizione ruolo'
              value={formState.roleDescription}
              onChange={(e) => setFormState((prev) => ({ ...prev, roleDescription: e.target.value }))}
            />
          )}
          <Input
            type='email'
            placeholder='Email'
            value={formState.email}
            onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
          />
          <Input
            placeholder='Telefono'
            value={formState.phone}
            onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <Input
            placeholder='Competenze / certificazioni'
            value={formState.competencies}
            onChange={(e) => setFormState((prev) => ({ ...prev, competencies: e.target.value }))}
          />
          <div className='flex justify-between gap-2'>
            <Button variant='ghost' onClick={handleDelete} disabled={isPending}>
              Elimina
            </Button>
            <div className='flex gap-2'>
              <Button variant='ghost' onClick={() => setOpen(false)} disabled={isPending}>
                Annulla
              </Button>
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? 'Salvataggio...' : 'Salva'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProfessionalsTable({ initialProfessionals, isAdmin }: ProfessionalsTableProps) {
  const router = useRouter();
  const [professionals, setProfessionals] = useState<ProfessionalListItem[]>(initialProfessionals);
  const [formState, setFormState] = useState<ProfessionalFormState>(defaultFormState);
  const [isPending, startTransition] = useTransition();

  const canCreate = isAdmin;

  const handleCreate = () => {
    if (!formState.fullName.trim()) {
      toast.error('Inserisci un nome valido.');
      return;
    }

    startTransition(async () => {
      const response = await createProfessional({
        fullName: formState.fullName,
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

      setProfessionals((prev) => [
        {
          ...response.data,
          eventCount: 0,
        },
        ...prev,
      ]);
      setFormState(defaultFormState);
      toast.success('Professionista creato.');
      router.refresh();
    });
  };

  const handleUpdated = (updated: Professional) => {
    setProfessionals((prev) =>
      prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
    );
  };

  const handleDeleted = (id: number) => {
    setProfessionals((prev) => prev.filter((item) => item.id !== id));
  };

  const rows = useMemo(() => professionals, [professionals]);

  return (
    <div className='space-y-4'>
      {canCreate && (
        <div className='space-y-3'>
          <div className='grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-3'>
            <Input
              placeholder='Nome completo'
              value={formState.fullName}
              onChange={(e) => setFormState((prev) => ({ ...prev, fullName: e.target.value }))}
            />
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
            <Input
              type='email'
              placeholder='Email'
              value={formState.email}
              onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
            />
            <Button onClick={handleCreate} disabled={isPending}>
              Aggiungi
            </Button>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
            <Input
              placeholder='Telefono'
              value={formState.phone}
              onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
            />
            {formState.role === 'other' && (
              <Input
                placeholder='Descrizione ruolo'
                value={formState.roleDescription}
                onChange={(e) => setFormState((prev) => ({ ...prev, roleDescription: e.target.value }))}
              />
            )}
            <Input
              placeholder='Competenze / certificazioni'
              value={formState.competencies}
              onChange={(e) => setFormState((prev) => ({ ...prev, competencies: e.target.value }))}
            />
          </div>
        </div>
      )}

      <div className='border rounded-2xl overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Ruolo</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefono</TableHead>
              <TableHead className='w-28 text-right'>Eventi</TableHead>
              <TableHead className='w-32'>Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((professional) => (
                <TableRow key={professional.id}>
                  <TableCell className='font-medium'>
                    <Link href={`/professionisti/${professional.id}`} className='hover:underline'>
                      {professional.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {ROLE_LABELS[professional.role]}
                    {professional.role === 'other' && professional.roleDescription
                      ? ` (${professional.roleDescription})`
                      : ''}
                  </TableCell>
                  <TableCell>{professional.email || '-'}</TableCell>
                  <TableCell>{professional.phone || '-'}</TableCell>
                  <TableCell className='text-right tabular-nums'>{professional.eventCount}</TableCell>
                  <TableCell>
                    <EditProfessionalDialog
                      professional={professional}
                      isAdmin={isAdmin}
                      onUpdated={handleUpdated}
                      onDeleted={handleDeleted}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='text-center text-sm text-zinc-500 py-6'>
                  Nessun professionista disponibile.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
