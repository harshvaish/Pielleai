import { getLanguagesCached } from '@/lib/cache/languages';
import { getCountriesCached } from '@/lib/cache/countries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { redirect } from 'next/navigation';
import ArtistManagerProfileForm from './_components/ArtistManagerProfileForm';
import getSession from '@/lib/data/auth/get-session';
import VenueManagerProfileForm from './_components/VenueManagerProfileForm';
import { resolveNextPath } from '@/lib/utils';

export default async function CompleteProfilePage() {
  const { session, user } = await getSession(true);

  if (!session || !user || user.banned) {
    redirect('/logout');
  }

  const target = resolveNextPath({ user, hasProfile: Boolean(user.profileId) });
  if (target && target !== '/completa-profilo') redirect(target);

  const [languages, countries] = await Promise.all([getLanguagesCached(), getCountriesCached()]);

  return (
    <Card className='w-full max-w-3xl items-center p-6 rounded-2xl'>
      <CardHeader className='w-full gap-0 text-center p-0'>
        <CardTitle className='text-2xl font-semibold'>Completa profilo</CardTitle>
      </CardHeader>
      <CardContent className='w-full'>
        <Tabs defaultValue='a'>
          <div className='text-sm font-semibold'>Tipologia account</div>
          <TabsList className='justify-start gap-4 bg-white p-1 rounded-xl mb-2 overflow-x-auto'>
            <TabsTrigger value='a'>Manager artisti</TabsTrigger>
            <TabsTrigger value='b'>Manager locali</TabsTrigger>
          </TabsList>

          <TabsContent value='a'>
            <ArtistManagerProfileForm
              uid={user.id}
              languages={languages}
              countries={countries}
            />
          </TabsContent>
          <TabsContent value='b'>
            <VenueManagerProfileForm
              uid={user.id}
              languages={languages}
              countries={countries}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
