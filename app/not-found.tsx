import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function NotFoundPage() {
  return (
    <main className='flex flex-col items-center w-full h-dvh bg-black p-4 overflow-y-auto'>
      <Image
        className='w-20 md:w-24 xl:w-28 mt-8 mb-12'
        src='/images/icon.svg'
        alt='logo Milano Ovest'
        width={140}
        height={144}
        priority
      />
      <Card className='w-full max-w-xl items-center p-6 xl:p-12 rounded-2xl'>
        <CardHeader className='w-full gap-0 text-center p-0'>
          <CardTitle className='text-2xl font-semibold mb-4'>404 | Pagina non trovata</CardTitle>
          <CardDescription>Per favore controlla la url ricercata e riprova.</CardDescription>
        </CardHeader>
        <CardContent className='flex justify-center items-center'>
          <Link
            href='/eventi'
            prefetch={false}
          >
            Indietro
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
