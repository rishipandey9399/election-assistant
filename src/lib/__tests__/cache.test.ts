import { withCache } from '../cache';
import { redis } from '../redis';

// Mock Redis
jest.mock('../redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

describe('withCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches from Redis if available', async () => {
    (redis?.get as jest.Mock).mockResolvedValue(JSON.stringify('cached-data'));
    const fetcher = jest.fn();

    const result = await withCache('test-key', 1000, fetcher);

    expect(result).toBe('cached-data');
    expect(fetcher).not.toHaveBeenCalled();
    expect(redis?.get).toHaveBeenCalledWith('test-key');
  });

  it('calls fetcher and saves to Redis if not in cache', async () => {
    (redis?.get as jest.Mock).mockResolvedValue(null);
    const fetcher = jest.fn().mockResolvedValue('fresh-data');

    const result = await withCache('test-key', 1000, fetcher);

    expect(result).toBe('fresh-data');
    expect(fetcher).toHaveBeenCalled();
    expect(redis?.set).toHaveBeenCalledWith('test-key', JSON.stringify('fresh-data'), 'PX', 1000);
  });

  it('falls back to fetcher if Redis fails', async () => {
    (redis?.get as jest.Mock).mockRejectedValue(new Error('Redis Down'));
    const fetcher = jest.fn().mockResolvedValue('fallback-data');

    const result = await withCache('test-key', 1000, fetcher);

    expect(result).toBe('fallback-data');
    expect(fetcher).toHaveBeenCalled();
  });
});
