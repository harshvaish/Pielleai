import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function TourManagerBadge({
  email,
  name,
  surname,
  phone,
}: {
  email: string;
  name: string;
  surname: string;
  phone: string;
}) {
  return (
    <div className='w-max max-w-60 flex flex-nowrap items-center gap-2 bg-zinc-50 hover:bg-zinc-100 p-2 rounded-md transition-colors'>
      <Avatar>
        <AvatarFallback className='font-semibold text-white bg-zinc-700'>
          {name.substring(0, 1)}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className='text-zinc-700 font-semibold'>
          {name} {surname}
        </div>
        <div className='text-xs text-zinc-600 font-medium'>{email}</div>
        <div className='text-xs text-zinc-600 font-medium'>{phone}</div>
      </div>
    </div>
  );
}
