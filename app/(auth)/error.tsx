'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();

  return (
    <Card className='w-full max-w-xl items-center p-6 xl:p-12 rounded-2xl'>
      <CardHeader className='w-full gap-0 text-center p-0'>
        <CardTitle className='text-2xl font-semibold mb-4'>Ops! Qualcosa è andato storto.</CardTitle>
        <CardDescription>
          Stiamo lavorando per risolvere il problema. <br /> Ti invitiamo a riprovare più tardi.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex justify-center items-center'>
        <Button onClick={() => router.replace('/accedi')}>Indietro</Button>
      </CardContent>
    </Card>
  );
}
