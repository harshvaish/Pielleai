import { EventStatus } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Check, ChevronRight, X } from 'lucide-react';
import { JSX } from 'react';

type EventStatusBadgeProps = {
  status: EventStatus;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'sm';
};

const styles: Record<
  EventStatus,
  { label: string; text: string; bg: string; icon: JSX.Element }
> = {
  'proposed': {
    label: 'Proposto',
    text: 'text-blue-600',
    bg: 'bg-blue-100',
    icon: (
      <div className='w-4 h-4 flex justify-center items-center bg-blue-600 rounded-full'>
        <ChevronRight className='size-3 text-white' />
      </div>
    ),
  },
  'pre-confirmed': {
    label: 'Pre-confermato',
    text: 'text-amber-600',
    bg: 'bg-amber-100',
    icon: (
      <div className='w-4 h-4 flex justify-center items-center bg-amber-600 rounded-full'>
        <span className='text-xs text-white'>?</span>
      </div>
    ),
  },
  'confirmed': {
    label: 'Confermato',
    text: 'text-lime-600',
    bg: 'bg-lime-100',
    icon: (
      <div className='w-4 h-4 flex justify-center items-center bg-lime-600 rounded-full'>
        <Check className='size-3 text-white' />
      </div>
    ),
  },
  'rejected': {
    label: 'Rifiutato',
    text: 'text-red-600',
    bg: 'bg-red-100',
    icon: (
      <div className='w-4 h-4 flex justify-center items-center bg-red-600 rounded-full'>
        <X className='size-3 text-white' />
      </div>
    ),
  },
};

export default function EventStatusBadge({
  status,
  variant = 'primary',
  size = 'default',
}: EventStatusBadgeProps) {
  const style = styles[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 font-medium rounded-md',
        style.text,
        variant === 'primary' ? style.bg : 'bg-white',
        size === 'sm' ? 'text-xs px-1 py-0.5' : 'text-sm px-2 py-1'
      )}
    >
      {style.icon}
      <span>{style.label}</span>
    </div>
  );
}
