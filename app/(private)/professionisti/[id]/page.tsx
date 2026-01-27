import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { hasRole, resolveNextPath } from '@/lib/utils';
import { getProfessionalById } from '@/lib/data/professionals/get-professional-by-id';
import { ProfessionalRole } from '@/lib/types';

const ROLE_LABELS: Record<ProfessionalRole, string> = {
  journalist: 'Giornalista',
  technician: 'Tecnico',
  photographer: 'Fotografo',
  backstage: 'Backstage',
  other: 'Altro',
};

type ProfessionalDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

export default async function ProfessionalDetailPage({ params }: ProfessionalDetailPageProps) {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['admin', 'artist-manager'])) {
    notFound();
  }

  const { id } = await params;
  const professionalId = Number(id);
  if (!Number.isInteger(professionalId) || professionalId <= 0) {
    notFound();
  }

  const professional = await getProfessionalById(professionalId);
  if (!professional) {
    notFound();
  }

  return (
    <div className='max-w-3xl space-y-4'>
      <div className='bg-white rounded-2xl p-6 space-y-3'>
        <h1 className='text-2xl font-bold'>{professional.fullName}</h1>
        <div className='text-sm text-zinc-600'>
          {ROLE_LABELS[professional.role]}
          {professional.role === 'other' && professional.roleDescription
            ? ` • ${professional.roleDescription}`
            : ''}
        </div>
        <div className='text-sm text-zinc-500'>
          {professional.email || '-'}
          {professional.phone ? ` • ${professional.phone}` : ''}
        </div>
        {professional.competencies && (
          <div className='text-sm text-zinc-600'>{professional.competencies}</div>
        )}
      </div>

      <div className='bg-white rounded-2xl p-6 space-y-3'>
        <h2 className='text-lg font-bold'>Eventi associati</h2>
        {professional.events.length ? (
          <div className='space-y-2'>
            {professional.events.map((event) => (
              <Link
                key={event.id}
                href={`/eventi/${event.id}`}
                className='block text-sm font-medium text-zinc-700 hover:underline'
              >
                {event.title}
              </Link>
            ))}
          </div>
        ) : (
          <div className='text-sm text-zinc-500'>Nessun evento associato.</div>
        )}
      </div>
    </div>
  );
}
