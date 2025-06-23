'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Loader, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
// import CreateArtistManagerForm from './CreateArtistManagerForm';

export default function CreateArtistManagerButton() {
  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button size='sm'>
          <Plus />
          Aggiungi manager artista
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[94dvh] sm:max-w-2xl grid grid-rows-[auto_1fr] pt-12'>
        <DialogTitle className='hidden'>
          Form per creazione nuovo manager artista
        </DialogTitle>
        <DialogDescription className='hidden'>
          Inserisci tutti i dati necessari alla creazione del profilo.
        </DialogDescription>
        {/* form step section */}
        <section className='grid grid-cols-5 justify-items-center gap-4 bg-zinc-50 p-4 rounded-xl'>
          {/* step 1 */}
          <div className='flex flex-col items-center gap-2'>
            <div className='w-6 h-6 flex justify-center items-center bg-black rounded-sm'>
              <Loader
                size={16}
                className='text-white'
              />
            </div>
            <div className='text-[10px] font-medium text-zinc-400'>FASE 1</div>
            <div className='text-xs font-semibold text-center'>
              Dati personali
            </div>
          </div>
          <Separator className='self-center' />
          {/* step 2 */}
          <div className='flex flex-col items-center gap-2'>
            <div className='w-6 h-6 flex justify-center items-center bg-zinc-200 rounded-sm'>
              <div className='w-2 h-2 bg-zinc-400 rounded-full'></div>
            </div>
            <div className='text-[10px] font-medium text-zinc-400'>FASE 2</div>
            <div className='text-xs font-semibold text-center'>
              Dati aziendali
            </div>
          </div>
          <Separator className='self-center' />
          {/* step 3 */}
          <div className='flex flex-col items-center gap-2'>
            <div className='w-6 h-6 flex justify-center items-center bg-emerald-100 rounded-sm'>
              <Check
                size={16}
                className='text-emerald-400'
              />
            </div>
            <div className='text-[10px] font-medium text-zinc-400'>FASE 3</div>
            <div className='text-xs font-semibold text-center'>Credenziali</div>
          </div>
        </section>
        {/* form step 1 tab */}
        <section className='max-h-full overflow-y-auto'>
          <div className='text-xl font-bold mb-8'>Dati personali</div>
          {/* <CreateArtistManagerForm /> */}
        </section>
      </DialogContent>
    </Dialog>
  );
}
