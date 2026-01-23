import { TabsContent } from '@/components/ui/tabs';
import ArtistsBadge from '@/app/(private)/_components/Badges/ArtistsBadge';
import DocumentVenuesBadge from '@/app/(private)/_components/Badges/DocumentVenuesBadge';
import EventStatusBadge from '@/app/(private)/_components/Badges/EventStatusBadge';
import ResendDocuSignButton from '@/app/(private)/documents/_components/ResendDocuSignButton';
import { AVATAR_FALLBACK } from '@/lib/constants';
import { Event, UserRole } from '@/lib/types';
import type { ArtistOtherDocument } from '@/lib/data/documents/get-artist-other-documents';
import { JSX } from 'react';
import { CalendarDays, Check, ChevronRight, Clock, FileText, PartyPopper, X } from 'lucide-react';

type BackendContractStatus =
  | 'draft'
  | 'queued'
  | 'sent'
  | 'viewed'
  | 'signed'
  | 'voided'
  | 'declined'
  | 'all';

type ContractCardStatus =
  | 'all'
  | 'to-sign'
  | 'signed'
  | 'refused'
  | 'error'
  | 'archived'
  | 'missing-info'
  | 'cancelled'
  | 'sent';

type ContractCard = {
  id: number;
  status: ContractCardStatus;
  backendStatus: BackendContractStatus;
  date: string;
  time: string;
  statusDate: string;
  fileUrl: string | null;
  fileName: string | null;
  artist: {
    id: number;
    name: string;
    surname: string;
    stageName: string;
    avatarUrl: string;
    slug: string;
    status: 'active' | 'waiting-for-approval' | 'disabled' | 'banned';
  };
  venue: {
    id: number;
    name: string;
    address: string;
    company: string | null;
    vatCode: string | null;
    avatarUrl: string | null;
    slug: string;
    status: 'active' | 'waiting-for-approval' | 'disabled' | 'banned';
  };
  event: {
    id: number;
    title: string | null;
    status: string;
  };
};

type DocumentsTabProps = {
  tabValue: string;
  userRole: UserRole;
  contracts: any[];
  events: Event[];
  passportFileUrl: string | null;
  passportFileName: string | null;
  artistOtherDocuments: ArtistOtherDocument[];
};

const STATUS_STYLES: Record<
  ContractCardStatus,
  { icon: JSX.Element; badgeBorder: string; badgeBg: string }
> = {
  'missing-info': {
    icon: (
      <div className='w-3 h-3 flex justify-center items-center bg-amber-600 rounded-full'>
        <span className='text-[8px] text-white'>?</span>
      </div>
    ),
    badgeBorder: 'border-amber-200',
    badgeBg: 'bg-amber-50 text-amber-700',
  },
  'to-sign': {
    icon: (
      <div className='w-3 h-3 flex justify-center items-center bg-sky-600 rounded-full gap-1'>
        <ChevronRight className='size-2 text-white' />
      </div>
    ),
    badgeBorder: 'border-sky-200',
    badgeBg: 'bg-sky-50 text-sky-600',
  },
  signed: {
    icon: (
      <div className='w-3 h-3 flex justify-center items-center bg-lime-600 rounded-full'>
        <Check className='size-2 text-white' />
      </div>
    ),
    badgeBorder: 'border-lime-200',
    badgeBg: 'bg-emerald-50 text-lime-700',
  },
  sent: {
    icon: (
      <div className='w-3 h-3 flex justify-center items-center bg-sky-600 rounded-full gap-1'>
        <ChevronRight className='size-2 text-white' />
      </div>
    ),
    badgeBorder: 'border-sky-200',
    badgeBg: 'bg-sky-50 text-sky-600',
  },
  refused: {
    icon: (
      <div className='w-3 h-3 flex justify-center items-center bg-red-600 rounded-full'>
        <X className='size-2 text-white' />
      </div>
    ),
    badgeBorder: 'border-rose-200',
    badgeBg: 'bg-rose-50 text-rose-700',
  },
  error: {
    icon: (
      <div className='w-3 h-3 flex justify-center items-center bg-red-600 rounded-full'>
        <X className='size-2 text-white' />
      </div>
    ),
    badgeBorder: 'border-red-200',
    badgeBg: 'bg-red-50 text-red-700',
  },
  cancelled: {
    icon: (
      <div className='w-3 h-3 flex justify-center items-center bg-blue-600 rounded-full'>
        <ChevronRight className='size-2 text-white' />
      </div>
    ),
    badgeBorder: 'border-pink-200',
    badgeBg: 'bg-pink-50 text-pink-700',
  },
  archived: {
    icon: (
      <div className='w-3 h-3 flex justify-center items-center bg-white rounded-full'>
        <PartyPopper className='size-3 text-zinc-700' />
      </div>
    ),
    badgeBorder: 'border-zinc-200',
    badgeBg: 'bg-zinc-50 text-zinc-600',
  },
  all: {
    icon: (
      <div className='w-3 h-3 flex justify-center items-center bg-blue-600 rounded-full'>
        <ChevronRight className='size-2 text-white' />
      </div>
    ),
    badgeBorder: 'border-zinc-200',
    badgeBg: 'bg-zinc-50 text-zinc-600',
  },
};

