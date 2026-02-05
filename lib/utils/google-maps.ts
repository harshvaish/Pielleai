let googleMapsPromise: Promise<void> | null = null;

export function loadGoogleMapsScript(
  apiKey: string,
  language: string = 'it',
  region: string = 'IT',
): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if ((window as any).google?.maps?.places) return Promise.resolve();
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const params = new URLSearchParams({
      key: apiKey,
      libraries: 'places',
      language,
      region,
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps script load failed'));
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
