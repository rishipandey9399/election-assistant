import { redis } from './redis';

type CacheEntry<T> = {
  data: T;
  expiry: number;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();

/**
 * Simple shared TTL cache to improve API efficiency by reducing
 * redundant external API calls. Uses Redis if available, falls back to in-memory.
 *
 * @param key Unique key for the cache entry.
 * @param ttl Time to live in milliseconds.
 * @param fetcher Async function to fetch the data if not in cache.
 * @returns The cached or freshly fetched data.
 */
export async function withCache<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  // 1. Try Redis
  if (redis) {
    try {
      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached) as T;
      }

      const data = await fetcher();
      // Set in Redis with PX (milliseconds)
      await redis.set(key, JSON.stringify(data), 'PX', ttl);
      return data;
    } catch (err) {
      console.warn('Redis cache failed, falling back to in-memory:', err);
    }
  }

  // 2. Fallback to in-memory
  const now = Date.now();
  const entry = memoryCache.get(key);

  if (entry && entry.expiry > now) {
    return entry.data as T;
  }

  const data = await fetcher();
  memoryCache.set(key, { data, expiry: now + ttl });
  return data;
}
