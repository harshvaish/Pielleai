import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import { ShowMoreProps } from 'react-big-calendar';
import { format } from 'date-fns';
import { CalendarAvailability } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ShowMore({ events }: ShowMoreProps<CalendarAvailability>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className='max-w-full h-auto self-end py-1 px-1 shadow-none hover:bg-zinc-100 overflow-hidden'
          variant='ghost'
        >
          <span className='text-[10px] font-semibold line-clamp-1'>Altri eventi</span>
          <ChevronDown
            width={14}
            height={14}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='flex flex-col gap-1'>
        {events.map((event, index) => {
          const start = event.start instanceof Date ? format(event.start, 'HH:mm') : '00:00';
          const end = event.end instanceof Date ? format(event.end, 'HH:mm') : '00:00';

          return (
            <div
              key={index}
              className={cn('text-white text-center font-semibold text-xs p-1 rounded-xl', event.status)}
            >
              {start} - {end}
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
