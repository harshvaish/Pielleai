'use client';

import { useMemo, useState, useTransition } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { EventGuest, EventGuestStatus } from '@/lib/types';
import {
  createEventGuest,
  deleteEventGuest,
  inviteEventGuests,
  updateEventGuest,
} from '@/lib/server-actions/events/event-guests';

const STATUS_LABELS: Record<EventGuestStatus, string> = {
  'to-invite': 'Da invitare',
  invited: 'Invitato',
  attending: 'Partecipante',
  'not-attending': 'Non partecipa',
};

const PARTICIPANT_STATUSES: EventGuestStatus[] = ['attending', 'not-attending'];

type GuestParticipantSectionProps = {
  eventId: number;
  initialGuests: EventGuest[];
};

export default function GuestParticipantSection({ eventId, initialGuests }: GuestParticipantSectionProps) {
  const [guests, setGuests] = useState<EventGuest[]>(initialGuests);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [isPending, startTransition] = useTransition();

  const participants = useMemo(
    () => guests.filter((guest) => PARTICIPANT_STATUSES.includes(guest.status)),
    [guests],
  );

  const toggleSelected = (guestId: number) => {
    setSelectedIds((prev) =>
      prev.includes(guestId) ? prev.filter((id) => id !== guestId) : [...prev, guestId],
    );
  };

  const toggleSelectAll = (ids: number[]) => {
    setSelectedIds((prev) => (prev.length === ids.length ? [] : ids));
  };

  const updateLocalGuest = (guestId: number, payload: Partial<EventGuest>) => {
    setGuests((prev) => prev.map((guest) => (guest.id === guestId ? { ...guest, ...payload } : guest)));
  };

  const handleAddGuest = () => {
    const trimmedName = newGuestName.trim();
    if (trimmedName.length < 2) {
      toast.error('Inserisci un nome valido.');
      return;
    }

    startTransition(async () => {
      const response = await createEventGuest({
        eventId,
        fullName: trimmedName,
        email: newGuestEmail.trim() || null,
      });

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      setGuests((prev) => [...prev, response.data]);
      setNewGuestName('');
      setNewGuestEmail('');
      toast.success('Invitato aggiunto.');
    });
  };

  const handleSaveGuest = (guest: EventGuest) => {
    const previous = guests.find((item) => item.id === guest.id);
    if (!previous) return;

    startTransition(async () => {
      const response = await updateEventGuest({
        guestId: guest.id,
        fullName: guest.fullName,
        email: guest.email,
        status: guest.status,
      });

      if (!response.success) {
        updateLocalGuest(guest.id, previous);
        toast.error(response.message);
        return;
      }

      updateLocalGuest(guest.id, response.data);
      toast.success('Invitato aggiornato.');
    });
  };

  const handleDeleteGuest = (guestId: number) => {
    startTransition(async () => {
      const response = await deleteEventGuest({ guestId });
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      setGuests((prev) => prev.filter((guest) => guest.id !== guestId));
      setSelectedIds((prev) => prev.filter((id) => id !== guestId));
      toast.success('Invitato rimosso.');
    });
  };

  const handleInviteGuests = () => {
    if (!selectedIds.length) {
      toast.error('Seleziona almeno un invitato.');
      return;
    }

    startTransition(async () => {
      const response = await inviteEventGuests({ eventId, guestIds: selectedIds });
      if (!response.success) {
        toast.error(response.message);
      } else {
        const failed = response.data.failedEmails;
        if (failed.length) {
          toast.error(`Inviti inviati con errori per: ${failed.join(', ')}`);
        } else {
          toast.success('Inviti inviati con successo.');
        }
      }

      if (response.data) {
        response.data.invitedIds.forEach((guestId) => {
          updateLocalGuest(guestId, { status: 'invited', invitedAt: new Date() });
        });
        setSelectedIds([]);
      }
    });
  };

  const allGuestIds = useMemo(() => guests.map((guest) => guest.id), [guests]);

  return (
    <section className='bg-white p-6 rounded-2xl space-y-4'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
        <h2 className='text-lg font-bold'>Guest & Participant List</h2>
        <Button size='sm' onClick={handleInviteGuests} disabled={isPending || selectedIds.length === 0}>
          Invita partecipanti
        </Button>
      </div>

      <Tabs defaultValue='guests'>
        <TabsList className='bg-zinc-100 p-1 rounded-xl w-fit'>
          <TabsTrigger value='guests'>Invitati</TabsTrigger>
          <TabsTrigger value='participants'>Partecipanti</TabsTrigger>
        </TabsList>

        <TabsContent value='guests' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-[1fr_1fr_min-content] gap-3'>
            <Input
              placeholder='Nome e cognome'
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
            />
            <Input
              type='email'
              placeholder='Email (opzionale)'
              value={newGuestEmail}
              onChange={(e) => setNewGuestEmail(e.target.value)}
            />
            <Button onClick={handleAddGuest} disabled={isPending}>
              Aggiungi
            </Button>
          </div>

          <div className='border rounded-2xl overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-10'>
                    <Checkbox
                      checked={selectedIds.length === allGuestIds.length && allGuestIds.length > 0}
                      onCheckedChange={() => toggleSelectAll(allGuestIds)}
                    />
                  </TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className='w-52'>Stato</TableHead>
                  <TableHead className='w-40'>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.length ? (
                  guests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(guest.id)}
                          onCheckedChange={() => toggleSelected(guest.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={guest.fullName}
                          onChange={(e) => updateLocalGuest(guest.id, { fullName: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type='email'
                          value={guest.email ?? ''}
                          onChange={(e) => updateLocalGuest(guest.id, { email: e.target.value || null })}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={guest.status}
                          onValueChange={(value) =>
                            updateLocalGuest(guest.id, { status: value as EventGuestStatus })
                          }
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Button size='sm' variant='secondary' onClick={() => handleSaveGuest(guest)}>
                            Salva
                          </Button>
                          <Button size='sm' variant='ghost' onClick={() => handleDeleteGuest(guest.id)}>
                            Elimina
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className='text-center text-sm text-zinc-500 py-6'>
                      Nessun invitato presente.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value='participants' className='space-y-4'>
          <div className='border rounded-2xl overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className='w-52'>Stato</TableHead>
                  <TableHead className='w-40'>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.length ? (
                  participants.map((guest) => (
                    <TableRow key={`participant-${guest.id}`}>
                      <TableCell>
                        <Input
                          value={guest.fullName}
                          onChange={(e) => updateLocalGuest(guest.id, { fullName: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type='email'
                          value={guest.email ?? ''}
                          onChange={(e) => updateLocalGuest(guest.id, { email: e.target.value || null })}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={guest.status}
                          onValueChange={(value) =>
                            updateLocalGuest(guest.id, { status: value as EventGuestStatus })
                          }
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Button size='sm' variant='secondary' onClick={() => handleSaveGuest(guest)}>
                            Salva
                          </Button>
                          <Button size='sm' variant='ghost' onClick={() => handleDeleteGuest(guest.id)}>
                            Elimina
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className='text-center text-sm text-zinc-500 py-6'>
                      Nessun partecipante presente.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
