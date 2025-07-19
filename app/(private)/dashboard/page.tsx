import { Separator } from '@/components/ui/separator';
import Calendar from '../_components/Calendar/Calendar';
import { CalendarEvent } from '@/lib/types';

const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'Concerto di Tiziano Ferro',
    start: new Date('2025-06-23T21:00:00'),
    end: new Date('2025-06-23T23:30:00'),
    artistName: 'Tiziano Ferro',
    artistManagerName: 'Carlo Bianchi',
    venueName: 'Mediolanum Forum - Milano',
    status: 'preconfirmed',
  },
  {
    id: 2,
    title: 'Laura Pausini Live',
    start: new Date('2025-06-24T20:30:00'),
    end: new Date('2025-06-24T22:30:00'),
    artistName: 'Laura Pausini',
    artistManagerName: 'Giorgia Verdi',
    venueName: 'Arena di Verona',
    status: 'confirmed',
  },
  {
    id: 3,
    title: 'Eros Ramazzotti - Battito Infinito Tour',
    start: new Date('2025-06-25T21:00:00'),
    end: new Date('2025-06-25T23:00:00'),
    artistName: 'Eros Ramazzotti',
    artistManagerName: 'Matteo Rossi',
    venueName: 'Palazzo dello Sport - Roma',
    status: 'proposed',
  },
  {
    id: 4,
    title: 'Il Volo - Serata di Gala',
    start: new Date('2025-06-26T20:00:00'),
    end: new Date('2025-06-26T22:00:00'),
    artistName: 'Il Volo',
    artistManagerName: 'Luca Conti',
    venueName: 'Teatro San Carlo - Napoli',
    status: 'confirmed',
  },
  {
    id: 5,
    title: 'Giorgia - Blu Live Tour',
    start: new Date('2025-06-27T21:00:00'),
    end: new Date('2025-06-27T23:30:00'),
    artistName: 'Giorgia',
    artistManagerName: 'Federica Mancini',
    venueName: 'Auditorium Parco della Musica - Roma',
    status: 'draft',
  },
  {
    id: 6,
    title: 'Zucchero Sugar Fornaciari in concerto',
    start: new Date('2025-06-28T21:00:00'),
    end: new Date('2025-06-28T23:30:00'),
    artistName: 'Zucchero',
    artistManagerName: 'Sabrina Costa',
    venueName: 'Stadio Artemio Franchi - Firenze',
    status: 'proposed',
  },
  {
    id: 7,
    title: 'Andrea Bocelli - Special Night',
    start: new Date('2025-07-01T21:00:00'),
    end: new Date('2025-07-01T23:00:00'),
    artistName: 'Andrea Bocelli',
    artistManagerName: 'Giovanni Moretti',
    venueName: 'Teatro Greco - Taormina',
    status: 'confirmed',
  },
  {
    id: 8,
    title: 'Maneskin - Rush! World Tour',
    start: new Date('2025-07-02T21:00:00'),
    end: new Date('2025-07-02T23:30:00'),
    artistName: 'Maneskin',
    artistManagerName: 'Stefano Lisi',
    venueName: 'Ippodromo Snai - Milano',
    status: 'preconfirmed',
  },
  {
    id: 9,
    title: 'Ultimo - Stadi 2025',
    start: new Date('2025-07-03T21:00:00'),
    end: new Date('2025-07-03T23:30:00'),
    artistName: 'Ultimo',
    artistManagerName: 'Marta Ricci',
    venueName: 'Stadio Olimpico - Roma',
    status: 'proposed',
  },
  {
    id: 10,
    title: 'Elisa - Back to the Future Live',
    start: new Date('2025-07-04T21:00:00'),
    end: new Date('2025-07-04T23:00:00'),
    artistName: 'Elisa',
    artistManagerName: 'Davide Greco',
    venueName: 'Arena della Vittoria - Bari',
    status: 'confirmed',
  },
];

export default async function Home() {
  return (
    <>
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
        <Calendar events={mockEvents} />
      </section>
    </>
  );
}
