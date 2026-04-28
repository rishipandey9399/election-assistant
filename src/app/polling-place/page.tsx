'use client';
import { useState, useCallback } from 'react';
import { MapPin, Search, Navigation } from 'lucide-react';
import styles from './page.module.css';
import PollingMap from '@/components/PollingMap';

export default function PollingPlacePage() {
  const [address, setAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<null | Record<string, string>>(null);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!address) return;

      setIsSearching(true);
      // Simulate API call to Google Civic Info
      setTimeout(() => {
        setResult({
          locationName: 'Community Center Gymnasium',
          address: '123 Main Street, Anytown, CA 90210',
          hours: '7:00 AM - 8:00 PM',
          distance: '1.2 miles away',
        });
        setIsSearching(false);
      }, 1500);
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
