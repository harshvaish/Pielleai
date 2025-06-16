import { Separator } from '@/components/ui/separator';
import { NAVBAR_LINKS } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import MyCalendar from './_components/Calendar/Calendar';
import { CalendarEvent } from '@/lib/types';

const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'Riunione di kickoff progetto',
    start: new Date('2025-06-09T09:00:00'), // Mon
    end: new Date('2025-06-09T12:30:00'),
    artistName: 'Pierot',
    artistManagerName: 'Pierota',
    venueName: 'La pargola',
    status: 'preconfirmed',
  },
  {
    id: 2,
    title: 'Daily stand-up',
    start: new Date('2025-06-09T09:00:00'), // Mon
    end: new Date('2025-06-09T11:00:00'),
    artistName: 'faaff',
    artistManagerName: 'Pierota',
    venueName: 'La adf',
    status: 'proposed',
  },
  {
    id: 3,
    title: 'Revisione UI con il team design',
    start: new Date('2025-06-09T00:00:00'), // Mon
    end: new Date('2025-06-09T23:59:59'),
    artistName: 'popo',
    artistManagerName: 'Pierota',
    venueName: 'La rqed',
    status: 'conflict',
  },
  {
    id: 4,
    title: 'Pranzo con cliente',
    start: new Date('2025-06-09T09:00:00'), // Mon
    end: new Date('2025-06-09T12:30:00'),
    artistName: 'leo',
    artistManagerName: 'Pierota',
    venueName: 'La sagra della rana',
    status: 'proposed',
  },
  {
    id: 5,
    title: 'Webinar “Next.js 15 Best Practices”',
    start: new Date('2025-06-09T09:00:00'), // Mon
    end: new Date('2025-06-09T12:30:00'),
    artistName: 'malgioglio',
    artistManagerName: 'Pierota',
    venueName: 'pepe nero',
    status: 'draft',
  },
  {
    id: 6,
    title: 'Sprint retrospettiva',
    start: new Date('2025-06-12T16:00:00'), // Thu (today)
    end: new Date('2025-06-12T17:00:00'),
    artistName: 'fefe',
    artistManagerName: 'Pierota',
    venueName: 'La ffefe',
    status: 'proposed',
  },
  {
    id: 7,
    title: 'Pair-programming sessione TypeScript',
    start: new Date('2025-06-13T10:00:00'), // Fri
    end: new Date('2025-06-13T12:00:00'),
    artistName: 'Emis kikka',
    artistManagerName: 'Pierota',
    venueName: 'dures',
    status: 'confirmed',
  },
  {
    id: 8,
    title: 'Deploy in produzione',
    start: new Date('2025-06-13T17:30:00'),
    end: new Date('2025-06-13T18:00:00'),
    artistName: 'giugliano',
    artistManagerName: 'Pierota',
    venueName: 'Lerda',
    status: 'draft',
  },
  {
    id: 9,
    title: 'Gita in bicicletta sui Colli Euganei',
    start: new Date('2025-06-14T09:00:00'), // Sat
    end: new Date('2025-06-14T13:00:00'),
    artistName: 'fdee',
    artistManagerName: 'Pierota',
    venueName: 'afdaf',
    status: 'conflict',
  },
  {
    id: 10,
    title: 'Brunch con amici',
    start: new Date('2025-06-15T11:00:00'), // Sun
    end: new Date('2025-06-15T13:00:00'),
    artistName: 'emeo',
    artistManagerName: 'Pierota',
    venueName: 'koeld',
    status: 'preconfirmed',
  },
];

export default async function Home() {
  return (
    <div className='flex-grow grid grid-cols-[1fr_4fr] gap-8 p-8 overflow-hidden'>
      {/* sidebar */}
      <nav className='max-h-max flex flex-col gap-1 bg-white p-4 rounded-2xl'>
        {NAVBAR_LINKS.map((link) => (
          <Fragment key={link.label}>
            <Link
              href={link.href}
              prefetch={false}
              className='flex items-center gap-2 rounded-xl p-2 hover:bg-zinc-100'
            >
              <Image
                className='w-4 h-4'
                src={link.iconSrc}
                alt={link.iconAlt}
                width={16}
                height={16}
                loading='lazy'
              />
              {link.label}
            </Link>
            {link.separator && <Separator className='bg-zinc-50' />}
          </Fragment>
        ))}
      </nav>
      {/* main content */}
      <main className='flex flex-col gap-8 overflow-y-auto'>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
        {/* signup requests section */}
        <section className='bg-white p-4 rounded-2xl'>
          <h2 className='text-base font-bold'>Richieste registrazione</h2>
          <Separator className='bg-zinc-50 my-4' />
          <div className='text-center p-8'>
            <div className='text-base font-bold mb-2'>
              Nessuna richiesta al momento
            </div>
            <div className='text-sm font-medium text-zinc-400'>
              Non appena qualcuno si registrerà, lo vedrai qui
            </div>
          </div>
        </section>
        {/* events requests section */}
        <section className='bg-white p-4 rounded-2xl'>
          <h2 className='text-base font-bold'>Richieste di evento</h2>
          <Separator className='bg-zinc-50 my-4' />
          <div className='text-center p-8'>
            <div className='text-base font-bold mb-2'>
              Nessuna richiesta al momento
            </div>
            <div className='text-sm font-medium text-zinc-400'>
              Non appena qualcuno si registrerà, lo vedrai qui
            </div>
          </div>
        </section>
        {/* calendar section */}
        <section className='bg-white p-4 rounded-2xl'>
          <MyCalendar events={mockEvents} />
        </section>
      </main>
    </div>
  );
}