function mapStatus(
  backendStatus: BackendContractStatus,
  hasMissing: boolean,
): ContractCardStatus {
  if (backendStatus === 'draft') {
    return hasMissing ? 'missing-info' : 'to-sign';
  }
  switch (backendStatus) {
    case 'signed':
      return 'signed';
    case 'declined':
      return 'refused';
    case 'voided':
      return 'archived';
    case 'sent':
      return 'to-sign';
    default:
      return 'all';
  }
}

function formatDateAndTime(
  availability: { startDate: string | Date; endDate: string | Date } | null,
): { date: string; time: string } {
  if (!availability) {
    return { date: '—', time: '—' };
  }

  const start =
    availability.startDate instanceof Date
      ? availability.startDate
      : new Date(availability.startDate);
  const end =
    availability.endDate instanceof Date
      ? availability.endDate
      : new Date(availability.endDate);

  const date = start.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const time = `${start.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  })} – ${end.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  return { date, time };
}

function hasMissingDetails(c: any): boolean {
  const artistOk = c.artist?.name && c.artist?.surname && c.artist?.stageName;

  const venueOk = c.venue?.name && c.venue?.company && c.venue?.vatCode && c.venue?.address;

  const eventOk =
    c.availability?.startDate &&
    c.availability?.endDate &&
    c.event?.depositCost &&
    c.event?.totalFee;

  return !(artistOk && venueOk && eventOk);
}

function mapContract(c: any): ContractCard {
  const { date, time } = formatDateAndTime(c.availability);
  const backendStatus = c.status as BackendContractStatus;

  return {
    id: c.id,
    backendStatus,
    status: mapStatus(backendStatus, hasMissingDetails(c)),
    date,
    time,
    statusDate: new Date(c.createdAt).toLocaleDateString('it-IT'),
    fileUrl: c.fileUrl ?? null,
    fileName: c.fileName ?? null,
    artist: {
      id: c.artist.id,
      name: c.artist.name,
      surname: c.artist.surname,
      stageName: c.artist.stageName,
      avatarUrl: c.artist.avatarUrl || AVATAR_FALLBACK,
      slug: c.artist.slug,
      status: c.artist.status,
    },
    venue: {
      id: c.venue.id,
      name: c.venue.name,
      address: c.venue.address,
      company: c.venue.company ?? null,
      vatCode: c.venue.vatCode ?? null,
      avatarUrl: c.venue.avatarUrl ?? null,
      slug: c.venue.slug,
      status: c.venue.status,
    },
    event: {
      id: c.event.id,
      title: c.event.title ?? null,
      status: c.event.status,
    },
  };
}

function getContractDisplayName(contract: ContractCard): string {
  const title = contract.event.title?.trim();
  return title || contract.fileName || 'Contratto.pdf';
}

function getBackendStatusLabel(status: string) {
  switch (status) {
    case 'voided':
      return 'Archiviato';
    case 'sent':
      return 'Da firmare';
    case 'viewed':
      return 'Viewed';
    case 'signed':
      return 'Firmato';
    case 'declined':
      return 'Rifiutato';
    case 'draft':
      return 'Draft';
    case 'missing-info':
      return 'Missing-info';
    default:
      return status;
  }
}

export default function DocumentsTab({
  tabValue,
  userRole,
  contracts,
  events,
  passportFileUrl,
  passportFileName,
  artistOtherDocuments,
}: DocumentsTabProps) {
  const mappedContracts = contracts.map(mapContract);
  const previewArtistOtherDocuments = artistOtherDocuments.slice(0, 3);

  return (
    <TabsContent
      value={tabValue}
      className='mt-6'
    >
      <div className='grid gap-6 lg:grid-cols-2 mb-6'>
        <section className='bg-white rounded-2xl border border-zinc-100'>
          <div className='flex items-center justify-between border-b border-zinc-100 px-4 py-3'>
            <h2 className='text-sm font-semibold text-zinc-800'>Passport</h2>
          </div>
          <div className='px-4 py-4'>
            <div className='flex flex-wrap items-center gap-2 text-xs text-zinc-500'>
              <FileText className='h-4 w-4 text-zinc-400' />
              <span>Passport</span>
              {passportFileUrl ? (
                <a
                  href={passportFileUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 hover:underline'
                >
                  <FileText className='h-4 w-4 text-zinc-400' />
                  {passportFileName ?? 'Passport.pdf'}
                </a>
              ) : (
                <span className='text-zinc-400'>Mancante</span>
              )}
            </div>
          </div>
        </section>

        <section className='bg-white rounded-2xl border border-zinc-100'>
          <div className='flex items-center justify-between border-b border-zinc-100 px-4 py-3'>
            <h2 className='text-sm font-semibold text-zinc-800'>Other</h2>
            <a
              href='/documents/artist-other'
              className='inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700'
            >
              Vedi tutto <ChevronRight className='size-4' />
            </a>
          </div>
          {previewArtistOtherDocuments.length ? (
            <div className='divide-y divide-zinc-100'>
              {previewArtistOtherDocuments.map((doc) => (
                <div
                  key={`artist-other-${doc.url}`}
                  className='flex flex-wrap items-center gap-2 px-4 py-4 text-xs text-zinc-500'
                >
                  <FileText className='h-4 w-4 text-zinc-400' />
                  <span>Documento</span>
                  <a
                    href={doc.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 hover:underline'
                  >
                    <FileText className='h-4 w-4 text-zinc-400' />
                    {doc.name}
                  </a>
                  {doc.uploadedAt && (
                    <span className='text-zinc-400'>· {doc.uploadedAt}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className='px-4 py-6 text-sm text-zinc-500'>
              Nessun documento disponibile.
            </div>
          )}
        </section>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <section className='bg-white rounded-2xl border border-zinc-100'>
          <div className='flex items-center justify-between border-b border-zinc-100 px-4 py-3'>
            <h2 className='text-sm font-semibold text-zinc-800'>Contratti</h2>
          </div>
          {mappedContracts.length ? (
            <div className='divide-y divide-zinc-100'>
              {mappedContracts.map((contract) => {
                const s = STATUS_STYLES[contract.status];
                return (
                  <div
                    key={contract.id}
                    className='grid gap-4 px-4 py-4 md:grid-cols-[170px_1fr_auto]'
                  >
                    <div className='flex flex-col gap-2 md:border-r md:pr-4'>
                      <span
                        className={`w-fit inline-flex gap-1.5 items-center rounded-md px-2 py-1.5 text-xs font-medium border ${s.badgeBorder} ${s.badgeBg}`}
                      >
                        {contract.status === 'missing-info'
                          ? 'Info mancanti'
                          : getBackendStatusLabel(contract.backendStatus)}
                        <span>{s.icon}</span>
                      </span>
                      <span className='text-xs text-zinc-500'>Stato aggiornato</span>
                      <span className='text-xs text-zinc-500'>il {contract.statusDate}</span>
                    </div>

                    <div className='flex flex-col gap-2'>
                      <div className='flex flex-wrap items-center gap-2 text-sm'>
                        <ArtistsBadge
                          artists={[contract.artist]}
                          userRole={userRole}
                        />
                        <div className='flex flex-col leading-tight'>
                          <DocumentVenuesBadge
                            userRole={userRole}
                            venues={[contract.venue]}
                          />
                          <div className='flex items-center gap-4 text-xs py-0.5 text-zinc-500'>
                            <span className='flex items-center gap-1'>
                              <CalendarDays className='h-4 w-4 text-zinc-400' />
                              {contract.date}
                            </span>
                            <span className='flex items-center gap-1'>
                              <Clock className='h-4 w-4 text-zinc-400' />
                              {contract.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center gap-2 text-xs text-zinc-500 py-2'>
                        <FileText className='h-4 w-4 text-zinc-400' />
                        <span>Contratto</span>
                        {contract.fileUrl ? (
                          <span className='flex items-center bg-white border border-zinc-300 rounded-lg px-2 py-1.5'>
                            <FileText className='h-4 w-4 text-zinc-400' />
                            <a
                              href={contract.fileUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-zinc-700 hover:underline'
                            >
                              {getContractDisplayName(contract)}
                            </a>
                          </span>
                        ) : (
                          <span className='text-zinc-400'>Mancante</span>
                        )}
                      </div>
                    </div>

                    <div className='flex h-full items-center'>
                      {(contract.backendStatus === 'declined' ||
                        contract.backendStatus === 'sent' ||
                        contract.backendStatus === 'queued' ||
                        contract.backendStatus === 'viewed') && (
                        <ResendDocuSignButton contractId={contract.id} />
                      )}
                      <a
                        href={`/documents/${contract.id}`}
                        aria-label='Open contract details'
                        className='inline-flex items-center'
                      >
                        <ChevronRight className='h-4 w-4 text-zinc-400 translate-y-[0.5px]' />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='px-4 py-6 text-sm text-zinc-500'>
              Nessun contratto disponibile.
            </div>
          )}
        </section>

        <section className='bg-white rounded-2xl border border-zinc-100'>
          <div className='flex items-center justify-between border-b border-zinc-100 px-4 py-3'>
            <h2 className='text-sm font-semibold text-zinc-800'>Technical Ride</h2>
          </div>
          {events.length ? (
            <div className='divide-y divide-zinc-100'>
              {events.map((event) => {
                const { date, time } = formatDateAndTime(event.availability);
                const riderName = event.tecnicalRiderName || 'Technical Ride.pdf';
                return (
                  <div
                    key={event.id}
                    className='grid gap-4 px-4 py-4 md:grid-cols-[170px_1fr_auto]'
                  >
                    <div className='flex flex-col gap-2 md:border-r md:pr-4'>
                      <EventStatusBadge
                        status={event.status}
                        size='sm'
                      />
                      <span className='text-sm font-semibold text-zinc-800'>{date}</span>
                      <span className='text-xs text-zinc-500'>{time}</span>
                    </div>

                    <div className='flex flex-col gap-2'>
                      <div className='flex flex-wrap items-center gap-2 text-sm'>
                        <ArtistsBadge
                          artists={[event.artist]}
                          userRole={userRole}
                        />
                        <DocumentVenuesBadge
                          userRole={userRole}
                          venues={[event.venue]}
                        />
                      </div>
                      <div className='flex flex-wrap items-center gap-2 text-xs text-zinc-500'>
                        <FileText className='h-4 w-4 text-zinc-400' />
                        <span>Technical Ride</span>
                        {event.tecnicalRiderUrl ? (
                          <a
                            href={event.tecnicalRiderUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-700 hover:underline'
                          >
                            <FileText className='h-4 w-4 text-zinc-400' />
                            {riderName}
                          </a>
                        ) : (
                          <span className='text-zinc-400'>Mancante</span>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center justify-end'>
                      <a
                        href={`/eventi/${event.id}/modifica`}
                        aria-label='Open event details'
                        className='inline-flex items-center text-zinc-400 hover:text-zinc-600'
                      >
                        <ChevronRight className='h-4 w-4 translate-y-[0.5px]' />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='px-4 py-6 text-sm text-zinc-500'>
              Nessun documento disponibile.
            </div>
          )}
        </section>
      </div>
    </TabsContent>
  );
}
