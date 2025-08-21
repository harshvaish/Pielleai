import { EventStatus } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Check, ChevronRight, X } from 'lucide-react';
import { JSX } from 'react';

type EventStatusBadgeProps = {
  status: EventStatus;
  variant?: 'primary' | 'secondary';
  size?: 'lg' | 'md' | 'sm';
};

const styles: Record<EventStatus, { label: string; text: string; bg: string; icon: JSX.Element }> = {
  'proposed': {
    label: 'Proposto',
    text: 'text-blue-600',
    bg: 'bg-blue-50',
    icon: (
      <div className='w-3 h-3 flex justify-center items-center bg-blue-600 rounded-full'>
        <ChevronRight className='size-2 text-white' />
      </div>
    ),
  },
  'pre-confirmed': {
    label: 'Pre-confermato',
    text: 'text-amber-600',
    bg: 'bg-amber-50',
    icon: (
      <div className='w-3 h-3 flex justify-center items-center bg-amber-600 rounded-full'>
        <span className='text-[8px] text-white'>?</span>
      </div>
    ),
  },
  'confirmed': {
    label: 'Confermato',
    text: 'text-lime-600',
    bg: 'bg-lime-50',
    icon: (
      <div className='w-3 h-3 flex justify-center items-center bg-lime-600 rounded-full'>
        <Check className='size-2 text-white' />
      </div>
    ),
  },
  'conflict': {
    label: 'Conflitto',
    text: 'text-rose-600',
    bg: 'bg-rose-50',
    icon: (
      <div className='w-3 h-3 flex justify-center items-center bg-rose-600 rounded-full'>
        <span className='text-[8px] text-white'>!</span>
      </div>
    ),
  },
  'rejected': {
    label: 'Rifiutato',
    text: 'text-red-600',
    bg: 'bg-red-50',
    icon: (
      <div className='w-3 h-3 flex justify-center items-center bg-red-600 rounded-full'>
        <X className='size-2 text-white' />
      </div>
    ),
  },
};

const sizes: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-xs px-1.5 py-0.5 gap-1',
  md: 'text-sm px-2 py-1 gap-2',
  lg: 'text-base px-3 py-1.5 gap-2.5',
};

export default function EventStatusBadge({ status, variant = 'primary', size = 'md' }: EventStatusBadgeProps) {
  const style = styles[status];

  return (
    <div className={cn('min-w-min inline-flex flex-nowrap items-center font-medium rounded-md', style.text, variant === 'primary' ? style.bg : 'bg-white', sizes[size])}>
      {style.icon}
      <span className='truncate'>{style.label}</span>
    </div>
  );
}
