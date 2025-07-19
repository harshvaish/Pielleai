import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { HeaderProps } from 'react-big-calendar';

export default function MonthHeader({ date }: HeaderProps) {
  const dayName = format(date, 'EEE', { locale: it }).toUpperCase();

  return (
    <div className='h-8 text-[10px] font-bold text-zinc-500 text-start py-1 px-2'>
      {dayName}
    </div>
  );
}
