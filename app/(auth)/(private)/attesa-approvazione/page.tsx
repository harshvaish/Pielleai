import SignOutButton from '@/app/_components/SignOutButton';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import getSession from '@/lib/data/auth/get-session';
import { resolveNextPath } from '@/lib/utils';
import { redirect } from 'next/navigation';
import CheckButton from './_components/CheckButton';
import { getUserProfileIdCached } from '@/lib/cache/users';

export const dynamic = 'force-dynamic';

export default async function WaitingForApprovalPage() {
  const { session, user } = await getSession();

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const profileId = await getUserProfileIdCached(user.id);
  const target = resolveNextPath({ user, hasProfile: Boolean(profileId) });
  if (target && target !== '/attesa-approvazione') redirect(target);

  return (
    <Card className='w-full max-w-xl max-h-max items-center p-6 md:p-8 lg:p-12 rounded-2xl'>
      <CardTitle className='text-2xl font-semibold'>In attesa di approvazione</CardTitle>
      <CardContent className='w-full max-w-sm p-0'>
        <CardDescription className='text-xs md:text-sm text-center mb-8'>
          Grazie per esserti registrato! Il tuo account è ora in fase di convalida da parte dei
          nostri amministratori. Potrai accedere alla piattaforma non appena la revisione sarà
          completata.
        </CardDescription>

        <div className='flex justify-between items-center gap-2'>
          <SignOutButton />
          <CheckButton user={user} />
        </div>
      </CardContent>
    </Card>
  );
}
