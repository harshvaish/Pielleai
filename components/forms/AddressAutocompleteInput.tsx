'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { loadGoogleMapsScript } from '@/lib/utils/google-maps';
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
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
};

const DEFAULT_WARNING =
  'Seleziona un indirizzo dai suggerimenti per validare correttamente i dati.';

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
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const [ready, setReady] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [hasSelectedPlace, setHasSelectedPlace] = useState(false);
  const blurTimeoutRef = useRef<number | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (!apiKey) return;
    loadGoogleMapsScript(apiKey)
      .then(() => setReady(true))
      .catch(() => setReady(false));
  }, [apiKey]);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    if (value && value.trim()) {
      setHasSelectedPlace(true);
    }
    hasInitializedRef.current = true;
  }, [value]);

  const autocompleteService = useMemo(() => {
    if (!ready) return null;
    const googleMaps = (window as any).google;
    if (!googleMaps?.maps?.places?.AutocompleteService) return null;
    return new googleMaps.maps.places.AutocompleteService();
  }, [ready]);

  useEffect(() => {
    if (!autocompleteService) return;
    if (!value || value.trim().length < 3) {
      setPredictions([]);
      return;
    }

    const timeout = window.setTimeout(() => {
      autocompleteService.getPlacePredictions(
        {
          input: value,
          types: ['address'],
          componentRestrictions: { country: countryCode },
        },
        (preds: Prediction[] | null, status: string) => {
          if (status !== 'OK' || !preds) {
            setPredictions([]);
            return;
          }
          setPredictions(preds);
        },
      );
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [autocompleteService, value, countryCode]);

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
      const details = await fetchDetails(prediction.place_id);
      onValueChange(details.formattedAddress);
      onDetails(details);
      setHasSelectedPlace(true);
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
      if (value?.trim() && !hasSelectedPlace) {
        setWarning(DEFAULT_WARNING);
      }
    }, 150);
  };

  const onFocus = () => {
    if (blurTimeoutRef.current) {
      window.clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
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
      {isOpen && predictions.length > 0 && (
        <div className='absolute z-50 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-md'>
          <ul className='max-h-60 overflow-y-auto py-1 text-sm'>
            {predictions.map((prediction) => (
              <li key={prediction.place_id}>
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
      {!apiKey && (
        <p className='text-xs text-amber-600 mt-2'>
          Autocomplete non disponibile: configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
        </p>
      )}
    </div>
  );
}
