const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

/**
 * A basic in-memory rate limiter.
 * In a production environment, this should be replaced with a Redis-backed
 * rate limiter (like @upstash/ratelimit) since Map() is scoped to the specific serverless function instance.
 *
 * @param ip The IP address or identifier to rate limit.
 * @param limit Max requests allowed in the window.
 * @param windowMs Time window in milliseconds.
 * @returns boolean - true if allowed, false if rate limited.
 */
export function rateLimit(ip: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // If the window has passed, reset the count
  if (now - record.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // If within the window, check the limit
  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}
