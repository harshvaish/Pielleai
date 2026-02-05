'use client';

import { useState, useTransition } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ManagersBadge from '@/app/(private)/_components/Badges/ManagersBadge';
import TourManagerBadge from '@/app/(private)/_components/Badges/TourManagerBadge';
import type { ArtistContact, ArtistManagerSelectData, UserRole } from '@/lib/types';
import { createArtistContact } from '@/lib/server-actions/artists/create-artist-contact';

type ContactsTabProps = {
  tabValue: string;
  artistId: number;
  userRole: UserRole;
  managers: ArtistManagerSelectData[];
  tourManager: {
    email: string;
    name: string;
    surname: string;
    phone: string;
  };
  initialContacts: ArtistContact[];
};

export default function ContactsTab({
  tabValue,
  artistId,
  userRole,
  managers,
  tourManager,
  initialContacts,
}: ContactsTabProps) {
  const [contacts, setContacts] = useState<ArtistContact[]>(initialContacts);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setError('');
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!name.trim() && !phone.trim() && !email.trim()) {
      setError('Inserisci almeno un dato di contatto.');
      return;
    }

    startTransition(async () => {
      const response = await createArtistContact(artistId, {
        name,
        phone,
        email,
      });

      if (!response.success || !response.data) {
        toast.error(response.message || 'Creazione contatto non riuscita.');
        return;
      }

      setContacts((prev) => [response.data, ...prev]);
      resetForm();
      setIsFormVisible(false);
      toast.success('Contatto aggiunto.');
    });
  };

  return (
    <TabsContent
      value={tabValue}
      className='grid gap-6'
    >
      <div className='grid gap-6 lg:grid-cols-2'>
        <section className='bg-white py-8 px-6 rounded-2xl'>
          <div className='text-xl font-semibold mb-6'>Manager</div>
          <ManagersBadge
            userRole={userRole}
            managers={managers}
            pathSegment='manager-artisti'
          />
        </section>

        <section className='bg-white py-8 px-6 rounded-2xl'>
          <div className='text-xl font-semibold mb-6'>Tour manager</div>
          <TourManagerBadge
            email={tourManager.email}
            name={tourManager.name}
            surname={tourManager.surname}
            phone={tourManager.phone}
          />
        </section>
      </div>

      <section className='bg-white py-8 px-6 rounded-2xl'>
        <div className='flex flex-wrap items-center justify-between gap-2 mb-6'>
          <div className='text-xl font-semibold'>Contatti aggiuntivi</div>
          <Button
            type='button'
            size='sm'
            variant='outline'
            onClick={() => setIsFormVisible(true)}
          >
            <Plus className='h-4 w-4' />
            Aggiungi contatto
          </Button>
        </div>

        {isFormVisible && (
          <form
            onSubmit={onSubmit}
            className='grid gap-4 mb-6 md:grid-cols-3'
          >
            <div className='flex flex-col gap-1'>
              <div className='text-sm font-semibold text-zinc-600'>Nome</div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Inserisci il nome'
                disabled={isPending}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <div className='text-sm font-semibold text-zinc-600'>Numero di telefono</div>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='Inserisci il numero di telefono'
                disabled={isPending}
              />
            </div>

            <div className='flex flex-col gap-1'>
              <div className='text-sm font-semibold text-zinc-600'>Email</div>
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Inserisci l'email"
                disabled={isPending}
              />
            </div>

            {error && (
              <div className='md:col-span-3 text-xs text-destructive'>{error}</div>
            )}

            <div className='md:col-span-3 flex justify-end gap-2'>
              <Button
                type='button'
                size='sm'
                variant='outline'
                disabled={isPending}
                onClick={() => {
                  resetForm();
                  setIsFormVisible(false);
                }}
              >
                Annulla
              </Button>
              <Button
                type='submit'
                size='sm'
                disabled={isPending}
              >
                {isPending ? 'Salvataggio...' : 'Salva'}
              </Button>
            </div>
          </form>
        )}

        {contacts.length > 0 ? (
          <div className='grid gap-4 sm:grid-cols-2'>
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className='rounded-xl border border-zinc-100 bg-white p-4'
              >
                <div className='text-sm font-semibold text-zinc-800'>
                  {contact.name || 'Contatto'}
                </div>
                <div className='mt-1 grid gap-1 text-xs text-zinc-500'>
                  {contact.email && <div>{contact.email}</div>}
                  {contact.phone && <div>{contact.phone}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-sm text-zinc-500'>Nessun contatto aggiuntivo.</div>
        )}
      </section>
    </TabsContent>
  );
}

