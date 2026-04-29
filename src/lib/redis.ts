import Redis from 'ioredis';

import { env } from './env';

/**
 * Singleton Redis client.
 * Connects only if REDIS_URL is provided.
 * Uses lazyConnect to avoid holding open handles in non-production environments.
 */
class RedisClient {
  private static instance: Redis | null = null;

  static getInstance(): Redis | null {
    if (!env.REDIS_URL) return null;

    if (!this.instance) {
      this.instance = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        lazyConnect: true, // Don't connect until first command
        retryStrategy(times) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      this.instance.on('error', (err) => {
        console.warn('Redis connection error:', err.message);
      });
    }

    return this.instance;
  }

  /** Gracefully close the connection (e.g., on shutdown or test teardown). */
  static async quit(): Promise<void> {
    if (this.instance) {
      await this.instance.quit();
      this.instance = null;
    }
  }
}

export const redis = RedisClient.getInstance();
export const quitRedis = RedisClient.quit.bind(RedisClient);
