'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Check, Plus, Trash } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ResponsivePopover from '@/app/_components/ResponsivePopover';
import { addArtistBlacklistedVenue } from '@/lib/server-actions/artists/add-artist-blacklisted-venue';
import { removeArtistBlacklistedVenue } from '@/lib/server-actions/artists/remove-artist-blacklisted-venue';
import { addArtistBlacklistedArea } from '@/lib/server-actions/artists/add-artist-blacklisted-area';
import { removeArtistBlacklistedArea } from '@/lib/server-actions/artists/remove-artist-blacklisted-area';
import {
  ApiResponse,
  ArtistBlacklist,
  ArtistBlacklistArea,
  ArtistBlacklistVenue,
  Country,
  Subdivision,
  VenueSelectData,
} from '@/lib/types';
import { cn } from '@/lib/utils';
import { AVATAR_FALLBACK } from '@/lib/constants';

type BlacklistTabProps = {
  tabValue: string;
  artistId: number;
  venues: VenueSelectData[];
  countries: Country[];
  initialBlacklist: ArtistBlacklist;
};

export default function BlacklistTab({
  tabValue,
  artistId,
  venues,
  countries,
  initialBlacklist,
}: BlacklistTabProps) {
  const [blacklistedVenues, setBlacklistedVenues] = useState<ArtistBlacklistVenue[]>(
    initialBlacklist.venues,
  );
  const [blacklistedAreas, setBlacklistedAreas] = useState<ArtistBlacklistArea[]>(
    initialBlacklist.areas,
  );

  const [venuePopoverOpen, setVenuePopoverOpen] = useState(false);
  const [isAddingVenue, setIsAddingVenue] = useState(false);
  const [removingVenueId, setRemovingVenueId] = useState<number | null>(null);

  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedSubdivisionId, setSelectedSubdivisionId] = useState<number | null>(null);
  const [cityValue, setCityValue] = useState('');
  const [availableSubdivisions, setAvailableSubdivisions] = useState<Subdivision[]>([]);
  const [isLoadingSubdivisions, setIsLoadingSubdivisions] = useState(false);
  const [isAddingArea, setIsAddingArea] = useState(false);
  const [removingAreaId, setRemovingAreaId] = useState<number | null>(null);

  const availableVenues = useMemo(() => {
    const blocked = new Set(blacklistedVenues.map((entry) => entry.venue.id));
    return venues.filter((venue) => !blocked.has(venue.id));
  }, [venues, blacklistedVenues]);

  useEffect(() => {
    setSelectedSubdivisionId(null);
    setAvailableSubdivisions([]);

    if (!selectedCountryId) return;

    let isActive = true;
    const controller = new AbortController();

    const fetchSubdivisions = async () => {
      setIsLoadingSubdivisions(true);
      try {
        const response = await fetch(`/api/country-subdivisions?c=${selectedCountryId}`, {
          signal: controller.signal,
        });
        const payload: ApiResponse<Subdivision[]> = await response.json();

        if (!isActive) return;

        if (payload.success) {
          setAvailableSubdivisions(payload.data);
        } else {
          setAvailableSubdivisions([]);
        }
      } catch (error) {
        if (isActive) {
          setAvailableSubdivisions([]);
        }
      } finally {
        if (isActive) {
          setIsLoadingSubdivisions(false);
        }
      }
    };

    fetchSubdivisions();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [selectedCountryId]);

  const handleAddVenue = async (venueId: number) => {
    if (isAddingVenue) return;
    setIsAddingVenue(true);

    const response = await addArtistBlacklistedVenue(artistId, venueId);

    if (response.success && response.data) {
      setBlacklistedVenues((prev) => [...prev, response.data]);
      setVenuePopoverOpen(false);
      toast.success('Locale aggiunto alla blacklist.');
    } else {
      toast.error(response.message);
    }

    setIsAddingVenue(false);
  };

  const handleRemoveVenue = async (entry: ArtistBlacklistVenue) => {
    if (removingVenueId) return;
    setRemovingVenueId(entry.id);

    const response = await removeArtistBlacklistedVenue(artistId, entry.id);

    if (response.success) {
      setBlacklistedVenues((prev) => prev.filter((item) => item.id !== entry.id));
      toast.success('Locale rimosso dalla blacklist.');
    } else {
      toast.error(response.message);
    }

    setRemovingVenueId(null);
  };

  const handleAddArea = async () => {
    if (!selectedCountryId) {
      toast.error('Seleziona uno stato.');
      return;
    }

    if (isAddingArea) return;
    setIsAddingArea(true);

    const response = await addArtistBlacklistedArea({
      artistId,
      countryId: selectedCountryId,
      subdivisionId: selectedSubdivisionId ?? null,
      city: cityValue.trim() || null,
    });

    if (response.success && response.data) {
      setBlacklistedAreas((prev) => [...prev, response.data]);
      setSelectedSubdivisionId(null);
      setCityValue('');
      toast.success('Area aggiunta alla blacklist.');
    } else {
      toast.error(response.message);
    }

    setIsAddingArea(false);
  };

  const handleRemoveArea = async (entry: ArtistBlacklistArea) => {
    if (removingAreaId) return;
    setRemovingAreaId(entry.id);

    const response = await removeArtistBlacklistedArea(artistId, entry.id);

    if (response.success) {
      setBlacklistedAreas((prev) => prev.filter((item) => item.id !== entry.id));
      toast.success('Area rimossa dalla blacklist.');
    } else {
      toast.error(response.message);
    }

    setRemovingAreaId(null);
  };

  return (
    <TabsContent
      value={tabValue}
      className='grid lg:grid-cols-2 gap-6'
    >
      <section className='bg-white py-6 px-6 rounded-2xl flex flex-col gap-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <div className='text-lg font-semibold'>Blacklist locali</div>
            <div className='text-sm text-zinc-500'>Aggiungi locali da escludere.</div>
          </div>
          <ResponsivePopover
            open={venuePopoverOpen}
            onOpenChange={setVenuePopoverOpen}
            title='Aggiungi locale'
            description='Seleziona un locale da escludere'
            isDescriptionHidden={true}
            trigger={
              <Button
                variant='outline'
                size='sm'
                className='gap-2'
              >
                <Plus className='size-4' />
                Aggiungi locale
              </Button>
            }
          >
            <div className='mt-4 border-t'>
              <Command>
                <CommandInput placeholder='Ricerca locali' />
                <CommandList className='max-h-60 overflow-y-auto overscroll-contain'>
                  <CommandEmpty>Nessun risultato.</CommandEmpty>
                  <CommandGroup>
                    {availableVenues.map((venue) => (
                      <CommandItem
                        key={venue.id}
                        value={venue.id?.toString()}
                        onSelect={() => handleAddVenue(venue.id)}
                        keywords={[venue.name]}
                        disabled={isAddingVenue}
                      >
                        <div className='w-full flex justify-between items-center gap-2 hover:cursor-pointer'>
                          <div className='flex items-center gap-2 truncate'>
                            <Avatar className='w-6 h-6'>
                              <AvatarImage src={venue.avatarUrl || AVATAR_FALLBACK} />
                              <AvatarFallback>
                                {venue.name.substring(0, 1).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className='truncate'>{venue.name}</span>
                          </div>
                          <Check className='opacity-0' />
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </ResponsivePopover>
        </div>

        {blacklistedVenues.length > 0 ? (
          <Table>
            <TableHeader className='bg-zinc-50'>
              <TableRow>
                <TableHead>Locale</TableHead>
                <TableHead>Indirizzo</TableHead>
                <TableHead>Comune</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blacklistedVenues.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Link
                      href={`/locali/${entry.venue.slug}`}
                      prefetch={false}
                      className='flex items-center gap-2 max-w-60'
                    >
                      <Avatar className='w-6 h-6'>
                        <AvatarImage src={entry.venue.avatarUrl || AVATAR_FALLBACK} />
                        <AvatarFallback>
                          {entry.venue.name.substring(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          'text-sm font-semibold truncate',
                          entry.venue.status === 'disabled' && 'text-zinc-400',
                        )}
                      >
                        {entry.venue.name}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className='max-w-48 truncate'>{entry.venue.address}</TableCell>
                  <TableCell className='max-w-32 truncate'>{entry.venue.city}</TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive'
                      onClick={() => handleRemoveVenue(entry)}
                      disabled={removingVenueId === entry.id}
                    >
                      <Trash className='size-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <section className='h-40 flex flex-col justify-center items-center bg-zinc-50 rounded-2xl'>
            <div className='text-sm font-semibold'>Nessun locale in blacklist</div>
            <div className='text-xs text-zinc-400'>Aggiungi un locale per bloccare richieste.</div>
          </section>
        )}
      </section>

      <section className='bg-white py-6 px-6 rounded-2xl flex flex-col gap-4'>
        <div>
          <div className='text-lg font-semibold'>Blacklist aree</div>
          <div className='text-sm text-zinc-500'>Blocca regioni, province o comuni.</div>
        </div>

        <div className='grid gap-4'>
          <div className='grid sm:grid-cols-2 gap-4'>
            <div className='flex flex-col'>
              <label className='text-sm font-semibold mb-2'>Stato</label>
              <Select
                value={selectedCountryId ? selectedCountryId.toString() : undefined}
                onValueChange={(value) => setSelectedCountryId(parseInt(value, 10))}
              >
                <SelectTrigger
                  size='sm'
                  className='w-full'
                >
                  {selectedCountryId
                    ? countries.find((country) => country.id === selectedCountryId)?.name
                    : 'Seleziona stato'}
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem
                      key={country.id}
                      value={country.id.toString()}
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='flex flex-col'>
              <label className='text-sm font-semibold mb-2'>Provincia</label>
              <Select
                value={selectedSubdivisionId ? selectedSubdivisionId.toString() : undefined}
                onValueChange={(value) => setSelectedSubdivisionId(parseInt(value, 10))}
                disabled={!selectedCountryId || isLoadingSubdivisions}
              >
                <SelectTrigger
                  size='sm'
                  className='w-full'
                >
                  {selectedSubdivisionId
                    ? availableSubdivisions.find((subdivision) => subdivision.id === selectedSubdivisionId)?.name
                    : 'Seleziona provincia'}
                </SelectTrigger>
                <SelectContent>
                  {availableSubdivisions.map((subdivision) => (
                    <SelectItem
                      key={subdivision.id}
                      value={subdivision.id.toString()}
                    >
                      {subdivision.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='flex flex-col'>
            <label className='text-sm font-semibold mb-2'>Comune</label>
            <Input
              value={cityValue}
              onChange={(event) => setCityValue(event.target.value)}
              placeholder='Inserisci il comune (opzionale)'
            />
          </div>

          <div className='flex justify-end'>
            <Button
              type='button'
              size='sm'
              onClick={handleAddArea}
              disabled={isAddingArea || !selectedCountryId}
            >
              Aggiungi area
            </Button>
          </div>
        </div>

        {blacklistedAreas.length > 0 ? (
          <Table>
            <TableHeader className='bg-zinc-50'>
              <TableRow>
                <TableHead>Stato</TableHead>
                <TableHead>Provincia</TableHead>
                <TableHead>Comune</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blacklistedAreas.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.country.name}</TableCell>
                  <TableCell>{entry.subdivision?.name ?? '-'}</TableCell>
                  <TableCell>{entry.city || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive'
                      onClick={() => handleRemoveArea(entry)}
                      disabled={removingAreaId === entry.id}
                    >
                      <Trash className='size-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <section className='h-40 flex flex-col justify-center items-center bg-zinc-50 rounded-2xl'>
            <div className='text-sm font-semibold'>Nessuna area in blacklist</div>
            <div className='text-xs text-zinc-400'>Aggiungi una zona per bloccare richieste.</div>
          </section>
        )}
      </section>
    </TabsContent>
  );
}
