import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock Redis globally to prevent open handles in tests
jest.mock('@/lib/redis', () => ({
  redis: null,
  quitRedis: jest.fn().mockResolvedValue(undefined),
}));

// Mock logger globally to prevent pino worker in tests
jest.mock('@/lib/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock Google Maps Loader
jest.mock('@googlemaps/js-api-loader', () => ({
  Loader: jest.fn().mockImplementation(() => ({
    load: jest.fn().mockResolvedValue({}),
    importLibrary: jest.fn().mockImplementation((name) => {
      if (name === 'maps')
        return Promise.resolve({
          Map: jest.fn().mockImplementation(() => ({ setCenter: jest.fn(), setZoom: jest.fn() })),
        });
      if (name === 'geocoding')
        return Promise.resolve({
          Geocoder: jest.fn().mockImplementation(() => ({
            geocode: jest.fn().mockImplementation((_request, callback) => {
              callback([{ geometry: { location: { lat: 0, lng: 0 } } }], 'OK');
            }),
          })),
        });
      if (name === 'marker') return Promise.resolve({ Marker: jest.fn() });
      return Promise.resolve({});
    }),
  })),
}));

// Mock the global google object

global.google = {
  maps: {
    Map: jest.fn().mockImplementation(() => ({
      setCenter: jest.fn(),
      setZoom: jest.fn(),
    })),
    Marker: jest.fn(),
    Geocoder: jest.fn().mockImplementation(() => ({
      geocode: jest.fn().mockImplementation((_request, callback) => {
        callback([{ geometry: { location: { lat: 0, lng: 0 } } }], 'OK');
      }),
    })),
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
