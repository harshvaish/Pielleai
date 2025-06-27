import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateArtistsManagerForm from './CreateArtistManagerForm/CreateArtistsManagerForm';
import { getLanguages } from '@/lib/data/get-languages';
import { getCountries } from '@/lib/data/get-countries';
import { notFound } from 'next/navigation';

export default async function CreateArtistsManagerButton() {
  const [languages, countries] = await Promise.all([
    getLanguages(),
    getCountries(),
  ]).catch((error) => {
    console.error('❌ Error fetching countries:', error);
    notFound();
  });
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

        <CreateArtistsManagerForm
          languages={languages}
          countries={countries}
        />
      </DialogContent>
    </Dialog>
  );
}
