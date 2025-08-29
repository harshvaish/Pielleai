'use client';

import { Button } from '@/components/ui/button';
import { EventsTableFilters } from '@/lib/types';
import { useState, useTransition } from 'react';
import ResponsivePopover from '@/app/_components/ResponsivePopover';
import { Download, Info, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

type ExportButtonProps = {
  filters: EventsTableFilters;
};

export default function ExportButton({ filters }: ExportButtonProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const active = Boolean(
    filters.status.length ||
      filters.artistIds.length ||
      filters.artistManagerIds.length ||
      filters.venueIds.length ||
      (filters.startDate && filters.endDate),
  );

  const onClickHandler = async () => {
    startTransition(async () => {
      try {
        const fetchReponse = await fetch('/api/events/export', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/csv',
          },
          body: JSON.stringify({
            s: filters.status,
            a: filters.artistIds,
            m: filters.artistManagerIds,
            v: filters.venueIds,
            sd: filters.startDate,
            ed: filters.endDate,
          }),
        });

        if (!fetchReponse.ok) {
          const response = await fetchReponse.json();
          toast.error(response.message || "Errore durante l'esportazione");
          return;
        }

        const blob = await fetchReponse.blob();
        saveAs(blob, `export-eventi.csv`);
        setOpen(false);
      } catch {
        toast.error('Esportazione dati non riuscita.');
      }
    });
  };

  return (
    <ResponsivePopover
      open={open}
      onOpenChange={setOpen}
      title='Esporta'
      description='Scarica tutti gli eventi presenti in piattaforma.'
      isDescriptionHidden={true}
      trigger={
        <Button
          variant={'outline'}
          size='sm'
          disabled={isPending}
        >
          <Download className={isPending ? 'animate-spin' : ''} />
          Esporta
        </Button>
      }
    >
      <div className='flex items-center gap-4 bg-zinc-50 my-4 p-4 rounded-md'>
        {active ? (
          <>
            <TriangleAlert className='size-6 text-destructive' />
            <span className='text-sm text-zinc-500'>
              La pagina corrente presenta dei filtri attivi, saranno applicati anche ai dati
              esportati.
            </span>
          </>
        ) : (
          <>
            <Info className='size-6 text-blue-600' />
            <span className='text-sm text-zinc-500'>
              Se vuoi filtrare i dati esportati applica dei filtri alla pagina prima di confermare.
            </span>
          </>
        )}
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <Button
          size='sm'
          variant='ghost'
          disabled={isPending}
          onClick={() => setOpen(false)}
        >
          Annulla
        </Button>
        <Button
          size='sm'
          disabled={isPending}
          onClick={onClickHandler}
        >
          {isPending ? 'Esporto...' : 'Conferma'}
        </Button>
      </div>
    </ResponsivePopover>
  );
}
