'use client';

import { useMemo, useState, useTransition } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  EventGuest,
  EventGuestColorTag,
  EventGuestOriginGroup,
  EventGuestStatus,
} from '@/lib/types';
import {
  createEventGuest,
  deleteEventGuest,
  inviteEventGuests,
  sendAccreditationList,
  updateEventGuest,
} from '@/lib/server-actions/events/event-guests';
import { updateEventGuestLimit } from '@/lib/server-actions/events/update-event-guest-limit';

const STATUS_LABELS: Record<EventGuestStatus, string> = {
  'to-invite': 'Da invitare',
  invited: 'Invitato',
  attending: 'Partecipante',
  'not-attending': 'Non partecipa',
};

const ORIGIN_GROUP_LABELS: Record<EventGuestOriginGroup, string> = {
  artist: 'Artista',
  'artist-manager': 'Manager Artista',
  booking: 'Booking',
  major: 'Major',
};

const COLOR_TAG_LABELS: Record<EventGuestColorTag, string> = {
  green: 'Verde',
  yellow: 'Giallo',
  red: 'Rosso',
};

const COLOR_TAG_STYLES: Record<EventGuestColorTag, string> = {
  green: 'bg-green-100 text-green-700 border-green-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  red: 'bg-red-100 text-red-700 border-red-200',
};

type GuestParticipantSectionProps = {
  eventId: number;
  initialGuests: EventGuest[];
  guestLimit: number;
  isAdmin: boolean;
};

export default function GuestParticipantSection({
  eventId,
  initialGuests,
  guestLimit,
  isAdmin,
}: GuestParticipantSectionProps) {
  const [guests, setGuests] = useState<EventGuest[]>(initialGuests);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestOrigin, setNewGuestOrigin] = useState<EventGuestOriginGroup>('artist');
  const [newGuestColor, setNewGuestColor] = useState<EventGuestColorTag>('green');
  const [allowOverLimit, setAllowOverLimit] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(guestLimit);
  const [limitInput, setLimitInput] = useState(String(guestLimit));
  const [isPending, startTransition] = useTransition();

  const totalGuests = guests.length;
  const limitReached = currentLimit > 0 && totalGuests >= currentLimit;

  const allGuestIds = useMemo(() => guests.map((guest) => guest.id), [guests]);

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

    if (limitReached && !allowOverLimit) {
      toast.error('Limite invitati raggiunto.');
      return;
    }

    startTransition(async () => {
      const response = await createEventGuest({
        eventId,
        fullName: trimmedName,
        email: newGuestEmail.trim() || null,
        originGroup: newGuestOrigin,
        colorTag: newGuestColor,
        allowOverLimit: allowOverLimit || undefined,
      });

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      setGuests((prev) => [...prev, response.data]);
      setNewGuestName('');
      setNewGuestEmail('');
      setNewGuestOrigin('artist');
      setNewGuestColor('green');
      setAllowOverLimit(false);
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
        originGroup: guest.originGroup,
        colorTag: guest.colorTag,
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

  const handleSendAccreditationList = () => {
    startTransition(async () => {
      const response = await sendAccreditationList({ eventId });
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      const failed = response.data.failedEmails;
      if (failed.length) {
        toast.error(`Lista inviata, ma alcuni inviti hanno fallito: ${failed.join(', ')}`);
      } else {
        toast.success('Lista accrediti inviata al locale.');
      }

      response.data.invitedIds.forEach((guestId) => {
        updateLocalGuest(guestId, { status: 'invited', invitedAt: new Date() });
      });
    });
  };

  const handleSaveLimit = () => {
    const parsedLimit = Number(limitInput);
    if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
      toast.error('Inserisci un limite valido.');
      return;
    }

    startTransition(async () => {
      const response = await updateEventGuestLimit({ eventId, guestLimit: parsedLimit });
      if (!response.success) {
        toast.error(response.message);
        return;
      }

      setCurrentLimit(response.data.guestLimit);
      setLimitInput(String(response.data.guestLimit));
      toast.success('Limite invitati aggiornato.');
    });
  };

  return (
    <section className='bg-white p-6 rounded-2xl space-y-4'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <h2 className='text-lg font-bold'>Accreditation List</h2>
          <div className='text-xs text-zinc-500'>
            Invitati totali: {totalGuests} / {currentLimit}
          </div>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button size='sm' onClick={handleInviteGuests} disabled={isPending || selectedIds.length === 0}>
            Invia inviti selezionati
          </Button>
          <Button size='sm' variant='secondary' onClick={handleSendAccreditationList} disabled={isPending}>
            Invia lista accrediti
          </Button>
        </div>
      </div>

      {isAdmin && (
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div className='space-y-1'>
            <div className='text-sm font-semibold'>Limite invitati</div>
            <div className='flex items-center gap-2'>
              <Input
                type='number'
                min={1}
                max={500}
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                className='w-32'
              />
              <Button size='sm' onClick={handleSaveLimit} disabled={isPending}>
                Salva limite
              </Button>
            </div>
          </div>
          {limitReached && (
            <div className='flex items-center gap-2 text-xs text-amber-600'>
              <span className='font-semibold'>Limite raggiunto</span>
              <div className='flex items-center gap-2'>
                <Checkbox
                  checked={allowOverLimit}
                  onCheckedChange={(value) => setAllowOverLimit(Boolean(value))}
                />
                <span>Consenti superamento</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_min-content] gap-3'>
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
        <Select value={newGuestOrigin} onValueChange={(value) => setNewGuestOrigin(value as EventGuestOriginGroup)}>
          <SelectTrigger>
            <SelectValue placeholder='Gruppo origine' />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ORIGIN_GROUP_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={newGuestColor} onValueChange={(value) => setNewGuestColor(value as EventGuestColorTag)}>
          <SelectTrigger>
            <SelectValue placeholder='Tag colore' />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(COLOR_TAG_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              <TableHead className='w-44'>Gruppo</TableHead>
              <TableHead className='w-36'>Tag colore</TableHead>
              <TableHead className='w-44'>Stato</TableHead>
              <TableHead className='w-44'>Azioni</TableHead>
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
                      value={guest.originGroup}
                      onValueChange={(value) =>
                        updateLocalGuest(guest.id, { originGroup: value as EventGuestOriginGroup })
                      }
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ORIGIN_GROUP_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={guest.colorTag}
                      onValueChange={(value) =>
                        updateLocalGuest(guest.id, { colorTag: value as EventGuestColorTag })
                      }
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(COLOR_TAG_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className='mt-2'>
                      <Badge variant='outline' className={COLOR_TAG_STYLES[guest.colorTag]}>
                        {COLOR_TAG_LABELS[guest.colorTag]}
                      </Badge>
                    </div>
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
                <TableCell colSpan={7} className='text-center text-sm text-zinc-500 py-6'>
                  Nessun invitato presente.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
