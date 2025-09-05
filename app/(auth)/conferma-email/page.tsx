import { Card, CardContent, CardTitle } from '@/components/ui/card';
import ArtistManagerConfirmEmailForm from './_components/ArtistManagerConfirmEmailForm';

export default async function ArtistManagerConfirmEmailPage() {
  return (
    <Card className='w-full max-w-xl max-h-max items-center p-6 md:p-8 lg:p-12 rounded-2xl'>
      <CardTitle className='text-2xl font-semibold'>Conferma email</CardTitle>
      <CardContent className='w-full max-w-sm p-0'>
        <ArtistManagerConfirmEmailForm />
      </CardContent>
    </Card>
  );
}
