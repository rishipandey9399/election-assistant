import Redis from 'ioredis';

import { env } from './env';
import logger from './logger';

/**
 * Singleton Redis client.
 * Connects only if REDIS_URL is provided.
 * Uses lazyConnect to avoid holding open handles in non-production environments.
 */
class RedisClient {
  private static instance: Redis | null = null;
  private static metricInterval: NodeJS.Timeout | null = null;

  static getInstance(): Redis | null {
    if (!env.REDIS_URL) return null;

    if (!this.instance) {
      this.instance = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        retryStrategy(times) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      this.instance.on('error', (err) => {
        logger.error({ err }, 'Redis connection error');
      });

      this.instance.on('connect', () => {
        logger.info('Redis connection established');
      });

      // Periodic metric reporting for BigQuery/Observability
      if (!this.metricInterval && process.env.NODE_ENV === 'production') {
        this.metricInterval = setInterval(() => {
          if (this.instance) {
            logger.info(
              {
                redis: {
                  status: this.instance.status,
                  ready: this.instance.status === 'ready',
                },
              },
              'Redis Health Metrics'
            );
          }
        }, 60000);
      }
    }

    return this.instance;
  }

  /** Gracefully close the connection (e.g., on shutdown or test teardown). */
  static async quit(): Promise<void> {
    if (this.metricInterval) {
      clearInterval(this.metricInterval);
      this.metricInterval = null;
    }
    if (this.instance) {
      await this.instance.quit();
      this.instance = null;
    }
  }
}

export const redis = RedisClient.getInstance();
export const quitRedis = RedisClient.quit.bind(RedisClient);
