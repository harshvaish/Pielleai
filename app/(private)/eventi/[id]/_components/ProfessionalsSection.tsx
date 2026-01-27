'use client';

import { useMemo, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Professional, ProfessionalRole, ProfessionalSelectData } from '@/lib/types';
import { updateEventProfessionals } from '@/lib/server-actions/events/update-event-professionals';
import { useRouter } from 'next/navigation';

const ROLE_LABELS: Record<ProfessionalRole, string> = {
  journalist: 'Giornalista',
  technician: 'Tecnico',
  photographer: 'Fotografo',
  backstage: 'Backstage',
  other: 'Altro',
};

type ProfessionalsSectionProps = {
  eventId: number;
  professionals: Professional[];
  allProfessionals: ProfessionalSelectData[];
  isAdmin: boolean;
};

export default function ProfessionalsSection({
  eventId,
  professionals,
  allProfessionals,
  isAdmin,
}: ProfessionalsSectionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>(
    professionals.map((professional) => professional.id),
  );
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const filteredProfessionals = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return allProfessionals;
    return allProfessionals.filter((professional) =>
      professional.fullName.toLowerCase().includes(term),
    );
  }, [allProfessionals, query]);

  const toggleProfessional = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    startTransition(async () => {
      const response = await updateEventProfessionals({
        eventId,
        professionalIds: selectedIds,
      });

      if (!response.success) {
        toast.error(response.message || 'Aggiornamento professionisti non riuscito.');
        return;
      }

      toast.success('Professionisti aggiornati.');
      setOpen(false);
      router.refresh();
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setSelectedIds(professionals.map((professional) => professional.id));
      setQuery('');
    }
  };

  return (
    <section className='bg-white p-6 rounded-2xl space-y-4'>
      <div className='flex items-center justify-between gap-3'>
        <h2 className='text-lg font-bold'>Professionisti</h2>
        {isAdmin && (
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button size='sm' variant='outline'>
                Gestisci professionisti
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl'>
              <DialogTitle>Gestione professionisti</DialogTitle>
              <DialogDescription>
                Seleziona i professionisti da associare o rimuovere dall'evento.
              </DialogDescription>
              <div className='space-y-4'>
                <Input
                  placeholder='Cerca professionisti'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className='max-h-64 overflow-y-auto space-y-2'>
                  {filteredProfessionals.length ? (
                    filteredProfessionals.map((professional) => (
                      <label
                        key={professional.id}
                        className='flex items-center gap-2 text-sm cursor-pointer'
                      >
                        <Checkbox
                          checked={selectedIds.includes(professional.id)}
                          onCheckedChange={() => toggleProfessional(professional.id)}
                        />
                        <span>{professional.fullName}</span>
                      </label>
                    ))
                  ) : (
                    <div className='text-xs text-zinc-400'>Nessun professionista trovato.</div>
                  )}
                </div>
                <div className='flex justify-end gap-2'>
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={() => setOpen(false)}
                    disabled={isPending}
                  >
                    Annulla
                  </Button>
                  <Button type='button' onClick={handleSave} disabled={isPending}>
                    {isPending ? 'Salvataggio...' : 'Salva'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {professionals.length ? (
        <div className='space-y-3'>
          {professionals.map((professional) => (
            <div key={professional.id} className='border rounded-xl p-3 text-sm space-y-1'>
              <div className='font-semibold text-zinc-900'>{professional.fullName}</div>
              <div className='text-xs text-zinc-500'>
                {ROLE_LABELS[professional.role]}
                {professional.role === 'other' && professional.roleDescription
                  ? ` • ${professional.roleDescription}`
                  : ''}
              </div>
              {(professional.email || professional.phone) && (
                <div className='text-xs text-zinc-500'>
                  {professional.email || '-'}
                  {professional.phone ? ` • ${professional.phone}` : ''}
                </div>
              )}
              {professional.competencies && (
                <div className='text-xs text-zinc-500'>
                  {professional.competencies}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className='text-sm text-zinc-500'>Nessun professionista associato.</div>
      )}
    </section>
  );
}
