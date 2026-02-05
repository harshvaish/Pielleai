import { NextRequest, NextResponse } from 'next/server';

type CacheEntry = { expiresAt: number; value: any };
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

type GeocodeComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GeocodeResult = {
  address_components: GeocodeComponent[];
  formatted_address: string;
  place_id: string;
  geometry?: {
    location?: {
      lat: number;
      lng: number;
    };
  };
};

const getComponent = (components: GeocodeComponent[], type: string) =>
  components.find((component) => component.types.includes(type))?.long_name ?? null;

const getComponentShort = (components: GeocodeComponent[], type: string) =>
  components.find((component) => component.types.includes(type))?.short_name ?? null;

export async function GET(request: NextRequest) {
  const placeId = request.nextUrl.searchParams.get('placeId');
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { success: false, message: 'Google Geocoding API key missing.' },
      { status: 500 },
    );
  }

  if (!placeId) {
    return NextResponse.json(
      { success: false, message: 'Missing placeId.' },
      { status: 400 },
    );
  }

  const cached = cache.get(placeId);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json({ success: true, data: cached.value });
  }

  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('language', 'it');
  url.searchParams.set('region', 'IT');

  const response = await fetch(url.toString());
  if (!response.ok) {
    return NextResponse.json(
      { success: false, message: 'Geocoding request failed.' },
      { status: 502 },
    );
  }

  const payload = await response.json();
  if (payload.status !== 'OK' || !payload.results?.length) {
    return NextResponse.json(
      { success: false, message: payload.error_message || 'Place not found.' },
      { status: 404 },
    );
  }

  const result = payload.results[0] as GeocodeResult;
  const components = result.address_components || [];

  const streetNumber = getComponent(components, 'street_number');
  const streetName = getComponent(components, 'route');
  const city =
    getComponent(components, 'locality') ||
    getComponent(components, 'postal_town') ||
    getComponent(components, 'administrative_area_level_3') ||
    getComponent(components, 'administrative_area_level_2');
  const zipCode = getComponent(components, 'postal_code');
  const country = getComponent(components, 'country');
  const countryCode = getComponentShort(components, 'country');

  const missingFields: string[] = [];
  if (!streetName) missingFields.push('streetName');
  if (!streetNumber) missingFields.push('streetNumber');
  if (!city) missingFields.push('city');
  if (!zipCode) missingFields.push('zipCode');
  if (!country) missingFields.push('country');

  const data = {
    formattedAddress: result.formatted_address,
    streetName,
    streetNumber,
    city,
    zipCode,
    country,
    countryCode,
    lat: result.geometry?.location?.lat ?? null,
    lng: result.geometry?.location?.lng ?? null,
    placeId: result.place_id,
    isValid: missingFields.length === 0,
    missingFields,
  };

  cache.set(placeId, { expiresAt: Date.now() + CACHE_TTL_MS, value: data });

  return NextResponse.json({ success: true, data });
}
