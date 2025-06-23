'use client';

import { useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Language, LANGUAGES } from '@/lib/constants';

type LanguageSelectState = {
  languages: Language[];
} & Record<string, unknown>;

type LanguageSelectProps = {
  state: LanguageSelectState;
  setState: React.Dispatch<React.SetStateAction<LanguageSelectState>>;
};

export default function LanguagesSelect({
  state,
  setState,
}: LanguageSelectProps) {
  const [value] = useState<string>('');

  return (
    <>
      <label
        htmlFor='languages'
        className='block text-sm font-semibold mb-2'
      >
        Lingue
      </label>

      <Select
        value={value}
        onValueChange={(languageId: string) => {
          const lang = LANGUAGES.find((l) => l.id === languageId);
          if (!lang) return;

          setState((prev) => {
            if (prev.languages.some((l) => l.id === languageId)) {
              return prev;
            }

            return {
              ...prev,
              languages: [...prev.languages, lang],
            };
          });
        }}
      >
        <SelectTrigger
          size='sm'
          className='w-full mb-2'
        >
          Seleziona una o più lingue
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((language) => (
            <SelectItem
              key={language.id}
              value={language.id}
              disabled={state.languages.some((l) => l.id === language.id)}
            >
              {language.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {state.languages && state.languages.length > 0 && (
        <div className='w-full flex flex-nowrap gap-1 overflow-x-auto mb-4'>
          {state.languages.map((language) => (
            <Badge
              key={language.id}
              variant='outline'
              className='group transition-colors hover:cursor-pointer hover:border-red-500'
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  languages: prev.languages.filter((l) => l.id !== language.id),
                }))
              }
            >
              {language.name}{' '}
              <X className='transition-colors group-hover:text-red-700' />
            </Badge>
          ))}
        </div>
      )}
    </>
  );
}
