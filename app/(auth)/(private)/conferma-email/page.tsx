import { Card, CardContent, CardTitle } from '@/components/ui/card';
import ArtistManagerConfirmEmailForm from './_components/ArtistManagerConfirmEmailForm';
import getSession from '@/lib/data/auth/get-session';
import { redirect } from 'next/navigation';
import { userHasProfile } from '@/lib/data/profiles/userHasProfile';
import { resolveNextPath } from '@/lib/utils';

export default async function ArtistManagerConfirmEmailPage() {
  const { session, user } = await getSession();
  if (!session || !user) redirect('/accedi');
  const hasProfile = await userHasProfile(user.id);
  const target = resolveNextPath({ user, hasProfile });
  if (target && target !== '/attesa-approvazione') redirect(target);

  return (
    <Card className='w-full max-w-xl max-h-max items-center p-6 md:p-8 lg:p-12 rounded-2xl'>
      <CardTitle className='text-2xl font-semibold'>Conferma email</CardTitle>
      <CardContent className='w-full max-w-sm p-0'>
        <ArtistManagerConfirmEmailForm />
      </CardContent>
    </Card>
  );
}
