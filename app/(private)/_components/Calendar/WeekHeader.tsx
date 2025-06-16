import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { HeaderProps } from 'react-big-calendar';

export default function WeekHeader({ date }: HeaderProps) {
  const dayName = format(date, 'EEE', { locale: it }).toUpperCase();
  const dayNumber = format(date, 'd', { locale: it });

  return (
    <div className='flex flex-col justify-start items-start py-1 px-2'>
      <span className='text-[10px] font-bold text-zinc-500'>{dayName}</span>
      <span className='text-xl font-bold text-black '>{dayNumber}</span>
    </div>
  );
}
