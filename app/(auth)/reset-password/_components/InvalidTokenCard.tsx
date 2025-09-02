import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function InvalidTokenCard() {
  return (
    <Card className='w-full max-w-xl max-h-max items-center gap-y-8 p-6 md:p-8 lg:p-12 rounded-2xl'>
      <CardHeader className='w-full max-w-sm gap-0 text-center p-0'>
        <CardTitle className='text-2xl font-semibold mb-2'>Link scaduto</CardTitle>
        <CardDescription>
          Torna alla pagina di recupero password per richiederne uno nuovo.
        </CardDescription>
      </CardHeader>
      <CardContent className='w-full max-w-sm p-0'>
        <Link
          href='/recupera-password'
          prefetch={false}
          className='flex justify-center items-center gap-0.5 text-sm text-muted-foreground'
        >
          <Button className='w-full'>Procedi</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
