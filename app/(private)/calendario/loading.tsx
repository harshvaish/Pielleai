import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingPage() {
  return (
    <>
      <Skeleton className='w-full h-8 rounded-md' />
      <Skeleton className='w-full h-full rounded-md' />
    </>
  );
}
