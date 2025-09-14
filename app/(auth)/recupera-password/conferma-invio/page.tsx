import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ButtonResendEmail from './_components/ButtonResendEmail';
import ShowEmail from './_components/ShowEmail';

export default async function RecoverPasswordSendConfirmationPage() {
  return (
    <Card className='w-full max-w-xl items-center gap-y-8 p-6 md:p-8 lg:p-12 rounded-2xl'>
      <CardHeader className='w-full max-w-sm gap-0 text-center p-0'>
        <CardTitle className='text-2xl font-semibold mb-2'>Link inviato</CardTitle>
        <CardDescription className='text-xs md:text-sm'>
          Ti abbiamo inviato un link per reimpostare la password all&apos;indirizzo <ShowEmail />
          <br />
          <br />
          Clicca sul link nell&apos;email per scegliere una nuova password.
          <br className='hidden md:block' />
          Se non trovi l&apos;email, controlla nella cartella spam o posta indesiderata.
        </CardDescription>
      </CardHeader>
      <CardContent className='w-full max-w-sm p-0'>
        <ButtonResendEmail />
        <Link
          href='/accedi'
          prefetch={false}
          className='flex justify-center items-center gap-0.5 text-sm text-muted-foreground'
        >
          <ArrowLeft className='size-4 text-muted-foreground' />
          Torna al login
        </Link>
      </CardContent>
    </Card>
  );
}
