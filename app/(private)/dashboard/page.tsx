import { Separator } from '@/components/ui/separator';
import { getUsersToApprove } from '@/lib/data/users/get-users-to-approve';
import UserToApproveTile from './_components/UserToApproveTile';

export default async function Home() {
  const usersToApprove = await getUsersToApprove();

  return (
    <>
      <h1 className='text-xl md:text-2xl font-bold'>Dashboard</h1>
      {/* signup requests section */}
      {usersToApprove.length > 0 && (
        <section className='bg-white p-4 rounded-2xl'>
          <h2 className='text-base font-bold'>Richieste registrazione</h2>
          <Separator className='bg-zinc-50 my-4' />
          {usersToApprove.map((user) => (
            <UserToApproveTile
              key={user.id}
              user={user}
            />
          ))}
        </section>
      )}
      {/* events requests section */}
      <section className='bg-white p-4 rounded-2xl'>
        <h2 className='text-base font-bold'>Richieste di evento</h2>
        <Separator className='bg-zinc-50 my-4' />
        <div className='text-center p-8'>
          <div className='text-base font-bold mb-2'>
            Nessuna richiesta al momento
          </div>
          <div className='text-sm font-medium text-zinc-400'>
            Non appena qualcuno si registrerà, lo vedrai qui
          </div>
        </div>
      </section>
      {/* calendar section */}
      <section className='bg-white p-4 rounded-2xl'></section>
    </>
  );
}
