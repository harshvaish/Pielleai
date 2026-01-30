import BackButton from '@/app/_components/BackButton';
import { Separator } from '@/components/ui/separator';
import { notFound, redirect } from 'next/navigation';
import getSession from '@/lib/data/auth/get-session';
import { getUserProfileIdCached } from '@/lib/cache/users';
import { hasRole, resolveNextPath } from '@/lib/utils';
import AssistanceForm from './_components/AssistanceForm';

export const dynamic = 'force-dynamic';

const SUPPORT_EMAIL = 'support@eaglebooking.it';
const SUPPORT_PHONE = '+39 123 456 7890';

export default async function AssistancePage() {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target) redirect(target);

  if (!hasRole(user, ['artist-manager', 'venue-manager'])) {
    notFound();
  }

  return (
    <div className='max-w-3xl space-y-6'>
      <div className='flex items-center justify-between'>
        <BackButton />
      </div>

      <section className='bg-white p-6 rounded-2xl space-y-4'>
        <div>
          <h1 className='text-2xl font-bold'>Request Support</h1>
          <p className='text-sm text-zinc-500'>
            Contatta il team di assistenza per richieste urgenti o domande sulla piattaforma.
          </p>
        </div>

        <Separator />

        <div className='space-y-2 text-sm'>
          <div>
            <span className='font-semibold text-zinc-600'>Email:</span>{' '}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className='text-blue-600 hover:underline'
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
          <div>
            <span className='font-semibold text-zinc-600'>Telefono:</span>{' '}
            <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`} className='text-blue-600 hover:underline'>
              {SUPPORT_PHONE}
            </a>
          </div>
        </div>

        <Separator />

        <AssistanceForm
          supportEmail={SUPPORT_EMAIL}
          userName={user.name}
          userEmail={user.email ?? null}
          userRole={user.role}
        />
      </section>
    </div>
  );
}
