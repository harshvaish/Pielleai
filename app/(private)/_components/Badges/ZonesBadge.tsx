'use client';

import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Zone } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const zoneColorsClasses: Record<string, { text: string; bg: string; dot: string }> = {
  'Nord': {
    text: 'text-lime-600',
    bg: 'bg-lime-100',
    dot: 'bg-lime-200',
  },
  'Centro': {
    text: 'text-orange-600',
    bg: 'bg-orange-100',
    dot: 'bg-orange-200',
  },
  'Sud e isole': {
    text: 'text-purple-600',
    bg: 'bg-purple-100',
    dot: 'bg-purple-200',
  },
  'Estero': {
    text: 'text-pink-600',
    bg: 'bg-pink-100',
    dot: 'bg-pink-200',
  },
  'Default': {
    text: 'text-zinc-600',
    bg: 'bg-zinc-100',
    dot: 'bg-zinc-200',
  },
};

export default function ZonesBadge({ zones }: { zones: Zone[] }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const count = zones.length;

  if (!count) return <div>Nessun&apos;area di intesse</div>;

  if (count === 1) {
    const zone = zones[0];
    const zoneClass = zoneColorsClasses[zone.name] || zoneColorsClasses['Default'];
    return <Badge className={cn(zoneClass.text, zoneClass.bg)}>{zone.name}</Badge>;
  }

  return (
    <DropdownMenu
      open={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
    >
      <DropdownMenuTrigger className='flex items-center gap-2 p-2 bg-zinc-50 rounded-md w-max hover:bg-zinc-100 transition-colors'>
        <div className='flex -space-x-3'>
          {zones.slice(0, 4).map((zone, idx) => {
            const zoneClass = zoneColorsClasses[zone.name] || zoneColorsClasses['Default'];
            return (
              <div
                key={idx}
                className={cn('w-5 h-5 rounded-full border border-white', zoneClass.dot)}
              />
            );
          })}
        </div>
        <span className='text-xs font-semibold text-zinc-700 whitespace-nowrap'>{count} aree</span>
        <ChevronDown className={cn('size-4 transition-transform', isDropdownOpen ? 'rotate-180' : '')} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className='flex flex-col gap-2 p-2'>
        {zones.map((zone, idx) => {
          const zoneClass = zoneColorsClasses[zone.name] || zoneColorsClasses['Default'];
          return (
            <Badge
              key={idx}
              className={cn('w-full', zoneClass.text, zoneClass.bg)}
            >
              {zone.name}
            </Badge>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const ZoneBadge = ({ zone }: { zone: Zone }) => {
  const zoneClass = zoneColorsClasses[zone.name] || zoneColorsClasses['Default'];

  return <Badge className={cn(zoneClass.text, zoneClass.bg)}>{zone.name}</Badge>;
};
