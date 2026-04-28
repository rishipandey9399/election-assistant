/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, waitFor } from '@testing-library/react';
import PollingMap from '@/components/PollingMap';

// Mock the Loader
jest.mock('@googlemaps/js-api-loader', () => ({
  Loader: jest.fn().mockImplementation(() => ({
    importLibrary: jest.fn().mockImplementation((lib) => {
      if (lib === 'maps') {
        return Promise.resolve({
          Map: jest.fn().mockImplementation(() => ({
            setCenter: jest.fn(),
            setZoom: jest.fn(),
          })),
          Marker: jest.fn(),
        });
      }
      if (lib === 'geocoding') {
        return Promise.resolve({
          Geocoder: jest.fn().mockImplementation(() => ({
            geocode: jest.fn().mockImplementation((req, callback) => {
              callback([{ geometry: { location: { lat: () => 0, lng: () => 0 } } }], 'OK');
            }),
          })),
        });
      }
      if (lib === 'marker') {
        return Promise.resolve({
          Marker: jest.fn().mockImplementation(() => ({})),
        });
      }
    }),
  })),
}));

describe('PollingMap', () => {
  it('renders a map container', () => {
    render(<PollingMap address="" />);
    expect(screen.getByLabelText(/Map showing polling places/i)).toBeInTheDocument();
  });

  it('renders fail-safe UI when loader fails', async () => {
    const { loader } = require('../PollingMap');
    jest.spyOn(loader, 'importLibrary').mockRejectedValue(new Error('Load failure'));

    render(<PollingMap address="fail" />);

    // Check for fail-safe text
    await waitFor(
      () => {
        expect(screen.getByText(/could not be loaded/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
