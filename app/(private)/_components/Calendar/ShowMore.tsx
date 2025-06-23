import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { ShowMoreProps } from 'react-big-calendar';

export default function ShowMore({ slotDate, events }: ShowMoreProps) {
  console.log(slotDate, events);
  return (
    <Button className='max-w-full h-auto self-end gap-1 bg-white text-black rounded-sm py-1 px-2 shadow-none hover:bg-zinc-100 overflow-hidden'>
      <span className='text-[10px] font-semibold line-clamp-1'>
        Altri eventi
      </span>
      <ChevronDown
        width={14}
        height={14}
      />
    </Button>
  );
}
