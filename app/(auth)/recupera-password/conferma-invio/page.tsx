import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ButtonResendEmail from './_components/ButtonResendEmail';
import { redirect } from 'next/navigation';

export default async function RecoverPasswordSendConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) {
  const params = await searchParams;
  const email = decodeURIComponent(params.email);

  if (!email) redirect('/recupera-password');

  return (
    <main className='flex flex-col items-center w-full h-dvh bg-black bg-[url(/images/background.webp)] bg-right xl:bg-center bg-cover'>
      <Image
        className='w-20 md:w-26 xl:w-36 mt-12 mb-18'
        src='/images/logo.svg'
        alt='Milano Ovest logo'
        width={140}
        height={144}
        priority
      />
      <Card className='w-full max-w-xl items-center gap-y-8 p-6 md:p-8 lg:p-12 rounded-2xl'>
        <CardHeader className='w-full max-w-sm gap-0 text-center p-0'>
          <CardTitle className='text-2xl font-semibold mb-2'>
            Link inviato
          </CardTitle>
          <CardDescription>
            Ti abbiamo inviato un link per reimpostare la password
            all&apos;indirizzo <strong>{email}</strong>
            <br />
            <br />
            Clicca sul link nell&apos;email per scegliere una nuova password.
            <br />
            Se non trovi l&apos;email, controlla nella cartella spam o posta
            indesiderata.
          </CardDescription>
        </CardHeader>
        <CardContent className='w-full max-w-sm p-0'>
          <ButtonResendEmail email={email} />
          <Link
            href='/accedi'
            prefetch={false}
            className='flex justify-center items-center gap-0.5 text-sm text-muted-foreground'
          >
            <ArrowLeft
              size={16}
              className='text-muted-foreground'
            />
            Torna al login
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
