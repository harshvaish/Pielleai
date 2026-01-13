'use client';

import { useState, useTransition } from 'react';
import { Download, Info } from 'lucide-react';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import ResponsivePopover from '@/app/_components/ResponsivePopover';

type ExportButtonProps = {
  endpoint: string;
  filename: string;
  label?: string;
  description?: string;
};

export default function ExportButton({
  endpoint,
  filename,
  label = 'Esporta',
  description = 'Scarica tutti i record presenti in piattaforma.',
}: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onClickHandler = async () => {
    startTransition(async () => {
      try {
        const fetchReponse = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Accept': 'text/csv',
          },
        });

        if (!fetchReponse.ok) {
          const response = await fetchReponse.json().catch(() => null);
          toast.error(response?.message || "Errore durante l'esportazione");
          return;
        }

        const blob = await fetchReponse.blob();
        saveAs(blob, filename);
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
      title={label}
      description={description}
      isDescriptionHidden={true}
      trigger={
        <Button
          variant='outline'
          size='sm'
          disabled={isPending}
        >
          <Download className={isPending ? 'animate-spin' : ''} />
          {label}
        </Button>
      }
    >
      <div className='flex items-center gap-4 bg-zinc-50 my-4 p-4 rounded-md'>
        <Info className='size-6 text-blue-600' />
        <span className='text-sm text-zinc-500'>{description}</span>
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
