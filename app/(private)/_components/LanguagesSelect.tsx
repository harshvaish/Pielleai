'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { Language } from '@/lib/types';

type LanguageSelectProps = {
  languages: Language[];
  value: number[]; // array of language IDs
  onChange: (newValue: number[]) => void;
  hasError: boolean;
};

export default function LanguagesSelect({
  languages,
  value,
  onChange,
  hasError,
}: LanguageSelectProps) {
  const handleAddLanguage = (languageId: string) => {
    const id = parseInt(languageId);
    if (value.includes(id)) return;
    onChange([...value, id]);
  };

  const handleRemoveLanguage = (languageId: number) => {
    onChange(value.filter((id) => id !== languageId));
  };

  return (
    <>
      <Select onValueChange={handleAddLanguage}>
        <SelectTrigger
          id='languages'
          size='sm'
          className={cn(
            'w-full',
            hasError && 'border-destructive text-destructive'
          )}
        >
          Seleziona una o più lingue
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem
              key={language.id}
              value={language.id.toString()}
              disabled={value.includes(language.id)}
            >
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {value.length > 0 && (
        <div className='w-full flex flex-nowrap gap-1 overflow-x-auto mt-2'>
          {value.map((languageId) => {
            const langObj = languages.find((l) => l.id === languageId);
            if (!langObj) return null;

            return (
              <Badge
                key={languageId}
                variant='outline'
                className='group transition-colors hover:cursor-pointer hover:text-destructive hover:border-destructive'
                onClick={() => handleRemoveLanguage(languageId)}
              >
                {langObj.name}
                <X
                  className='transition-colors group-hover:text-destructive ml-1'
                  size={12}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </>
  );
}
