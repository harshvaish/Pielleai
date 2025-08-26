import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingPage() {
  return (
    <>
      <Skeleton className='w-full h-10 rounded-md' />
      <Skeleton className='w-full h-12 rounded-md' />
      <Skeleton className='md:hidden w-full h-10 rounded-md' />
      <Skeleton className='w-full h-full rounded-md' />
    </>
  );
}
