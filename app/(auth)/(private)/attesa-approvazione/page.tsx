import SignOutButton from '@/app/_components/SignOutButton';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';

export default async function WaitingForApprovalPage() {
  return (
    <Card className='w-full max-w-xl max-h-max items-center p-6 md:p-8 lg:p-12 rounded-2xl'>
      <CardTitle className='text-2xl font-semibold'>In attesa di approvazione</CardTitle>
      <CardContent className='w-full max-w-sm p-0'>
        <CardDescription className='text-xs md:text-sm text-center mb-4'>
          Grazie per esserti registrato! Il tuo account è ora in fase di convalida da parte dei
          nostri amministratori. Potrai accedere alla piattaforma non appena la revisione sarà
          completata.
        </CardDescription>

        <div className='flex justify-center'>
          <SignOutButton />
        </div>
      </CardContent>
    </Card>
  );
}
