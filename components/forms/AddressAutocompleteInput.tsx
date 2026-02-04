'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type AddressDetails = {
  formattedAddress: string;
  streetName: string | null;
  streetNumber: string | null;
  city: string | null;
  zipCode: string | null;
  country: string | null;
  countryCode: string | null;
  lat: number | null;
  lng: number | null;
  placeId: string;
  isValid: boolean;
  missingFields: string[];
};

type AddressAutocompleteInputProps = {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  onDetails: (details: AddressDetails) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  countryCode?: string;
};

type Prediction = {
  description: string;
  placeId: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

const DEFAULT_WARNING =
  'Seleziona un indirizzo dai suggerimenti per validare correttamente i dati.';

function createSessionToken(): string {
  // Places API session token: keep it short and URL-safe.
  // crypto.randomUUID() is widely supported; we strip hyphens => 32 chars.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '');
  }
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export default function AddressAutocompleteInput({
  id,
  value,
  onValueChange,
  onDetails,
  placeholder,
  disabled,
  error,
  className,
  countryCode = 'it',
}: AddressAutocompleteInputProps) {
  const [autocompleteAvailable, setAutocompleteAvailable] = useState(true);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [hasSelectedPlace, setHasSelectedPlace] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const blurTimeoutRef = useRef<number | null>(null);
  const hasInitializedRef = useRef(false);
  const sessionTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    if (value && value.trim()) {
      setHasSelectedPlace(true);
    }
    hasInitializedRef.current = true;
  }, [value]);

  useEffect(() => {
    if (!autocompleteAvailable) return;
    if (!value || value.trim().length < 3) {
      setPredictions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setIsLoading(true);

      const token = sessionTokenRef.current;
      const params = new URLSearchParams({
        input: value,
        ...(countryCode ? { countryCode } : {}),
        ...(token ? { sessionToken: token } : {}),
      });

      fetch(`/api/google/autocomplete?${params.toString()}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((payload) => {
          if (!payload?.success) {
            setPredictions([]);
            setIsOpen(false);

            if ((payload?.message || '').includes('Missing GOOGLE_PLACES_API_KEY')) {
              setAutocompleteAvailable(false);
              setWarning('Autocomplete non disponibile: configura GOOGLE_PLACES_API_KEY sul server.');
              return;
            }

            setWarning(payload?.message || 'Autocomplete non disponibile in questo momento.');
            return;
          }

          const preds = (payload?.data || []) as Prediction[];
          setPredictions(preds);
          setIsOpen(preds.length > 0);
        })
        .catch((err) => {
          if (err?.name === 'AbortError') return;
          setWarning('Autocomplete non disponibile in questo momento.');
          setPredictions([]);
          setIsOpen(false);
        })
        .finally(() => setIsLoading(false));
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [autocompleteAvailable, value, countryCode]);

  const fetchDetails = async (placeId: string) => {
    const response = await fetch(`/api/google/geocode?placeId=${encodeURIComponent(placeId)}`);
    const payload = await response.json();
    if (!payload?.success || !payload?.data) {
      throw new Error(payload?.message || 'Geocoding failed');
    }
    return payload.data as AddressDetails;
  };

  const handleSelectPrediction = async (prediction: Prediction) => {
    try {
      const details = await fetchDetails(prediction.placeId);
      onValueChange(details.formattedAddress);
      onDetails(details);
      setHasSelectedPlace(true);
      sessionTokenRef.current = null; // end session on select
      setWarning(details.isValid ? null : DEFAULT_WARNING);
      setPredictions([]);
      setIsOpen(false);
    } catch {
      setWarning('Indirizzo non valido. Seleziona un risultato valido dai suggerimenti.');
      setIsOpen(false);
    }
  };

  const onBlur = () => {
    blurTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
      if (autocompleteAvailable && value?.trim() && !hasSelectedPlace) {
        setWarning(DEFAULT_WARNING);
      }
    }, 150);
  };

  const onFocus = () => {
    if (blurTimeoutRef.current) {
      window.clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    if (!sessionTokenRef.current) sessionTokenRef.current = createSessionToken();
    if (predictions.length > 0) setIsOpen(true);
  };

  const onChange = (nextValue: string) => {
    onValueChange(nextValue);
    setHasSelectedPlace(false);
    setWarning(null);
    setIsOpen(true);
  };

  return (
    <div className='relative'>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete='street-address'
        className={cn(error ? 'border-destructive text-destructive' : '', className)}
      />
      {isLoading && (
        <p className='text-xs text-zinc-500 mt-2'>Caricamento suggerimenti...</p>
      )}
      {isOpen && predictions.length > 0 && (
        <div className='absolute z-50 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-md'>
          <ul className='max-h-60 overflow-y-auto py-1 text-sm'>
            {predictions.map((prediction) => (
              <li key={prediction.placeId}>
                <button
                  type='button'
                  className='flex w-full text-left px-3 py-2 hover:bg-zinc-100'
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelectPrediction(prediction)}
                >
                  <span className='font-medium'>
                    {prediction.structured_formatting?.main_text || prediction.description}
                  </span>
                  {prediction.structured_formatting?.secondary_text && (
                    <span className='ml-2 text-zinc-500'>
                      {prediction.structured_formatting.secondary_text}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {warning && (
        <p className='text-xs text-amber-600 mt-2'>{warning}</p>
      )}
    </div>
  );
}
