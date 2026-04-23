type CacheEntry<T> = {
  data: T;
  expiry: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Simple in-memory TTL cache to improve API efficiency by reducing
 * redundant external API calls (e.g., to Gemini or Civic Info).
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
  const now = Date.now();
  const entry = cache.get(key);

  if (entry && entry.expiry > now) {
    return entry.data as T;
  }

  const data = await fetcher();
  cache.set(key, { data, expiry: now + ttl });
  return data;
}
