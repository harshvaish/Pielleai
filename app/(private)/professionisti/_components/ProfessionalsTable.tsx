'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Professional, ProfessionalListItem, ProfessionalRole } from '@/lib/types';
import { updateProfessional } from '@/lib/server-actions/professionals/update-professional';
import { deleteProfessional } from '@/lib/server-actions/professionals/delete-professional';
import StatusBadge from '@/app/(private)/_components/Badges/StatusBadge';
import UserBadge from '@/app/(private)/_components/Badges/UserBadge';
import { AVATAR_FALLBACK, NEW_USER_TIME } from '@/lib/constants';

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
  const [professionals, setProfessionals] = useState<ProfessionalListItem[]>(initialProfessionals);

  useEffect(() => {
    setProfessionals(initialProfessionals);
  }, [initialProfessionals]);

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
    <div className='border rounded-2xl overflow-hidden bg-white'>
      <Table className='w-full min-w-max table-fixed'>
        <TableHeader className='bg-zinc-50'>
          <TableRow>
            <TableHead className='w-60'>Nome</TableHead>
            <TableHead className='w-36'>Ruolo</TableHead>
            <TableHead className='w-44'>Email</TableHead>
            <TableHead className='w-36'>Telefono</TableHead>
            <TableHead className='w-48 truncate' title='Competenze / Certificazioni'>
              Competenze / Certificazioni
            </TableHead>
            <TableHead className='w-20 text-center'>Eventi</TableHead>
            <TableHead className='w-32'>Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((professional) => {
              const isNew =
                new Date().getTime() - new Date(professional.createdAt).getTime() < NEW_USER_TIME;
              return (
                <TableRow key={professional.id}>
                  <TableCell className='font-medium overflow-hidden'>
                    <div className='flex items-center flex-nowrap gap-3 min-w-0'>
                      <UserBadge
                        name={professional.fullName || '—'}
                        surname={''}
                        avatarUrl={AVATAR_FALLBACK}
                        isDisabled={false}
                        href={`/professionisti/${professional.id}`}
                        className='min-w-0 max-w-full'
                      />
                      {isNew && <StatusBadge status='new' />}
                    </div>
                  </TableCell>
                  <TableCell
                    className='truncate'
                    title={
                      professional.role === 'other' && professional.roleDescription
                        ? `${ROLE_LABELS[professional.role]} (${professional.roleDescription})`
                        : ROLE_LABELS[professional.role]
                    }
                  >
                    {ROLE_LABELS[professional.role]}
                    {professional.role === 'other' && professional.roleDescription
                      ? ` (${professional.roleDescription})`
                      : ''}
                  </TableCell>
                  <TableCell className='truncate' title={professional.email ?? undefined}>
                    {professional.email || '-'}
                  </TableCell>
                  <TableCell className='truncate' title={professional.phone ?? undefined}>
                    {professional.phone || '-'}
                  </TableCell>
                  <TableCell className='truncate' title={professional.competencies ?? undefined}>
                    {professional.competencies || '-'}
                  </TableCell>
                  <TableCell className='text-center tabular-nums'>
                    {professional.eventCount}
                  </TableCell>
                  <TableCell>
                    <EditProfessionalDialog
                      professional={professional}
                      isAdmin={isAdmin}
                      onUpdated={handleUpdated}
                      onDeleted={handleDeleted}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className='text-center text-sm text-zinc-500 py-6'>
                Nessun professionista disponibile.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
