import type { UseFormSetValue } from 'react-hook-form';
import type { AddressDetails } from '@/components/forms/AddressAutocompleteInput';

type ApplyOptions = {
  setCity?: boolean;
  setZip?: boolean;
  setCountry?: boolean;
};

export function applyAddressDetails(
  setValue: UseFormSetValue<any>,
  details: AddressDetails,
  options: ApplyOptions = { setCity: true, setZip: true, setCountry: true },
) {
  setValue('address', details.formattedAddress, { shouldDirty: true, shouldTouch: true });
  setValue('addressFormatted', details.formattedAddress, { shouldDirty: true, shouldTouch: true });
  setValue('streetName', details.streetName ?? '', { shouldDirty: true, shouldTouch: true });
  setValue('streetNumber', details.streetNumber ?? '', { shouldDirty: true, shouldTouch: true });
  setValue('placeId', details.placeId ?? '', { shouldDirty: true, shouldTouch: true });
  setValue('latitude', details.lat !== null ? String(details.lat) : undefined, {
    shouldDirty: true,
    shouldTouch: true,
  });
  setValue('longitude', details.lng !== null ? String(details.lng) : undefined, {
    shouldDirty: true,
    shouldTouch: true,
  });

  if (options.setCity) {
    setValue('city', details.city ?? '', { shouldDirty: true, shouldTouch: true });
  }

  if (options.setZip) {
    setValue('zipCode', details.zipCode ?? '', { shouldDirty: true, shouldTouch: true });
  }

  if (options.setCountry) {
    setValue('countryName', details.country ?? '', { shouldDirty: true, shouldTouch: true });
    setValue('countryCode', details.countryCode ?? '', { shouldDirty: true, shouldTouch: true });
  }
}

export function applyBillingAddressDetails(
  setValue: UseFormSetValue<any>,
  details: AddressDetails,
  options: ApplyOptions = { setCity: true, setZip: true, setCountry: true },
) {
  setValue('billingAddress', details.formattedAddress, { shouldDirty: true, shouldTouch: true });
  setValue('billingAddressFormatted', details.formattedAddress, { shouldDirty: true, shouldTouch: true });
  setValue('billingStreetName', details.streetName ?? '', { shouldDirty: true, shouldTouch: true });
  setValue('billingStreetNumber', details.streetNumber ?? '', { shouldDirty: true, shouldTouch: true });
  setValue('billingPlaceId', details.placeId ?? '', { shouldDirty: true, shouldTouch: true });
  setValue('billingLatitude', details.lat !== null ? String(details.lat) : undefined, {
    shouldDirty: true,
    shouldTouch: true,
  });
  setValue('billingLongitude', details.lng !== null ? String(details.lng) : undefined, {
    shouldDirty: true,
    shouldTouch: true,
  });

  if (options.setCity) {
    setValue('billingCity', details.city ?? '', { shouldDirty: true, shouldTouch: true });
  }

  if (options.setZip) {
    setValue('billingZipCode', details.zipCode ?? '', { shouldDirty: true, shouldTouch: true });
  }

  if (options.setCountry) {
    setValue('billingCountryName', details.country ?? '', { shouldDirty: true, shouldTouch: true });
    setValue('billingCountryCode', details.countryCode ?? '', { shouldDirty: true, shouldTouch: true });
  }
}
