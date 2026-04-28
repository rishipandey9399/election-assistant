'use client';

import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { Loader } from '@googlemaps/js-api-loader';

// Initialize loader options
export const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
});

type PollingMapProps = {
  address: string;
  pollingPlaces?: unknown[];
};

/**
 * PollingMap component focuses strictly on rendering the UI.
 * Logic is encapsulated in useGoogleMaps hook.
 */
export default function PollingMap({ address, pollingPlaces: _pollingPlaces }: PollingMapProps) {
  const { mapRef, loadError } = useGoogleMaps(address);

  if (loadError) {
    return (
      <div
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '12px',
          background: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
        }}
        aria-label="Map loading failed"
      >
        <p>
          Google Maps could not be loaded. Please check your connection or try again later.
          [Fail-Safe UI]
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '400px', borderRadius: '12px' }}
      aria-label="Interactive map showing polling places based on your address"
      role="application"
    />
  );
}
