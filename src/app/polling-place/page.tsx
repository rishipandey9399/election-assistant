'use client';
import { MapPin, Search, Navigation } from 'lucide-react';
import { useState, useCallback } from 'react';

import PollingMap from '@/components/PollingMap';

import styles from './page.module.css';

export default function PollingPlacePage() {
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!address) return;

      setIsSearching(true);
      try {
        const response = await fetch('/api/civic-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address }),
        });

        if (!response.ok) {
          throw new Error('Failed to find polling place');
        }

        const data = await response.json();

        if (data.pollingLocations && data.pollingLocations.length > 0) {
          const location = data.pollingLocations[0];
          setResult({
            locationName:
              location.locationName || location.address.locationName || 'Polling Location',
            address: `${location.address.line1}, ${location.address.city}, ${location.address.state} ${location.address.zip}`,
            hours: location.pollingHours || 'Unknown Hours',
            distance: 'Check map', // We'd need Maps Matrix API for real distance
          });
        } else {
          setResult({
            locationName: 'No Polling Location Found',
            address: 'We could not find a polling location for this address.',
            hours: '',
            distance: '',
          });
        }
      } catch (error) {
        console.error(error);
        setResult({
          locationName: 'Error',
          address: 'Could not connect to the civic information service.',
          hours: '',
          distance: '',
        });
      } finally {
        setIsSearching(false);
      }
    },
    [address]
  );

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <div className={styles.header}>
          <h1 className="text-gradient">Find Your Polling Place</h1>
          <p>Enter your registered voting address to find where you need to go on Election Day.</p>
        </div>

        <div className={styles.contentWrapper}>
          <div className={`${styles.searchCard} glass-panel`}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="address">Registered Address</label>
                <div className={styles.inputWrapper}>
                  <MapPin size={20} className={styles.inputIcon} />
                  <input
                    type="text"
                    id="address"
                    placeholder="e.g., 1600 Pennsylvania Ave NW, Washington, DC"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className={styles.searchBtn}
                disabled={isSearching}
                aria-busy={isSearching}
                onClick={(e) => {
                  if (isSearching) e.preventDefault();
                }}
              >
                {isSearching ? (
                  'Searching...'
                ) : (
                  <>
                    <Search size={18} />
                    Find Location
                  </>
                )}
              </button>
            </form>

            {result && (
              <div className={styles.resultContainer} aria-live="polite">
                <div className={styles.resultHeader}>
                  <h3>Your Polling Location</h3>
                  <span
                    className={styles.distanceBadge}
                    aria-label={`Distance: ${result.distance}`}
                  >
                    {result.distance}
                  </span>
                </div>

                <div className={styles.locationDetails}>
                  <div className={styles.detailItem}>
                    <h4>{result.locationName}</h4>
                    <p>{result.address}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <h4>Hours</h4>
                    <p>{result.hours}</p>
                  </div>
                </div>

                <button
                  className={styles.directionsBtn}
                  aria-label={`Get directions to ${result.locationName}`}
                >
                  <Navigation size={18} aria-hidden="true" />
                  Get Directions
                </button>
              </div>
            )}
          </div>

          <div className={`${styles.mapContainer} glass-panel`} role="region" aria-label="Map view">
            <PollingMap address={address} />
          </div>
        </div>
      </div>
    </div>
  );
}
