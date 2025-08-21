'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { X } from 'lucide-react';
import { ArtistManagerSelectData } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ArtistManagersSelectProps = {
  artistManagers: ArtistManagerSelectData[];
  value: number[]; // array of profile IDs
  onChange: (newValue: number[]) => void;
  hasError: boolean;
};

export default function ArtistManagersSelect({ artistManagers, value, onChange, hasError }: ArtistManagersSelectProps) {
  const handleAddManager = (profileId: string) => {
    const id = parseInt(profileId);
    if (value.includes(id)) return;
    onChange([...value, id]);
  };

  const handleRemoveManager = (profileId: number) => {
    onChange(value.filter((id) => id !== profileId));
  };

  return (
    <>
      <Select onValueChange={handleAddManager}>
        <SelectTrigger
          id='artist-managers'
          size='sm'
          className={cn('w-full', hasError && 'border-destructive text-destructive')}
        >
          Seleziona uno o più manager
        </SelectTrigger>
        <SelectContent>
          {artistManagers.map((manager) => (
            <SelectItem
              key={manager.profileId}
              value={manager.profileId.toString()}
              disabled={value.includes(manager.profileId)}
            >
              <div className='flex items-center gap-2 flex-nowrap'>
                <Avatar className='w-6 h-6'>
                  <AvatarImage src={manager.avatarUrl} />
                  <AvatarFallback>{manager.name.substring(0, 1)}</AvatarFallback>
                </Avatar>
                {manager.name} {manager.surname}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {value.length > 0 && (
        <div className='w-full flex flex-nowrap gap-1 overflow-x-auto mt-2'>
          {value.map((managerProfileId) => {
            const managerObj = artistManagers.find((m) => m.profileId === managerProfileId);
            if (!managerObj) return null;

            return (
              <Badge
                key={managerProfileId}
                variant='outline'
                className='group transition-colors hover:cursor-pointer hover:text-destructive hover:border-destructive'
                onClick={() => handleRemoveManager(managerProfileId)}
              >
                {managerObj.name} {managerObj.surname}
                <X className='size-3 transition-colors group-hover:text-destructive ml-1' />
              </Badge>
            );
          })}
        </div>
      )}
    </>
  );
}
