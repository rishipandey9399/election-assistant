import { RATE_LIMITS } from './constants';
import { redis } from './redis';

const memoryRateLimitMap = new Map<string, { count: number; timestamp: number }>();

/**
 * A shared rate limiter using Redis (atomic INCR) or in-memory fallback.
 *
 * @param req The incoming request.
 * @param limit Max requests allowed in the window.
 * @param windowMs Time window in milliseconds.
 * @returns Promise<boolean> - true if allowed, false if rate limited.
 */
export async function rateLimit(
  req: Request,
  limit = RATE_LIMITS.DEFAULT_MAX_REQUESTS,
  windowMs = RATE_LIMITS.DEFAULT_WINDOW_MS
): Promise<boolean> {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
  const key = `ratelimit:${ip}`;

  // 1. Try Redis
  if (redis) {
    try {
      const current = await redis.incr(key);
      if (current === 1) {
        // Set expiry on the first request in the window
        await redis.pexpire(key, windowMs);
      }

      if (current > limit) {
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Redis rate-limit failed, falling back to in-memory:', err);
    }
  }

  // 2. Fallback to in-memory
  const now = Date.now();
  const record = memoryRateLimitMap.get(ip);

  if (!record) {
    memoryRateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - record.timestamp > windowMs) {
    memoryRateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}
