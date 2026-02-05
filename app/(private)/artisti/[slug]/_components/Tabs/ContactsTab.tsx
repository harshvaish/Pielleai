'use client';

import { useState, useTransition } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ManagersBadge from '@/app/(private)/_components/Badges/ManagersBadge';
import TourManagerBadge from '@/app/(private)/_components/Badges/TourManagerBadge';
import type { ArtistContact, ArtistManagerSelectData, UserRole } from '@/lib/types';
import { createArtistContact } from '@/lib/server-actions/artists/create-artist-contact';
import { updateArtistContact } from '@/lib/server-actions/artists/update-artist-contact';
import { deleteArtistContact } from '@/lib/server-actions/artists/delete-artist-contact';
import ConfirmDialog from '@/app/_components/ConfirmDialog';

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
  const [editingContactId, setEditingContactId] = useState<number | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  const openCreateForm = () => {
    setEditingContactId(null);
    resetForm();
    setIsFormVisible(true);
  };

  const openEditForm = (contact: ArtistContact) => {
    setEditingContactId(contact.id);
    setName(contact.name || '');
    setPhone(contact.phone || '');
    setEmail(contact.email || '');
    setError('');
    setIsFormVisible(true);
  };

  const handleDeleteContact = async (contactId: number) => {
    const previousContacts = [...contacts];
    setContacts((prev) => prev.filter((contact) => contact.id !== contactId));

    if (editingContactId === contactId) {
      setEditingContactId(null);
      resetForm();
      setIsFormVisible(false);
    }

    const response = await deleteArtistContact(artistId, contactId);
    if (!response.success) {
      setContacts(previousContacts);
      toast.error(response.message || 'Eliminazione contatto non riuscita.');
      return;
    }

    toast.success('Contatto eliminato.');
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!name.trim() && !phone.trim() && !email.trim()) {
      setError('Inserisci almeno un dato di contatto.');
      return;
    }

    const contactIdToUpdate = editingContactId;

    startTransition(async () => {
      const payload = { name, phone, email };
      const response = contactIdToUpdate
        ? await updateArtistContact(artistId, contactIdToUpdate, payload)
        : await createArtistContact(artistId, payload);

      if (!response.success || !response.data) {
        toast.error(response.message || 'Salvataggio contatto non riuscito.');
        return;
      }

      if (contactIdToUpdate) {
        setContacts((prev) =>
          prev.map((contact) => (contact.id === contactIdToUpdate ? response.data : contact)),
        );
        toast.success('Contatto aggiornato.');
      } else {
        setContacts((prev) => [response.data, ...prev]);
        toast.success('Contatto aggiunto.');
      }

      resetForm();
      setIsFormVisible(false);
      setEditingContactId(null);
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
            onClick={openCreateForm}
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
            <div className='md:col-span-3 text-sm font-semibold text-zinc-700'>
              {editingContactId ? 'Modifica contatto' : 'Nuovo contatto'}
            </div>
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
                  setEditingContactId(null);
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
                <div className='flex items-start justify-between gap-2'>
                  <div className='text-sm font-semibold text-zinc-800'>
                    {contact.name || 'Contatto'}
                  </div>
                  <div className='flex items-center gap-1'>
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      disabled={isPending}
                      onClick={() => openEditForm(contact)}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      className='text-destructive hover:text-destructive hover:bg-red-50'
                      disabled={isPending}
                      onClick={() => {
                        setSelectedContactId(contact.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
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

        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedContactId(null);
              setIsDeleteDialogOpen(false);
            } else {
              setIsDeleteDialogOpen(true);
            }
          }}
          title='Sei sicuro di voler eliminare il contatto?'
          description='Attenzione: questa operazione è irreversibile. Il contatto verrà eliminato definitivamente.'
          confirmLabel='Elimina'
          cancelLabel='Annulla'
          onConfirm={() => {
            if (selectedContactId != null) {
              handleDeleteContact(selectedContactId);
              setSelectedContactId(null);
              setIsDeleteDialogOpen(false);
            }
          }}
          onCancel={() => {
            setSelectedContactId(null);
            setIsDeleteDialogOpen(false);
          }}
        />
      </section>
    </TabsContent>
  );
}
