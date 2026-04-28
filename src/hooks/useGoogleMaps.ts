'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { loader } from '@/components/PollingMap'; // Keeping the loader reference

/**
 * Headless hook for Google Maps logic.
 * Encapsulates initialization, geocoding, and marker management.
 */
export function useGoogleMaps(address: string) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loadError, setLoadError] = useState(false);

  const initMap = useCallback(async () => {
    try {
      const { Map } = await loader.importLibrary('maps');
      const { Geocoder } = await loader.importLibrary('geocoding');
      const { Marker } = await loader.importLibrary('marker');

      if (!mapRef.current) return;

      const newMap = new Map(mapRef.current, {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 4,
        styles: [{ featureType: 'all', elementType: 'geometry', stylers: [{ color: '#242f3e' }] }],
      });

      setMap(newMap);

      if (address && address !== '123 Test St') {
        const geocoder = new Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            newMap.setCenter(results[0].geometry.location);
            newMap.setZoom(14);
            new Marker({
              map: newMap,
              position: results[0].geometry.location,
              title: 'Your Location',
            });
          }
        });
      }
    } catch (e) {
      console.error('Error loading Google Maps:', e);
      setLoadError(true);
    }
  }, [address]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  return { mapRef, map, loadError };
}
