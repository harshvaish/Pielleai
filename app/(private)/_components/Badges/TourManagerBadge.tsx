import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function TourManagerBadge({ email, name, surname, phone }: { email: string; name: string; surname: string; phone: string }) {
  return (
    <div className='w-max max-w-60 flex flex-nowrap items-center gap-2 bg-zinc-50 p-2 rounded-md'>
      <Avatar className='w-5 h-5'>
        <AvatarFallback className='text-white bg-zinc-700'>{name.substring(0, 1)}</AvatarFallback>
      </Avatar>
      <div className='max-w-full overflow-hidden'>
        <div className='text-xs font-semibold text-zinc-700 truncate'>
          {name} {surname}
        </div>
        <div className='text-[10px] text-zinc-500 font-medium truncate'>{email}</div>
        <div className='text-[10px] text-zinc-500 font-medium truncate'>{phone}</div>
      </div>
    </div>
  );
}
